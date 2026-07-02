/* ── art library: EGA-flavored palette + scene/sprite helpers ── */
const A = (() => {
  const K = {
    black:'#000000', blue:'#0000aa', green:'#00aa00', cyan:'#00aaaa',
    red:'#aa0000', mag:'#aa00aa', brown:'#aa5500', lgray:'#aaaaaa',
    dgray:'#555555', lblue:'#5555ff', lgreen:'#55ff55', lcyan:'#55ffff',
    lred:'#ff5555', lmag:'#ff55ff', yellow:'#ffff55', white:'#ffffff',
    night:'#070510', night2:'#0d0a1e', skin:'#eab08a', skin2:'#c98d66', skin3:'#8a5a3a',
    suit:'#f4f0e4', suitShade:'#c9c2ae', hairBr:'#6b3f1d', gold:'#f5c542',
  };
  let ctx = null;
  const bind = c => { ctx = c; };

  // seeded rng for stable decorations
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, Math.ceil(w), Math.ceil(h)); };
  // 2px checker dither between two colors — the classic EGA gradient trick
  function dither(x, y, w, h, c1, c2, cell = 2) {
    R(x, y, w, h, c1);
    ctx.fillStyle = c2;
    for (let yy = 0; yy < h; yy += cell)
      for (let xx = ((yy / cell) % 2) * cell; xx < w; xx += cell * 2)
        ctx.fillRect(x + xx, y + yy, cell, Math.min(cell, h - yy));
  }
  // vertical banded gradient out of flat fills (n bands)
  function bands(x, y, w, h, colors) {
    const bh = h / colors.length;
    colors.forEach((c, i) => R(x, y + i * bh, w, bh + 1, c));
  }
  function glow(x, y, rad, color, alpha = 0.25) {
    const g = ctx.createRadialGradient(x, y, 2, x, y, rad);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha; ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    ctx.globalAlpha = 1;
  }

  /* night sky with twinkling stars + moon */
  function sky(y0, y1, seed = 7, moonX = 520, moonY = null) {
    bands(0, y0, 640, y1 - y0, ['#04030c', '#070512', '#0b081d', '#120c2a']);
    const r = rng(seed);
    for (let i = 0; i < 70; i++) {
      const sx = r() * 640, sy = y0 + r() * (y1 - y0) * 0.9;
      const tw = (Math.sin(A.t / 400 + i * 1.7) + 1) / 2;
      if (tw > 0.3) R(sx, sy, 2, 2, tw > 0.8 ? K.white : '#9a93c9');
    }
    if (moonY === null) moonY = y0 + 26;
    if (moonX >= 0) {
      R(moonX - 10, moonY - 10, 20, 20, '#efeadb');
      R(moonX - 8, moonY - 12, 16, 2, '#efeadb'); R(moonX - 8, moonY + 10, 16, 2, '#efeadb');
      R(moonX - 12, moonY - 8, 2, 16, '#efeadb'); R(moonX + 10, moonY - 8, 2, 16, '#efeadb');
      R(moonX - 4, moonY - 4, 4, 4, '#d9d2bd'); R(moonX + 3, moonY + 2, 3, 3, '#d9d2bd');
      glow(moonX, moonY, 34, '#efeadb', 0.18);
    }
  }
  /* distant city silhouettes with sparse lit windows */
  function skyline(yBase, seed = 3) {
    const r = rng(seed);
    let x = -10;
    while (x < 650) {
      const w = 34 + r() * 60, h = 40 + r() * 78;
      R(x, yBase - h, w, h, '#0e0b1c');
      for (let wy = yBase - h + 6; wy < yBase - 8; wy += 10)
        for (let wx = x + 4; wx < x + w - 6; wx += 9)
          if (r() < 0.16) R(wx, wy, 4, 5, r() < 0.5 ? '#c9b45a' : '#7fd6d0');
      x += w + 2 + r() * 10;
    }
  }
  function brickWall(x, y, w, h, base = '#3a1f24', mortar = '#2a161a') {
    R(x, y, w, h, base);
    ctx.fillStyle = mortar;
    for (let yy = y; yy < y + h; yy += 10) ctx.fillRect(x, yy, w, 2);
    for (let yy = y, row = 0; yy < y + h; yy += 10, row++)
      for (let xx = x + ((row % 2) * 12); xx < x + w; xx += 24)
        ctx.fillRect(xx, yy, 2, 10);
  }
  function sidewalk(y, h, c1 = '#4c4a58', c2 = '#3c3a48') {
    dither(0, y, 640, h, c1, c2, 2);
    ctx.fillStyle = '#2a2834';
    for (let x = 0; x < 640; x += 64) ctx.fillRect(x, y, 2, h);
    ctx.fillRect(0, y, 640, 2);
  }
  function road(y, h) {
    bands(0, y, 640, h, ['#1c1a26', '#181622', '#14121c']);
    ctx.fillStyle = '#b9a13c';
    for (let x = 8; x < 640; x += 56) ctx.fillRect(x, y + h * 0.55, 26, 4);
  }
  function lampPost(x, yBase, t) {
    R(x - 2, yBase - 92, 4, 92, '#22202e');
    R(x - 10, yBase - 96, 20, 6, '#22202e');
    R(x - 7, yBase - 94, 14, 3, '#ffe9a3');
    glow(x, yBase - 90, 46, '#ffe9a3', 0.22);
    ctx.globalAlpha = 0.10; ctx.fillStyle = '#ffe9a3';
    ctx.beginPath(); ctx.moveTo(x - 6, yBase - 90); ctx.lineTo(x + 6, yBase - 90);
    ctx.lineTo(x + 26, yBase); ctx.lineTo(x - 26, yBase); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function doorway(x, y, w, h, frame = '#5a3b20', leaf = '#7a5028', windowGlow = null) {
    R(x - 4, y - 4, w + 8, h + 4, frame);
    R(x, y, w, h, leaf);
    R(x + w - 8, y + h / 2 - 2, 5, 4, '#d9c06a');
    if (windowGlow) { R(x + 5, y + 6, w - 10, 16, windowGlow); }
  }
  function windowLit(x, y, w, h, c = '#ffd977', frame = '#241a2c') {
    R(x - 3, y - 3, w + 6, h + 6, frame);
    R(x, y, w, h, c);
    R(x + w / 2 - 1, y, 2, h, frame); R(x, y + h / 2 - 1, w, 2, frame);
    glow(x + w / 2, y + h / 2, w, c, 0.12);
  }
  function plant(x, yBase, s = 1) {
    R(x - 8 * s, yBase - 10 * s, 16 * s, 10 * s, '#7a3b2a');
    ctx.fillStyle = '#1d6b30';
    for (let i = -2; i <= 2; i++) {
      ctx.save(); ctx.translate(x, yBase - 10 * s); ctx.rotate(i * 0.45);
      ctx.fillRect(-2 * s, -26 * s, 4 * s, 26 * s); ctx.restore();
    }
  }

  /* ── people ─ parameterized pixel humans, feet-anchored ── */
  // o: {x,y,scale,flip,frame,pose:'stand'|'walk'|'sit'|'lie', skin,hair,hairC,top,bottom,dress,apron,shades,stache,hat,hatC,lipstick}
  function person(o) {
    const s = o.scale || 1, flip = o.flip ? -1 : 1;
    ctx.save(); ctx.translate(o.x | 0, o.y | 0); ctx.scale(s * flip, s);
    const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const skin = o.skin || K.skin, top = o.top || K.dgray, bot = o.bottom || '#333',
      hairC = o.hairC || '#2a1b10';
    const sitting = o.pose === 'sit', lying = o.pose === 'lie';
    if (lying) { ctx.rotate(-Math.PI / 2); }
    let legTop = -26;
    // legs
    if (sitting) {
      r(-7, -26, 14, 8, bot);                 // lap
      r(-7, -18, 5, 16, bot); r(2, -18, 5, 16, bot);
      r(-8, -4, 7, 4, '#1a1a1a'); r(1, -4, 7, 4, '#1a1a1a');
    } else if (o.dress) {
      r(-8, -30, 16, 18, bot);                 // skirt
      r(-4, -12, 3, 9, skin); r(1, -12, 3, 9, skin);
      r(-5, -4, 5, 4, '#1a1a1a'); r(0, -4, 5, 4, '#1a1a1a');
      legTop = -30;
    } else {
      const k = o.pose === 'walk' ? (o.frame % 2 ? 3 : -3) : 0;
      r(-6 + k, -26, 5, 23, bot); r(1 - k, -26, 5, 23, bot);
      r(-7 + k, -4, 7, 4, o.shoeC || '#1a1a1a'); r(0 - k, -4, 7, 4, o.shoeC || '#1a1a1a');
    }
    // torso
    const tY = sitting ? -44 : -46;
    r(-8, tY, 16, tY === -44 ? 18 : 20, top);
    if (o.apron) r(-6, tY + 6, 12, sitting ? 12 : 14, '#e8e2d0');
    if (o.tie) r(-1, tY + 2, 3, 10, o.tie);
    // arms
    const armY = tY + 2;
    if (o.pose === 'walk') {
      const k = o.frame % 2 ? 2 : -2;
      r(-11, armY + k, 4, 14, top); r(7, armY - k, 4, 14, top);
      r(-11, armY + k + 14, 4, 4, skin); r(7, armY - k + 14, 4, 4, skin);
    } else if (o.armsUp) {
      r(-12, armY - 8, 4, 12, top); r(8, armY - 8, 4, 12, top);
      r(-12, armY - 12, 4, 4, skin); r(8, armY - 12, 4, 4, skin);
    } else {
      r(-11, armY, 4, 15, top); r(7, armY, 4, 15, top);
      r(-11, armY + 15, 4, 4, skin); r(7, armY + 15, 4, 4, skin);
    }
    // head
    const hY = tY - 12;
    r(-5, hY, 10, 12, skin);
    // hair styles
    const hs = o.hair || 'short';
    if (hs === 'short') { r(-5, hY - 2, 10, 4, hairC); r(-5, hY, 2, 4, hairC); r(3, hY, 2, 4, hairC); }
    if (hs === 'pomp') { r(-6, hY - 5, 12, 6, hairC); r(-7, hY - 1, 3, 5, hairC); r(4, hY - 1, 3, 5, hairC); }
    if (hs === 'long') { r(-6, hY - 3, 12, 5, hairC); r(-7, hY, 3, 16, hairC); r(4, hY, 3, 16, hairC); }
    if (hs === 'beehive') { r(-4, hY - 10, 8, 11, hairC); r(-5, hY - 6, 10, 7, hairC); }
    if (hs === 'bald') { r(-5, hY - 1, 10, 2, skin); r(-5, hY + 1, 2, 3, hairC); r(3, hY + 1, 2, 3, hairC); }
    if (hs === 'wave') { r(-6, hY - 4, 12, 5, hairC); r(-6, hY - 6, 6, 3, hairC); }
    // face — drawn on facing side
    if (o.shades) r(-4, hY + 4, 9, 3, '#111');
    else { r(1, hY + 4, 2, 2, '#20160e'); if (!o.profile) r(-3, hY + 4, 2, 2, '#20160e'); }
    if (o.stache) r(-2, hY + 8, 6, 2, hairC);
    if (o.lipstick) r(-1, hY + 9, 4, 2, '#c22');
    if (o.hat) { r(-6, hY - 4, 12, 3, o.hatC || '#222'); r(-4, hY - 9, 8, 6, o.hatC || '#222'); }
    ctx.restore();
  }

  /* Brendon himself: white leisure suit, black open shirt, gold chain, permanent optimism */
  function brendon(x, y, opts = {}) {
    const s = opts.scale || 1, flip = opts.flip ? -1 : 1, frame = opts.frame || 0;
    ctx.save(); ctx.translate(x | 0, y | 0); ctx.scale(s * flip, s);
    const r = (x2, y2, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x2, y2, w, h); };
    const walk = opts.pose === 'walk', sit = opts.pose === 'sit';
    // flared white pants
    if (sit) {
      r(-7, -26, 14, 8, K.suit); r(-7, -18, 5, 16, K.suit); r(2, -18, 5, 16, K.suit);
      r(-8, -4, 7, 4, K.white); r(1, -4, 7, 4, K.white);
    } else {
      const k = walk ? (frame % 2 ? 3 : -3) : 0;
      r(-6 + k, -26, 5, 17, K.suit); r(1 - k, -26, 5, 17, K.suit);
      r(-8 + k, -10, 7, 6, K.suit); r(-1 - k, -10, 7, 6, K.suit);      // flares
      r(-8 + k, -4, 8, 4, K.white); r(-1 - k, -4, 8, 4, K.white);      // platform shoes
      r(-6 + k, -26, 2, 17, K.suitShade); r(1 - k, -26, 2, 17, K.suitShade);
    }
    // jacket + black shirt + chest + chain
    const tY = sit ? -44 : -46;
    r(-8, tY, 16, sit ? 18 : 20, K.suit);
    r(-3, tY, 6, 10, '#181820');            // open black shirt
    r(-1, tY + 3, 2, 4, K.skin);            // chest triangle
    r(-1, tY + 6, 3, 2, K.gold);            // the chain
    r(-8, tY, 2, sit ? 18 : 20, K.suitShade);
    r(-9, tY + 1, 3, 4, K.suit); r(6, tY + 1, 3, 4, K.suit); // big lapels
    // arms
    const armY = tY + 2;
    if (walk) {
      const k = frame % 2 ? 2 : -2;
      r(-11, armY + k, 4, 14, K.suit); r(7, armY - k, 4, 14, K.suit);
      r(-11, armY + k + 14, 4, 4, K.skin); r(7, armY - k + 14, 4, 4, K.skin);
    } else if (opts.armsUp) {
      r(-12, armY - 8, 4, 12, K.suit); r(8, armY - 8, 4, 12, K.suit);
      r(-12, armY - 12, 4, 4, K.skin); r(8, armY - 12, 4, 4, K.skin);
    } else {
      r(-11, armY, 4, 15, K.suit); r(7, armY, 4, 15, K.suit);
      r(-11, armY + 15, 4, 4, K.skin); r(7, armY + 15, 4, 4, K.skin);
    }
    // head: side-part brown hair, hopeful eyebrows
    const hY = tY - 12;
    r(-5, hY, 10, 12, K.skin);
    r(-5, hY - 2, 10, 4, K.hairBr); r(-5, hY, 2, 5, K.hairBr); r(3, hY, 2, 3, K.hairBr);
    r(-3, hY + 4, 2, 2, '#20160e'); r(1, hY + 4, 2, 2, '#20160e');
    r(-3, hY + 3, 2, 1, K.hairBr); r(1, hY + 3, 2, 1, K.hairBr);
    r(-2, hY + 8, 5, 2, '#b0705a');   // the grin
    ctx.restore();
  }

  return { K, bind, rng, R, dither, bands, glow, sky, skyline, brickWall, sidewalk, road, lampPost, doorway, windowLit, plant, person, brendon, t: 0 };
})();
