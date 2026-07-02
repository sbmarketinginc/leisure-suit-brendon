#!/bin/bash
# builds dist/artifact.html (bare, for claude.ai Artifact) and dist/index.html (standalone local file)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist

JS_FILES=(
  src/01_font.js
  src/02_art.js
  src/03_engine.js
  src/04_parser.js
  src/05_items.js
  src/10_audio.js
  src/09_minigames.js
  src/06_rooms_lefty.js
  src/07_rooms_town.js
  src/08_rooms_casino.js
  src/11_meta.js
  src/12_main.js
)

{
  cat src/shell.html
  echo '<style>'
  cat src/style.css
  echo '</style>'
  echo '<script>'
  cat "${JS_FILES[@]}"
  echo '</script>'
} > dist/artifact.html

{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1">'
  echo '</head><body>'
  cat dist/artifact.html
  echo '</body></html>'
} > dist/index.html

mkdir -p docs
cp dist/index.html docs/index.html   # GitHub Pages serves from /docs

echo "built: dist/artifact.html ($(wc -c < dist/artifact.html | tr -d ' ') bytes), dist/index.html, docs/index.html"
