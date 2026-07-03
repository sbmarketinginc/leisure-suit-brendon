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

SITE_URL='https://leisuresuitbrendon.com/'
OG_DESC="It's 10 PM in Pittsburgh. Find true love by sunrise. A free retro point-and-click parody adventure in the City of Bridges."
GA_ID='G-3J149NJTZ4'   # Google Analytics 4, property "leisuresuitbrendon.com"

{
  echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo "<meta name=\"description\" content=\"$OG_DESC\">"
  echo '<meta property="og:type" content="website">'
  echo '<meta property="og:title" content="Leisure Suit Brendon — In the City of Bridges">'
  echo "<meta property=\"og:description\" content=\"$OG_DESC\">"
  echo "<meta property=\"og:url\" content=\"$SITE_URL\">"
  echo "<meta property=\"og:image\" content=\"${SITE_URL}share.png\">"
  echo '<meta property="og:image:width" content="1200">'
  echo '<meta property="og:image:height" content="630">'
  echo '<link rel="icon" href="favicon.svg" type="image/svg+xml">'
  echo '<link rel="icon" href="favicon.ico" sizes="32x32">'
  echo '<link rel="apple-touch-icon" href="apple-touch-icon.png">'
  echo '<meta name="twitter:card" content="summary_large_image">'
  echo '<meta name="twitter:title" content="Leisure Suit Brendon — In the City of Bridges">'
  echo "<meta name=\"twitter:description\" content=\"$OG_DESC\">"
  echo "<meta name=\"twitter:image\" content=\"${SITE_URL}share.png\">"
  cat <<EOF
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=$GA_ID"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '$GA_ID');
</script>
EOF
  echo '</head><body>'
  cat dist/artifact.html
  echo '</body></html>'
} > dist/index.html

mkdir -p docs
cp dist/index.html docs/index.html   # GitHub Pages serves from /docs
cp promo/share.png docs/share.png    # social share image (og:image)
cp promo/favicon.ico promo/favicon.svg promo/apple-touch-icon.png docs/   # tools/make_favicon.py

echo "built: dist/artifact.html ($(wc -c < dist/artifact.html | tr -d ' ') bytes), dist/index.html, docs/index.html"
