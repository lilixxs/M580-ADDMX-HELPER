import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('site/', root);
const publicFiles = ['index.html', 'LICENSE', 'THIRD_PARTY_NOTICES.md'];
// Rebuild a fixed output directory. Never upload the checkout as a Pages artifact.
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
for (const name of publicFiles) {
  await fs.copyFile(new URL(name, root), new URL(name, output));
}
await fs.writeFile(new URL('.nojekyll', output), '');
const actual = (await fs.readdir(output)).sort();
assert.deepEqual(actual, [...publicFiles, '.nojekyll'].sort());
assert.deepEqual(await fs.readFile(new URL('index.html', output)), await fs.readFile(new URL('index.html', root)));
console.log(`Pages package verified: ${actual.join(', ')}`);
