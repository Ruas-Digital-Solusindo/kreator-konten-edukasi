// Generate the text-to-audio script + estimated SRT for a video from its timeline.ts.
// Usage (from the repo root folder):  node --experimental-strip-types tools/make-tts.mjs <Nama-Video>
import { writeFileSync } from "node:fs";

const dir = process.argv[2];
if (!dir) throw new Error("Pakai: node --experimental-strip-types tools/make-tts.mjs <Nama-Video>");
const tl = await import(`../src/${dir}/timeline.ts`);
const clean = (s) => s.replace(/\*/g, "");

const scenes = new Map();
for (const l of tl.TL) {
  if (!scenes.has(l.scene)) scenes.set(l.scene, []);
  scenes.get(l.scene).push(l);
}

// 1) clean text for the TTS tool: one paragraph per scene, one line per phrase
const tts = [...scenes.values()].map((ls) => ls.map((l) => clean(l.say ?? l.text)).join("\n")).join("\n\n");
writeFileSync(`src/${dir}/naskah-tts.txt`, tts + "\n");

// 2) estimated SRT (replace with the measured one after the recording exists)
const p = (n, w = 2) => String(n).padStart(w, "0");
const f = (s) => {
  const ms = Math.round(s * 1000);
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
};
const srt = tl.TL.map((l, i) => `${i + 1}\n${f(l.start / tl.FPS)} --> ${f(l.speakEnd / tl.FPS)}\n${clean(l.text)}\n`).join("\n");
writeFileSync(`src/${dir}/naskah-tts.srt`, srt);

console.log(
  `${tl.TL.length} phrases, narration ~${(tl.OUTRO.start / tl.FPS).toFixed(1)}s (estimate), total ${(tl.DURATION / tl.FPS).toFixed(1)}s`,
);
