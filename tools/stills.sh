#!/usr/bin/env bash
# Render several preview stills from an already built bundle. Usage: bash tools/stills.sh <Composition> <outdir> <frame>...
comp=$1; out=$2; shift 2
mkdir -p "$out"
for f in "$@"; do
  npx remotion still build "$comp" "$out/f$f.png" --frame=$f --log=error &
done
wait
