import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');

assert.equal(config.outputDirectory, 'public', 'Vercel must serve only the public directory as static output.');
for (const file of ['index.html', 'styles.css', 'ui.js', 'favicon.svg', 'sample-work.svg']) {
  assert.equal(fs.existsSync(path.join(root, 'public', file)), true, `Missing public/${file}`);
}
for (const file of ['app.js', 'server.js', 'index.html']) {
  assert.equal(fs.existsSync(path.join(root, file)), false, `Root ${file} can trigger incorrect Vercel runtime detection.`);
}
assert.match(html, /src="\/ui\.js\?v=5"/, 'The page must load public/ui.js.');
assert.doesNotMatch(html, /src="\/app\.js/, 'The browser entrypoint must not use the reserved app.js filename.');
await import('../public/ui.js');
console.log('DEPLOYMENT-LAYOUT-PASS');
