import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(here, 'index.html'), 'utf8');
const match = html.match(/\/\/ ===PROTOCOL_START===([\s\S]*?)\/\/ ===PROTOCOL_END===/);
if (!match) throw new Error('protocol marker block not found in index.html');

(0, eval)(match[1]);
const p = globalThis.__loyProtocol;
let failures = 0;

function hex(bytes) {
  return Buffer.from(bytes).toString('hex');
}

function check(name, actual, expected) {
  if (actual !== expected) {
    failures += 1;
    console.error(`FAIL ${name}\n  expected: ${expected}\n  actual:   ${actual}`);
  } else {
    console.log(`ok   ${name}`);
  }
}

const get = p.cmdGet('dev_info');
check('get dev_info golden frame', hex(p.buildFrame(get.payload, 1, get.mode)), 'aa55ffff08000100c1030a00d403');
for (const [value, expected] of [[127, '7f'], [128, '8180'], [255, '81ff'], [256, '820001']]) {
  check(`varlen ${value}`, hex(p.encodeTlvLen(value)), expected);
}
const rect = p.cmdRtDrawRect([0x11, 0x22, 0x33], 1, 2, 63, 62);
check('rt_draw rectangle length', String(rect.payload.length), '15');
check('rt_draw rectangle layout', hex(rect.payload), '320d0111223300010002003f003e00');
const bitmap = p.cmdRtDrawBitmap([
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 1],
], [1, 2, 3], 0, 0, 8, 1);
check('bitmap ceil(w/8) row padding', hex(bitmap.payload.slice(-4)), '80804080');
check('get dev_info all', hex(p.cmdGetDevInfoAll().payload), '0a001b0004000600');

if (failures) {
  console.error(`\n${failures} protocol test(s) failed`);
  process.exitCode = 1;
} else {
  console.log('\nAll protocol tests passed.');
}
