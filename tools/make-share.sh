#!/usr/bin/env bash
# Buat versi "share" sebuah video: out/<nama>/<nama>-share.mp4
#   - frame 0 = cover (composition dirender dengan props withCover=true)  -> preview WhatsApp / galeri HP
#   - cover-instagram.png ditanam sebagai cover art (attached_pic)        -> thumbnail File Explorer
#
# Syarat: cover sudah dirender lebih dulu ke out/<nama>/cover-instagram.png
#         dan composition menerima prop `withCover` (lihat src/shared/CoverFrame.tsx).
#
# Pakai (dari folder utama repo):
#   bash tools/make-share.sh <CompositionId> <nama>
#   contoh: bash tools/make-share.sh HartaLupaDihitung harta-lupa-dihitung
set -euo pipefail

COMP="${1:?CompositionId wajib diisi}"
NAME="${2:?nama folder output wajib diisi}"
DIR="out/$NAME"
COVER="$DIR/cover-instagram.png"
TMP="$DIR/.share-tmp.mp4"
JPG="$DIR/.cover-tmp.jpg"
OUT="$DIR/$NAME-share.mp4"

if [ ! -f "$COVER" ]; then
  echo "Cover belum ada: $COVER. Render cover dulu (npx remotion still <Nama>CoverInstagram $COVER)." >&2
  exit 1
fi

echo "1/2 Render video dengan cover di frame 0 ..."
npx remotion render "$COMP" "$TMP" --props=tools/share-props.json --overwrite --log=error

echo "2/2 Tanam cover art ..."
ffmpeg -v error -y -i "$COVER" -q:v 2 "$JPG"
ffmpeg -v error -y -i "$TMP" -i "$JPG" \
  -map 0 -map 1 -c copy -disposition:v:1 attached_pic \
  -movflags +faststart "$OUT"

rm -f "$TMP" "$JPG"
echo "Selesai: $OUT"
