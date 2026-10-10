import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const seen = new Set();
function visit(file) {
  assert.ok(fs.existsSync(file), `Missing runtime asset: ${file}`);
  if (!file.startsWith(root) || seen.has(file)) return;
  seen.add(file);
  if (!/\.(html|css|js)$/.test(file)) return;
  const source = fs.readFileSync(file, 'utf8');
  const links = [];
  if (file.endsWith('.html')) {
    for (const match of source.matchAll(/(?:src|href)="([^"#]+)"/g)) links.push(match[1]);
  }
  if (file.endsWith('.js')) {
    for (const match of source.matchAll(/\b(?:import|export)\s+(?:[^;"']*?\s+from\s*)?["']([^"']+)["']/g)) links.push(match[1]);
    for (const match of source.matchAll(/\b(?:fetch|loadAsync)\(['"]([^'"]+)['"]/g)) links.push(match[1]);
  }
  for (const link of links) {
    if (/^(https?:|data:|#)/.test(link)) continue;
    if (link === 'three') { visit(path.join(root, 'vendor/three.module.js')); continue; }
    if (!link.startsWith('.') && !file.endsWith('.html')) continue;
    let target = path.resolve(path.dirname(file), link.split(/[?#]/)[0]);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    visit(target);
  }
}
visit(path.join(root, 'index.html'));
assert.ok([...seen].some(file => file.endsWith('canqi-night-office.glb')));
assert.ok(![...seen].some(file => /scene-motion|scene-fallback|assets[\\/]motion/.test(file)));
const bytes = [...seen].reduce((sum, file) => sum + fs.statSync(file).size, 0);
console.log(`PASS: ${seen.size} runtime resources, ${(bytes / 1e6).toFixed(2)} MB; all local links resolve`);
