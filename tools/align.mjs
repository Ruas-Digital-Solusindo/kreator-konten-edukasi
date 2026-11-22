// Align timeline.ts lines to a recording using ffmpeg silencedetect output.
// Usage (from the repo root folder): node --experimental-strip-types tools/align.mjs <Nama-Video> narasi-<nama>
import { readFileSync, writeFileSync } from "node:fs";

const [dir, name] = process.argv.slice(2);
const tl = await import(`../src/${dir}/timeline.ts`);
const sil = readFileSync(`tools/whisper/out/${name}.silence.txt`, "utf8")
  .trim()
  .split("\n")
  .map((l) => l.match(/pause ([\d.]+) - ([\d.]+)/).slice(1).map(Number));
const total = Number(process.argv[4] ?? 0) || sil[sil.length - 1][1];
const MINP = 0.22;
const pauses = sil.filter(([a, b]) => b - a >= MINP);
// speech regions
const regions = [];
let t = 0;
for (const [a, b] of pauses) {
  if (a > t + 0.05) regions.push([t, a]);
  t = b;
}
if (total > t) regions.push([t, total]);
const speech = regions.reduce((s, [a, b]) => s + (b - a), 0);
const toReal = (st) => {
  let acc = 0;
  for (const [a, b] of regions) {
    if (acc + (b - a) >= st) return a + (st - acc);
    acc += b - a;
  }
  return total;
};
const lines = tl.LINES;
const len = lines.map((l) => (l.say ?? l.text).replace(/\*/g, "").length);
const sum = len.reduce((a, b) => a + b, 0);
// boundary k = between line k-1 and k, snapped to a pause
const bounds = [];
let cum = 0;
for (let k = 1; k < lines.length; k++) {
  cum += len[k - 1];
  const target = toReal((cum / sum) * speech);
  let best = null;
  for (const p of pauses) {
    const mid = (p[0] + p[1]) / 2;
    const d = Math.abs(mid - target);
    if (d < 1.2) {
      const score = d - (p[1] - p[0]) * 1.5;
      if (!best || score < best.score) best = { p, score };
    }
  }
  bounds.push(best ? best.p : [target, target]);
}
const out = lines.map((l, i) => ({
  id: l.id,
  sec: i === 0 ? regions[0][0] : bounds[i - 1][1],
  until: i === lines.length - 1 ? regions[regions.length - 1][1] : bounds[i][0],
}));
for (const o of out) console.log(o.id.padEnd(3), o.sec.toFixed(2).padStart(7), o.until.toFixed(2).padStart(7));
writeFileSync(`tools/whisper/out/${name}.align.json`, JSON.stringify(out, null, 1));
