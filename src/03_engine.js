/* ── engine: state, loop, walking, hotspots, overlays, score, save ── */
const ROOMS = {};
const PTS = {};                 // score ledger: id -> points (content files fill this)
const G = {
  mode: 'boot',                 // boot | title | play
  room: null, px: 320, py: 330, facing: 1, frame: 0,
  tx: null, ty: null, pending: null,
  verb: 'walk', itemSel: null,
  inv: [], money: 94, score: 0, got: {},
  flags: {}, time: 22 * 60 + 4, dead: false, cut: false,
  hidePlayer: false, walkAnim: 0,
};
let cv, cx, overlayEl, hoverEl, cmdEl;

const E = (() => {
  const $id = s => document.getElementById(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- overlays: messages / choices / toasts / panels ---------- */
  let msgQueue = [], msgResolve = null, msgBoxEl = null;
  let choiceEl = null, panelEl = null, panelCloseCb = null;

  function busy() { return !!(msgBoxEl || choiceEl || panelEl); }

  function renderMsg() {
    const m = msgQueue[0];
    if (!msgBoxEl) {
      msgBoxEl = document.createElement('div');
      msgBoxEl.tabIndex = 0;
      msgBoxEl.addEventListener('click', advanceMsg);
      overlayEl.appendChild(msgBoxEl);
    }
    msgBoxEl.className = 'msgbox' + (m.cls ? ' ' + m.cls : '');
    msgBoxEl.innerHTML =
      (m.who ? `<span class="who">${m.who}</span>` : '') +
      `<span class="tx"></span>` +
      `<span class="more">${msgQueue.length > 1 ? '▼ more' : '▼'}</span>`;
    msgBoxEl.querySelector('.tx').textContent = m.t;
    msgBoxEl.style.top = m.pos === 'low' ? '58%' : '10%';
  }
  function advanceMsg() {
    if (!msgBoxEl) return;
    SFX.blip(240, 0.03);
    msgQueue.shift();
    if (msgQueue.length) { renderMsg(); return; }
    msgBoxEl.remove(); msgBoxEl = null;
    const r = msgResolve; msgResolve = null;
    if (r) r();
  }
  function sayRaw(items) {
    return new Promise(res => {
      msgQueue = msgQueue.concat(items);
      const prev = msgResolve;
      msgResolve = () => { if (prev) prev(); res(); };
      renderMsg();
    });
  }
  const say = (...lines) => sayRaw(lines.map(t => typeof t === 'string' ? { t } : t));
  const speak = (who, ...lines) => sayRaw(lines.map(t => ({ t, who })));
  const think = (...lines) => sayRaw(lines.map(t => ({ t, cls: 'think', who: 'BRENDON (thinking)' })));

  function choose(prompt, opts) {
    return new Promise(res => {
      choiceEl = document.createElement('div');
      choiceEl.className = 'choices';
      choiceEl.innerHTML = `<div class="cq"></div>`;
      choiceEl.querySelector('.cq').textContent = prompt;
      opts.forEach((o, i) => {
        const b = document.createElement('button');
        b.textContent = `${i + 1}. ${o}`;
        b.addEventListener('click', () => { SFX.blip(330, 0.04); choiceEl.remove(); choiceEl = null; res(i); });
        choiceEl.appendChild(b);
      });
      overlayEl.appendChild(choiceEl);
      choiceEl.querySelector('button').focus();
    });
  }

  function toast(txt, bad = false) {
    const d = document.createElement('div');
    d.className = 'toast' + (bad ? ' bad' : '');
    d.textContent = txt;
    overlayEl.appendChild(d);
    const others = overlayEl.querySelectorAll('.toast');
    d.style.top = (34 + (others.length - 1) * 30) + 'px';
    setTimeout(() => d.remove(), 1650);
  }

  function panel(html, onClose) {
    closePanel(true);
    panelEl = document.createElement('div');
    panelEl.className = 'panel';
    panelEl.innerHTML = html;
    overlayEl.appendChild(panelEl);
    panelCloseCb = onClose || null;
    return panelEl;
  }
  function closePanel(silent) {
    if (!panelEl) return;
    panelEl.remove(); panelEl = null;
    const cb = panelCloseCb; panelCloseCb = null;
    if (cb && !silent) cb();
  }

  /* ---------- score / money / inventory / clock ---------- */
  function award(id, label) {
    if (G.got[id] || !(id in PTS)) return;
    G.got[id] = 1; G.score += PTS[id];
    toast(`+${PTS[id]} point${PTS[id] > 1 ? 's' : ''}${label ? ' — ' + label : ''}`);
    SFX.score();
  }
  const maxScore = () => Object.values(PTS).reduce((a, b) => a + b, 0);
  function pay(n, what) {
    if (G.money < n) return false;
    G.money -= n; toast(`-$${n}${what ? ' — ' + what : ''}`, true); SFX.pay();
    return true;
  }
  function gain(n, what) { G.money += n; toast(`+$${n}${what ? ' — ' + what : ''}`); SFX.cash(); }
  const has = id => G.inv.includes(id);
  function addItem(id) { if (!has(id)) { G.inv.push(id); toast(`Got: ${ITEMS[id].name}`); SFX.pickup(); } }
  function removeItem(id) { G.inv = G.inv.filter(i => i !== id); if (G.itemSel === id) setItemSel(null); }
  function clock(min) { G.time = Math.min(G.time + min, (24 + 4) * 60 + 55); }
  function timeStr() {
    let m = G.time % (24 * 60);
    let h = Math.floor(m / 60), mm = m % 60;
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12; if (h === 0) h = 12;
    return `${h}:${String(mm).padStart(2, '0')} ${ap}`;
  }

  /* ---------- rooms / walking ---------- */
  let snapshot = null;
  function takeSnapshot() {
    const { pending, ...rest } = G;
    snapshot = JSON.parse(JSON.stringify({ ...rest, pending: null }));
  }
  function goto(id, x, y, opts = {}) {
    const r = ROOMS[id];
    G.room = id;
    G.px = x !== undefined ? x : (r.spawn ? r.spawn[0] : 320);
    G.py = y !== undefined ? y : (r.spawn ? r.spawn[1] : (r.walk ? r.walk.y1 - 6 : 330));
    G.tx = G.ty = null; G.pending = null;
    MUS.set(r.music || 'lounge');
    if (r.enter) r.enter(!!opts.first);
    if (!opts.noSnap) takeSnapshot();
    if (!opts.noSave && G.mode === 'play') save('auto', true);
  }
  function room() { return ROOMS[G.room]; }
  function playerScale() {
    const r = room(); if (!r || !r.walk) return 1;
    const { y0, y1 } = r.walk;
    const f = clamp((G.py - y0) / Math.max(1, y1 - y0), 0, 1);
    return (r.sMin ?? 0.9) + f * ((r.sMax ?? 1.18) - (r.sMin ?? 0.9));
  }
  function walkTo(x, y, pending) {
    const r = room();
    if (r && r.walk) { x = clamp(x, r.walk.x0, r.walk.x1); y = clamp(y, r.walk.y0, r.walk.y1); }
    G.tx = x; G.ty = y; G.pending = pending || null;
  }
  function hotspots() {
    const r = room(); if (!r) return [];
    const hs = typeof r.hot === 'function' ? r.hot() : (r.hot || []);
    return hs.filter(h => !h.when || h.when());
  }
  function hotAt(x, y) {
    const hs = hotspots();
    for (let i = hs.length - 1; i >= 0; i--) {
      const h = hs[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h;
    }
    return null;
  }

  /* ---------- verb execution ---------- */
  const SNARK = {
    look: ["It's exactly what it looks like. Which is rare, in this town.",
      "You look at it. It declines to look back."],
    use: ["Brendon pokes it professionally. Nothing happens, professionally.",
      "That does nothing, but you looked GREAT doing it."],
    talk: ["It says nothing. Story of your love life.",
      "You get no response. A familiar feeling."],
    take: ["You can't take that. The 80s were a different time, but not THAT different.",
      "It stays where it is. Unlike your dignity, which left years ago."],
  };
  let snarkN = 0;
  const snark = v => SNARK[v][(snarkN++) % SNARK[v].length];

  async function runHandler(h, verb) {
    let fn = h[verb];
    if (verb === 'use' && !fn && h.take) fn = h.take;      // USE falls through to TAKE
    if (fn === undefined) {
      if (verb === 'look' && h.name) return say(snark('look'));
      return say(snark(verb));
    }
    if (typeof fn === 'string') return say(fn);
    return fn(h);
  }
  async function applyItem(itemId, h) {
    const g = h.items && h.items[itemId];
    setItemSel(null);
    if (g === undefined) {
      const it = ITEMS[itemId];
      return say(`Using the ${it.name} on ${h.name ? 'the ' + h.name : 'that'} accomplishes nothing. Stylishly.`);
    }
    if (typeof g === 'string') return say(g);
    return g(h);
  }
  function actOn(h, verb) {
    if (verb === 'walk' && !h) return;
    const near = h && (h.remote || h.wy === undefined);
    const target = h ? [(h.wx !== undefined ? h.wx : h.x + h.w / 2), (h.wy !== undefined ? h.wy : room().walk.y1 - 6)] : null;
    const doIt = () => {
      takeSnapshot();
      if (G.itemSel) applyItem(G.itemSel, h);
      else if (verb === 'walk' && h && h.goto) { typeof h.goto === 'function' ? h.goto(h) : goto(h.goto); }
      else if (verb === 'walk' && h && h.use && h.autoUse) runHandler(h, 'use');
      else if (verb !== 'walk') runHandler(h, verb);
      setVerb('walk');
    };
    if (near || !target) doIt();
    else walkTo(target[0], target[1], doIt);
  }

  /* ---------- input ---------- */
  function canvasPoint(ev) {
    const r = cv.getBoundingClientRect();
    return [(ev.clientX - r.left) * 640 / r.width, (ev.clientY - r.top) * 400 / r.height];
  }
  function onCanvasClick(ev) {
    if (G.mode !== 'play' || G.cut || G.dead) return;
    if (busy()) return;
    const [x, y] = canvasPoint(ev);
    const h = hotAt(x, y);
    if (G.itemSel) {
      if (h) actOn(h, 'use');
      else { setItemSel(null); say("Brendon puts it away before anyone asks questions."); }
      return;
    }
    if (G.verb === 'walk') {
      if (h && (h.goto || h.autoUse)) actOn(h, 'walk');
      else walkTo(x, y, null);
    } else if (h) actOn(h, G.verb);
    else { say(snark(G.verb)); setVerb('walk'); }
  }
  function onCanvasMove(ev) {
    if (G.mode !== 'play' || busy() || G.cut) { hoverEl.innerHTML = '&nbsp;'; return; }
    const [x, y] = canvasPoint(ev);
    const h = hotAt(x, y);
    if (h && h.name) {
      const v = G.itemSel ? `USE ${ITEMS[G.itemSel].name} ON` : G.verb.toUpperCase();
      hoverEl.textContent = `${v} ▸ ${h.name}`;
      cv.style.cursor = 'pointer';
    } else { hoverEl.innerHTML = '&nbsp;'; cv.style.cursor = 'crosshair'; }
  }
  function setVerb(v) {
    G.verb = v;
    document.querySelectorAll('.vb[data-verb]').forEach(b =>
      b.classList.toggle('active', b.dataset.verb === v));
  }
  function setItemSel(id) {
    G.itemSel = id;
    if (id) { setVerb('use'); hoverEl.textContent = `USE ${ITEMS[id].name} ON … (click something)`; }
  }

  /* ---------- death & restore ---------- */
  async function die(title, ...lines) {
    G.dead = true; MUS.sting('death');
    await sayRaw(lines.map(t => ({ t, cls: 'death', who: '☠ ' + title })));
    await sayRaw([{ t: 'Luckily for you, this is the kind of game where death is a suggestion. Rewinding…', cls: 'death', who: 'THE NARRATOR' }]);
    const s = snapshot;
    Object.keys(s).forEach(k => { G[k] = s[k]; });
    G.dead = false; G.tx = G.ty = null; G.pending = null;
    takeSnapshot();
    MUS.set(room().music || 'lounge');
  }

  /* ---------- save / load ---------- */
  const SAVE_KEY = s => 'lsb1_' + s;
  function save(slot = 'manual', silent = false) {
    try {
      const { pending, tx, ty, cut, dead, mode, itemSel, ...keep } = G;
      localStorage.setItem(SAVE_KEY(slot), JSON.stringify({ v: 1, G: keep }));
      if (!silent) toast('Game saved.');
    } catch (e) { if (!silent) toast('Save failed (storage blocked).', true); }
  }
  function load(slot = 'manual') {
    try {
      const raw = localStorage.getItem(SAVE_KEY(slot)) || localStorage.getItem(SAVE_KEY('auto'));
      if (!raw) { toast('No saved game found.', true); return false; }
      const d = JSON.parse(raw);
      Object.assign(G, d.G, { mode: 'play', pending: null, tx: null, ty: null, cut: false, dead: false, itemSel: null });
      goto(G.room, G.px, G.py, { noSave: true });
      toast('Game restored.');
      return true;
    } catch (e) { toast('Load failed.', true); return false; }
  }
  const hasSave = () => { try { return !!(localStorage.getItem(SAVE_KEY('manual')) || localStorage.getItem(SAVE_KEY('auto'))); } catch (e) { return false; } };

  /* ---------- main loop ---------- */
  let last = 0, rafQueued = false;
  function tick(ts) {
    rafQueued = false;
    queueFrame();
    step(ts);
  }
  function queueFrame() {
    if (rafQueued) return;
    rafQueued = true;
    requestAnimationFrame(tick);
  }
  function step(ts) {
    const dt = Math.max(0, Math.min(50, ts - last)); last = ts;
    A.t = ts;
    if (G.mode === 'play' && !G.dead && !busy()) update(dt);
    draw(ts);
  }
  function update(dt) {
    if (G.tx !== null) {
      const sp = 0.16 * dt * playerScale();
      if (!Number.isFinite(G.px) || !Number.isFinite(G.py)) { G.px = G.tx; G.py = G.ty; }
      const dx = G.tx - G.px, dy = G.ty - G.py;
      const d = Math.hypot(dx, dy);
      if (Math.abs(dx) > 1) G.facing = dx > 0 ? 1 : -1;
      if (d <= Math.max(sp, 0.01)) {
        G.px = G.tx; G.py = G.ty; G.tx = G.ty = null;
        const p = G.pending; G.pending = null;
        if (p) p();
      } else {
        G.px += dx / d * sp; G.py += dy / d * sp;
        G.walkAnim += dt;
      }
    }
  }
  function draw(ts) {
    cx.imageSmoothingEnabled = false;
    const r = room();
    if (!r) { A.R(0, 0, 640, 400, '#000'); return; }
    r.draw(ts);
    if (!G.hidePlayer && !r.hidePlayer) {
      A.brendon(G.px, G.py, {
        scale: playerScale(), flip: G.facing < 0,
        pose: G.tx !== null ? 'walk' : (r.playerPose || 'stand'),
        frame: Math.floor(G.walkAnim / 130),
      });
    }
    if (r.above) r.above(ts);
    if (G.mode === 'play') statusBar();
  }
  function statusBar() {
    A.R(0, 0, 640, 22, '#efeadb');
    A.R(0, 22, 640, 2, '#000');
    F.text(cx, 'LEISURE SUIT BRENDON', 8, 4, 2, '#1a1a24');
    const right = `SCORE:${G.score} OF ${maxScore()}  $${G.money}`;
    const rx = 632 - F.width(right, 2);
    F.text(cx, right, rx, 4, 2, '#1a1a24');
    F.center(cx, timeStr(), (8 + F.width('LEISURE SUIT BRENDON', 2) + rx) / 2, 4, 2, '#1a1a24');
  }

  return {
    $id, clamp, say, speak, think, sayRaw, choose, toast, panel, closePanel, busy,
    award, pay, gain, has, addItem, removeItem, clock, timeStr, maxScore,
    goto, room, walkTo, hotspots, hotAt, actOn, applyItem, runHandler,
    setVerb, setItemSel, die, save, load, hasSave, tick, step, snap: takeSnapshot,
    onCanvasClick, onCanvasMove, advanceMsg,
    get msgOpen() { return !!msgBoxEl; },
    get choiceOpen() { return !!choiceEl; },
    get panelOpen() { return !!panelEl; },
  };
})();
