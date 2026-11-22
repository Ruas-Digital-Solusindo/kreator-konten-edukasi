#!/usr/bin/env bash
# Measure a narration recording: Whisper transcript (segment timings) + pauses.
# Usage (from the repo root folder):  bash tools/whisper/measure.sh public/narasi-xxx.mp3
# Output: tools/whisper/out/<name>.json (transcript) and <name>.silence.txt (pauses)
set -euo pipefail

MP3="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
NAME="$(basename "$1" .mp3)"
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DIR/out"
cd "$DIR" # the whisper filter needs a relative model path (Windows drive colons break it)

ffmpeg -hide_banner -loglevel error -y -i "$MP3" \
  -af "whisper=model=ggml-small.bin:language=id:queue=70:destination=out/$NAME.json:format=json" -f null -

ffmpeg -hide_banner -i "$MP3" -af silencedetect=noise=-25dB:d=0.1 -f null - 2>&1 \
  | grep -oE "silence_(start|end): [0-9.]+" | paste - - \
  | awk '{printf "pause %.2f - %.2f\n", $2, $4}' > "out/$NAME.silence.txt"

echo "== transcript (ms)"; cat "out/$NAME.json"
echo "== pauses (s)"; cat "out/$NAME.silence.txt"
