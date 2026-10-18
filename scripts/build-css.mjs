import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const root = fileURLToPath(new URL('../', import.meta.url));
const htmlPath = new URL('../index.html', import.meta.url);
let html = await fs.readFile(htmlPath, 'utf8');
// Do not scan the generated stylesheet as HTML content.
const source = html.replace(/<style id="utilities">[\s\S]*?<\/style>\s*/, '');
await fs.mkdir(path.join(root, '.cache'), { recursive: true });
await fs.writeFile(path.join(root, '.cache/content.html'), source);
const input = '@import "tailwindcss" source(none);\n@config "./tailwind.config.cjs";\n@source "./.cache/content.html";';
const result = await postcss([tailwindcss({ base: root, optimize: false })])
  .process(input, { from: path.join(root, 'app.css') });
const license = await fs.readFile(new URL('../node_modules/tailwindcss/LICENSE', import.meta.url), 'utf8');
const tag = `<style id="utilities">\n/*! Tailwind CSS 4.3.3\n${license}\n*/\n${result.css}\n</style>`;
if (html.includes('<style id="utilities">')) {
  html = html.replace(/<style id="utilities">[\s\S]*?<\/style>/, tag);
} else {
  html = html.replace('  <style>', `  ${tag}\n  <style>`);
}
await fs.writeFile(htmlPath, html);
console.log('Embedded local Tailwind CSS in index.html.');
