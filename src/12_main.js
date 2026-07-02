/* ── boot & wiring ── */
(() => {
  function boot() {
    cv = document.getElementById('cv');
    cx = cv.getContext('2d');
    overlayEl = document.getElementById('overlay');
    hoverEl = document.getElementById('hoverline');
    cmdEl = document.getElementById('cmd');
    A.bind(cx);

    // canvas input
    cv.addEventListener('click', e => E.onCanvasClick(e));
    cv.addEventListener('mousemove', e => E.onCanvasMove(e));

    // verbs
    document.querySelectorAll('.vb[data-verb]').forEach(b =>
      b.addEventListener('click', () => { E.setItemSel(null); E.setVerb(b.dataset.verb); }));
    document.getElementById('vb-inv').addEventListener('click', () => {
      if (G.mode !== 'play') return;
      if (E.panelOpen) E.closePanel(true); else UI.inventory();
    });
    document.getElementById('vb-hint').addEventListener('click', () => { if (G.mode === 'play' && !E.busy()) UI.hint(); });
    document.getElementById('vb-save').addEventListener('click', () => { if (G.mode === 'play') E.save(); });
    document.getElementById('vb-load').addEventListener('click', () => { if (!E.busy() || G.mode !== 'play') E.load(); });
    const sndBtn = document.getElementById('vb-snd');
    const syncSnd = on => sndBtn.textContent = on ? 'SND:ON' : 'SND:OFF';
    syncSnd(!MUTED);
    sndBtn.addEventListener('click', () => { audioInit(); syncSnd(audioToggle()); });

    // text parser
    document.getElementById('cmdform').addEventListener('submit', e => {
      e.preventDefault();
      if (E.msgOpen) { E.advanceMsg(); return; }
      const v = cmdEl.value.trim();
      cmdEl.value = '';
      if (!v) return;
      if (G.mode !== 'play') { return; }
      if (E.choiceOpen || E.panelOpen) return;
      PARSER.parse(v);
    });

    // global keys
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const pnl = document.querySelector('.panel');
        if (pnl && !pnl.dataset.stay) E.closePanel(true);
        else if (G.itemSel) E.setItemSel(null);
        return;
      }
      if ((e.key === ' ' || e.key === 'Enter') && E.msgOpen && document.activeElement !== cmdEl) {
        e.preventDefault(); E.advanceMsg();
      }
    });

    // wake audio on first gesture
    const wake = () => { audioInit(); document.removeEventListener('pointerdown', wake); document.removeEventListener('keydown', wake); };
    document.addEventListener('pointerdown', wake);
    document.addEventListener('keydown', wake);

    // go
    G.mode = 'title';
    E.goto('title', 320, 330, { noSave: true });
    requestAnimationFrame(E.tick);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
