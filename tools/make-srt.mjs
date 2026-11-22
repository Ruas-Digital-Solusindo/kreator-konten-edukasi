// Buat .srt dari LINES di timeline.ts.
// Pakai: node tools/make-srt.mjs src/<Video>/timeline.ts out/<nama>/<nama>.srt
import fs from "node:fs";

const [, , input, output] = process.argv;
const src = fs.readFileSync(input, "utf8");
const re = /id: "(\w+)", scene: "\w+", sec: ([\d.]+), until: ([\d.]+), text: "((?:[^"\\]|\\.)*)"/g;

const pad = (n, l = 2) => String(n).padStart(l, "0");
const ts = (s) => {
  const ms = Math.round(s * 1000);
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};

let n = 0;
let out = "";
let m;
while ((m = re.exec(src))) {
  n++;
  out += `${n}\n${ts(+m[2])} --> ${ts(+m[3])}\n${m[4].replace(/\*/g, "")}\n\n`;
}
fs.writeFileSync(output, out);
console.log(`${n} cue -> ${output}`);
