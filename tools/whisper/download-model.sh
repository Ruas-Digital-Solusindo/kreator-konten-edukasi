#!/usr/bin/env bash
# Unduh model Whisper (ggml-small.bin, ~466 MB) untuk mengukur detik narasi.
# Cukup sekali. Pakai (dari folder utama repo):  bash tools/whisper/download-model.sh
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
MODEL="$DIR/ggml-small.bin"
URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"

if [ -f "$MODEL" ]; then
  echo "Model sudah ada: $MODEL"
  exit 0
fi

echo "Mengunduh $URL ..."
curl -L --fail --progress-bar -o "$MODEL.part" "$URL"
mv "$MODEL.part" "$MODEL"
echo "Selesai: $MODEL"
