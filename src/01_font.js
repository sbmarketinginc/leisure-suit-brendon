/* ── hand-rolled 5×7 pixel font for in-canvas text (status bar, signs, title) ── */
const F = (() => {
  // each glyph: 7 rows of 5 bits, msb left
  const D = {
    'A':[14,17,17,31,17,17,17],'B':[30,17,17,30,17,17,30],'C':[14,17,16,16,16,17,14],
    'D':[30,17,17,17,17,17,30],'E':[31,16,16,30,16,16,31],'F':[31,16,16,30,16,16,16],
    'G':[14,17,16,23,17,17,14],'H':[17,17,17,31,17,17,17],'I':[14,4,4,4,4,4,14],
    'J':[7,2,2,2,2,18,12],'K':[17,18,20,24,20,18,17],'L':[16,16,16,16,16,16,31],
    'M':[17,27,21,21,17,17,17],'N':[17,25,21,19,17,17,17],'O':[14,17,17,17,17,17,14],
    'P':[30,17,17,30,16,16,16],'Q':[14,17,17,17,21,18,13],'R':[30,17,17,30,20,18,17],
    'S':[15,16,16,14,1,1,30],'T':[31,4,4,4,4,4,4],'U':[17,17,17,17,17,17,14],
    'V':[17,17,17,17,17,10,4],'W':[17,17,17,21,21,27,17],'X':[17,17,10,4,10,17,17],
    'Y':[17,17,10,4,4,4,4],'Z':[31,1,2,4,8,16,31],
    '0':[14,17,19,21,25,17,14],'1':[4,12,4,4,4,4,14],'2':[14,17,1,6,8,16,31],
    '3':[30,1,1,14,1,1,30],'4':[2,6,10,18,31,2,2],'5':[31,16,30,1,1,17,14],
    '6':[6,8,16,30,17,17,14],'7':[31,1,2,4,8,8,8],'8':[14,17,17,14,17,17,14],
    '9':[14,17,17,15,1,2,12],
    ' ':[0,0,0,0,0,0,0],'.':[0,0,0,0,0,12,12],',':[0,0,0,0,12,4,8],
    '!':[4,4,4,4,4,0,4],'?':[14,17,1,2,4,0,4],':':[0,12,12,0,12,12,0],
    "'":[4,4,8,0,0,0,0],'"':[10,10,0,0,0,0,0],'-':[0,0,0,31,0,0,0],
    '_':[0,0,0,0,0,0,31],'/':[1,1,2,4,8,16,16],'(':[2,4,8,8,8,4,2],
    ')':[8,4,2,2,2,4,8],'$':[4,15,20,14,5,30,4],'&':[12,18,20,8,21,18,13],
    '+':[0,4,4,31,4,4,0],'=':[0,0,31,0,31,0,0],'%':[24,25,2,4,8,19,3],
    '<':[2,4,8,16,8,4,2],'>':[8,4,2,1,2,4,8],'*':[0,21,14,31,14,21,0],
    '#':[10,10,31,10,31,10,10],'@':[14,17,23,21,23,16,14],
    '♥':[0,10,31,31,14,4,0],'♦':[4,14,31,31,14,4,0],'♪':[6,5,5,4,12,28,8],
    '↑':[4,14,21,4,4,4,4],'←':[0,4,8,31,8,4,0],'→':[0,4,2,31,2,4,0],'↓':[4,4,4,4,21,14,4],
  };
  function text(ctx, s, x, y, size, color, spacing = 1) {
    s = String(s).toUpperCase();
    const px = size, adv = (5 + spacing) * px;
    ctx.fillStyle = color;
    let cx = x;
    for (const ch of s) {
      const g = D[ch] || D['?'];
      for (let r = 0; r < 7; r++) {
        const row = g[r];
        for (let c = 0; c < 5; c++) {
          if (row & (16 >> c)) ctx.fillRect(cx + c * px, y + r * px, px, px);
        }
      }
      cx += adv;
    }
    return cx - x;
  }
  function width(s, size, spacing = 1) { return String(s).length * (5 + spacing) * size; }
  function center(ctx, s, cx, y, size, color, spacing = 1) {
    return text(ctx, s, Math.round(cx - width(s, size, spacing) / 2), y, size, color, spacing);
  }
  // neon sign: glow blocks behind + letters, optional flicker phase
  function neon(ctx, s, cx, y, size, color, t, flickRate = 0) {
    let on = true;
    if (flickRate) { const ph = Math.sin(t / 90) * Math.sin(t / 331 + 2); on = ph > -0.93; }
    ctx.globalAlpha = on ? 0.28 : 0.07;
    for (let dx = -size; dx <= size; dx += size)
      for (let dy = -size; dy <= size; dy += size)
        center(ctx, s, cx + dx, y + dy, size, color);
    ctx.globalAlpha = on ? 1 : 0.25;
    center(ctx, s, cx, y, size, on ? '#ffffff' : color);
    ctx.globalAlpha = on ? 0.85 : 0.2;
    center(ctx, s, cx, y, size, color);
    ctx.globalAlpha = 1;
  }
  return { text, width, center, neon };
})();
