import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const html = await fs.readFile(new URL('index.html', root), 'utf8');
assert.match(html, /^<!DOCTYPE html>/i, 'Missing HTML doctype');
assert.match(html, /<html lang="zh-CN">/, 'Missing document language');
assert.match(html, /<style id="utilities">/, 'Run npm run build:css first');
assert.doesNotMatch(html, /<(?:script|link)\b[^>]*(?:src|href)=["']https?:/i, 'Runtime assets must be local');
assert.match(html, /Copyright \(c\) Tailwind Labs, Inc\./, 'Keep the Tailwind copyright notice');
let count = 0;
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
  new vm.Script(match[1], { filename: `index-inline-${++count}.js` });
}
assert.ok(count > 0, 'Missing application script');
const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate static element IDs');
for (const match of markup.matchAll(/\bon(?:click|change|input)="([^"]+)"/g)) {
  new vm.Script(`(function(event){${match[1]}})`, { filename: 'inline-handler.js' });
}
for (const name of ['README.md', 'README.en.md', 'CONTRIBUTING.md', 'CONTRIBUTING.en.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  const text = await fs.readFile(new URL(name, root), 'utf8');
  assert.ok(text.trim().length > 0, `${name} is empty`);
}
JSON.parse(await fs.readFile(new URL('package.json', root), 'utf8'));
console.log(`Static checks passed: ${count} application script, ${ids.length} unique IDs, inline handlers, offline assets, licenses and documentation.`);
