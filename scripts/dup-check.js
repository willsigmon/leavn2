import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const comps = readdirSync(join('client','src','components'));
const readers = comps.filter(f => /^Reader.*\.tsx?$/.test(f));
if (readers.length > 1) {
  console.error(`❌  Duplicate readers detected: ${readers.join(', ')}`);
  process.exit(1);
}
console.log('✔  Dup-check passed – single Reader component in repo.');