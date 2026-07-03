#!/usr/bin/env python3
"""Generate the site favicon: Brendon's face, pixel-for-pixel in the game palette.

Outputs promo/favicon.ico (16+32), promo/favicon.svg, promo/apple-touch-icon.png.
build.sh copies them into docs/.
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "promo")

# palette lifted from src/02_art.js (A.K) + face colors in brendon()
C = {
    ".": "#0d0a1e",  # night2 background
    "*": "#ffffff",  # star
    "+": "#9a93c9",  # dim star
    "H": "#6b3f1d",  # hairBr
    "S": "#eab08a",  # skin
    "s": "#c98d66",  # skin2 (shade)
    "E": "#20160e",  # eyes
    "G": "#b0705a",  # the grin
    "W": "#f4f0e4",  # suit
    "w": "#c9c2ae",  # suitShade
    "B": "#181820",  # open black shirt
    "C": "#f5c542",  # gold chain
}

# 16x16, adapted from brendon() head+shoulders in src/02_art.js
GRID = [
    "....HHHHHHHH....",
    ".*.HHHHHHHHHH...",
    "...HHHHHHHHHH.+.",
    "...HHHHHHHHHH...",
    "...HHSSSSSSHH...",
    "...HHHHSSHHSS...",
    "...HHEESSEESS...",
    "...SSEESSEESS...",
    "...SSSSSSSSSs...",
    "...SSSSSSSSSs...",
    "...SSSGGGGGSs...",
    "...SSSGGGGGSs...",
    "...sSSSSSSSSs...",
    "..WWWWBBBBWWWW..",
    ".wWWWWBSSBWWWWW.",
    ".wWWWWBCCBWWWWW.",
]

def hex_rgba(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def base16():
    img = Image.new("RGBA", (16, 16))
    for y, row in enumerate(GRID):
        for x, ch in enumerate(row):
            img.putpixel((x, y), hex_rgba(C[ch]))
    for x, y in ((0, 0), (15, 0), (0, 15), (15, 15)):  # soften corners
        img.putpixel((x, y), (0, 0, 0, 0))
    return img

def make_svg(path):
    rows = []
    for y, row in enumerate(GRID):
        x = 0
        while x < 16:
            ch = row[x]
            x0 = x
            while x < 16 and row[x] == ch:  # run-length merge
                x += 1
            if ch != ".":
                rows.append(f'<rect x="{x0}" y="{y}" width="{x - x0}" height="1" fill="{C[ch]}"/>')
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">'
        f'<rect width="16" height="16" rx="2" fill="{C["."]}"/>' + "".join(rows) + "</svg>"
    )
    with open(path, "w") as f:
        f.write(svg)

def main():
    icon = base16()
    icon32 = icon.resize((32, 32), Image.NEAREST)
    # base image must be the largest size or PIL drops the bigger entries
    icon32.save(os.path.join(OUT, "favicon.ico"), sizes=[(16, 16), (32, 32)],
                append_images=[icon])

    # apple-touch-icon: opaque (iOS masks its own corners), 16px art scaled x11 + 2px frame
    touch = Image.new("RGBA", (180, 180), hex_rgba(C["."]))
    art = Image.new("RGBA", (16, 16), hex_rgba(C["."]))
    art.alpha_composite(icon)
    touch.alpha_composite(art.resize((176, 176), Image.NEAREST), (2, 2))
    touch.convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"))

    make_svg(os.path.join(OUT, "favicon.svg"))

    icon32.resize((256, 256), Image.NEAREST).save(os.path.join(OUT, "favicon_preview.png"))
    print("wrote promo/favicon.ico, promo/favicon.svg, promo/apple-touch-icon.png")

if __name__ == "__main__":
    main()
