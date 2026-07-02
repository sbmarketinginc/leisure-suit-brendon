/* ── meta: title screen, age quiz, inventory UI, help, hint, credits ── */
const UI = (() => {
  const FRESH = () => ({
    mode: 'title', room: 'title', px: 320, py: 330, facing: 1, frame: 0,
    tx: null, ty: null, pending: null, verb: 'walk', itemSel: null,
    inv: [], money: 94, score: 0, got: {}, flags: {}, time: 22 * 60 + 4,
    dead: false, cut: false, hidePlayer: false, walkAnim: 0,
  });

  /* ---------- inventory ---------- */
  function iconCanvas(id) {
    const c = document.createElement('canvas');
    c.width = 24; c.height = 24;
    const g2 = c.getContext('2d');
    const g = (color, x, y, w, h) => { g2.fillStyle = color; g2.fillRect(x, y, w, h); };
    g('#161225', 0, 0, 24, 24);
    (ITEMS[id].icon || (() => { }))(g);
    return c;
  }
  function inventory() {
    const p = E.panel(`
      <h3>Brendon's pockets — $${G.money}</h3>
      <div id="invgrid"></div>
      <div class="note" id="invdesc">${G.inv.length ? 'Click an item to inspect it. USE it on the world from there.' : "Empty, like your dance card. The night is young — go acquire things."}</div>
      <div class="mg-row"><button class="pbtn" id="invclose">Close</button></div>
    `);
    const grid = p.querySelector('#invgrid');
    let sel = null;
    G.inv.forEach(id => {
      const cell = document.createElement('div');
      cell.className = 'invcell'; cell.tabIndex = 0;
      cell.appendChild(iconCanvas(id));
      const nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = ITEMS[id].name;
      cell.appendChild(nm);
      const pick = () => {
        p.querySelectorAll('.invcell').forEach(c => c.classList.remove('sel'));
        cell.classList.add('sel'); sel = id;
        p.querySelector('#invdesc').innerHTML = '';
        p.querySelector('#invdesc').textContent = ITEMS[id].desc;
        let ub = p.querySelector('#invuse');
        if (!ub) {
          ub = document.createElement('button');
          ub.className = 'pbtn hot'; ub.id = 'invuse';
          p.querySelector('.mg-row').prepend(ub);
          ub.addEventListener('click', () => { E.closePanel(true); E.setItemSel(sel); });
        }
        ub.textContent = `USE ${ITEMS[id].name} ON… (click a thing or person)`;
      };
      cell.addEventListener('click', pick);
      cell.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
      grid.appendChild(cell);
    });
    p.querySelector('#invclose').addEventListener('click', () => E.closePanel(true));
  }

  /* ---------- help / hint ---------- */
  function help(fromTitle) {
    const p = E.panel(`
      <h3>How to play</h3>
      <div class="note" style="font-size:13px">
        <p><b style="color:var(--ink)">THE GOAL:</b> It's 10 PM in Pittsburgh. Find true love by sunrise. Score all <b style="color:var(--gold)">222 points</b> if you're a legend.</p>
        <p><b style="color:var(--ink)">MOUSE/TOUCH:</b> pick a verb (WALK · LOOK · USE · TALK · TAKE), then click the scene. Exits open with a plain click. ITEMS opens your pockets — pick one, then click what to use it on.</p>
        <p><b style="color:var(--ink)">KEYBOARD (the classy way):</b> type commands like <b>look sink</b>, <b>talk to bartender</b>, <b>buy whiskey</b>, <b>give whiskey to drunk</b>, <b>use remote on tv</b>, <b>search dumpster</b>, <b>dance</b>, <b>wiggle</b>…</p>
        <p><b style="color:var(--ink)">STUCK?</b> The HINT button knows what to do next. No shame. Some shame. Manageable shame.</p>
        <p><b style="color:var(--ink)">DYING:</b> happens, comedically. The game rewinds you — no progress lost.</p>
        <p><b style="color:var(--ink)">SAVING:</b> auto-saves every room. SAVE/LOAD buttons for manual control.</p>
      </div>
      <div class="mg-row"><button class="pbtn" id="helpok">${fromTitle ? '← Back' : 'Got it'}</button></div>
    `);
    p.querySelector('#helpok').addEventListener('click', () => { E.closePanel(true); if (fromTitle) titleMenu(); });
  }
  function hint() {
    const r = E.room();
    const h = r && r.hint ? r.hint() : null;
    return E.sayRaw([{ t: h || "Explore. Talk to everyone. LOOK at everything. When in doubt: the answer is usually 'be nicer than the town expects.'", who: '💡 HINT' }]);
  }

  /* ---------- title screen + quiz ---------- */
  ROOMS.title = {
    name: 'title', music: 'lounge', hidePlayer: true,
    walk: { x0: 0, x1: 640, y0: 330, y1: 340 },
    draw(t) {
      A.R(0, 0, 640, 400, '#05040c');
      A.sky(0, 240, 5, 560, 40);
      A.skyline(300, 3);
      A.dither(0, 300, 640, 100, '#14121f', '#0e0c18', 2);
      F.neon(cx, 'LEISURE SUIT', 320, 60, 3, '#41f0e0', t, 1);
      F.neon(cx, 'BRENDON', 320, 106, 6, '#ff5df1', t, 1);
      F.center(cx, 'IN THE CITY OF BRIDGES', 320, 172, 2, '#f5c542');
      F.center(cx, 'A PARODY HOMAGE IN QUESTIONABLE TASTE', 320, 196, 1, '#8d8798');
      // strutting Brendon
      const px = ((t / 14) % 800) - 80;
      const flip = false;
      A.brendon(px, 372, { scale: 1.3, pose: 'walk', frame: Math.floor(t / 140), flip });
      A.glow(px, 340, 40, '#ff5df1', 0.08);
      F.center(cx, '© NOBODY. PLEASE, NOBODY CLAIM THIS.', 320, 386, 1, '#3f3a50');
    },
    hot: () => [],
    enter() { titleMenu(); },
    hint() { return "Press NEW GAME. Adventure (and paperwork) awaits."; },
  };
  function titleMenu() {
    const p = E.panel(`
      <h3 style="text-align:center">— shall we? —</h3>
      <div class="mg-row" style="justify-content:center;flex-direction:column;align-items:stretch">
        <button class="pbtn hot" id="tnew" style="font-size:16px">▶ NEW GAME</button>
        ${E.hasSave() ? '<button class="pbtn" id="tcont">↻ CONTINUE</button>' : ''}
        <button class="pbtn" id="thelp">? HOW TO PLAY</button>
      </div>
      <div class="note" style="text-align:center;margin-top:8px">contains: innuendo (vintage), polyester (structural), gambling (rigged in your favor)</div>
    `);
    p.dataset.stay = '1';
    p.style.top = '68%';
    p.querySelector('#tnew').addEventListener('click', () => { E.closePanel(true); quiz(); });
    const tc = p.querySelector('#tcont');
    if (tc) tc.addEventListener('click', () => { E.closePanel(true); if (!E.load()) titleMenu(); });
    p.querySelector('#thelp').addEventListener('click', () => { E.closePanel(true); help(true); });
  }
  const QUIZ = [
    { q: "Your dream home features:", a: ["A ball pit", "A two-car garage and a lawn you defend emotionally", "A moat (negotiable)", "Posters held up by hope"], c: 1 },
    { q: "A '401(k)' is:", a: ["A robot", "A highway", "Retirement savings you think about at 3 AM", "A very good bowling score"], c: 2 },
    { q: "The thermostat should be set to:", a: ["85. Tropical.", "68, and NOBODY touches it", "Whatever it wants", "Off. Blankets exist."], c: 1 },
    { q: "You find a sturdy cardboard box. You:", a: ["Recycle it immediately", "Wear it", "Keep it. That's a GOOD box. You might need it.", "Live in it ironically"], c: 2 },
    { q: "At a party, you are most likely to yell:", a: ["'CANNONBALL!'", "'DJ! LOUDER!'", "'Whose turtle is this?'", "'WHO made this hummus? It's INCREDIBLE.'"], c: 3 },
    { q: "Taxes are:", a: ["Optional", "A cryptid", "Due in April, feared year-round", "Delicious"], c: 2 },
    { q: "A folding chair standing alone in a shoveled parking spot means:", a: ["Free chair!", "Modern art", "That spot is CLAIMED until spring, possibly forever", "Yard sale starts at 8"], c: 2 },
    { q: "Someone tells you 'Kennywood's open.' You:", a: ["Buy ride tickets", "Check your zipper IMMEDIATELY", "Call Kennywood to confirm", "Simply believe them"], c: 1 },
  ];
  function quiz(qNum = 0, picked = null) {
    if (!picked) { picked = [...QUIZ].sort(() => Math.random() - 0.5).slice(0, 2); }
    if (qNum >= picked.length) return startGame();
    const Q = picked[qNum];
    const p = E.panel(`
      <h3>⚠ ADULTHOOD VERIFICATION — question ${qNum + 1} of ${picked.length}</h3>
      <div class="note" style="margin-bottom:8px">This game contains vintage innuendo. Prove you're old enough to be disappointed by it.</div>
      <div style="font-size:15px;margin:6px 0 10px">${Q.q}</div>
      <div id="qa"></div>
    `);
    p.dataset.stay = '1';
    const qa = p.querySelector('#qa');
    Q.a.forEach((ans, i) => {
      const b = document.createElement('button');
      b.className = 'pbtn'; b.style.display = 'block'; b.style.width = '100%'; b.style.margin = '0 0 6px'; b.style.textAlign = 'left';
      b.textContent = ans;
      b.addEventListener('click', () => {
        E.closePanel(true);
        if (i === Q.c) { SFX.blip(660, 0.06); quiz(qNum + 1, picked); }
        else quizFail();
      });
      qa.appendChild(b);
    });
  }
  function quizFail() {
    SFX.buzz();
    const p = E.panel(`
      <h3>✖ VERIFICATION FAILED</h3>
      <div class="note">Nice try, kid. Come back when you can name three kinds of mortgage and feel something about each.</div>
      <div class="mg-row"><button class="pbtn hot" id="qretry">I AM an adult. Ask me again.</button><button class="pbtn" id="qback">Retreat to title</button></div>
    `);
    p.dataset.stay = '1';
    p.querySelector('#qretry').addEventListener('click', () => { E.closePanel(true); quiz(); });
    p.querySelector('#qback').addEventListener('click', () => { E.closePanel(true); titleMenu(); });
  }
  function startGame() {
    Object.assign(G, FRESH(), { mode: 'play' });
    E.setVerb('walk');
    E.goto('street', 90, 330, { first: true });
  }

  /* ---------- credits ---------- */
  function rank(s) {
    if (s >= 222) return 'MAXIMUM BRENDON';
    if (s >= 180) return 'Sultan of Suave';
    if (s >= 120) return 'Certified Smooth Operator';
    if (s >= 60) return 'Polyester Apprentice';
    return 'Lounge Lizard (Larval Stage)';
  }
  function credits() {
    const max = E.maxScore();
    const missed = max - G.score;
    const p = E.panel(`
      <h3 style="text-align:center">♥ THE END ♥</h3>
      <div style="text-align:center;font-size:15px;line-height:1.7">
        Brendon found what he was looking for.<br>It was never the jacuzzi. (It was a LITTLE the jacuzzi.)<br><br>
        FINAL SCORE: <b style="color:var(--gold);font-size:20px">${G.score} of ${max}</b><br>
        RANK: <b style="color:var(--neon-pink)">${rank(G.score)}</b><br>
        <span class="note">${missed === 0 ? "A PERFECT GAME. Roxy would post about you. Sal would name an owl after you." : `${missed} points still hiding out there — easter eggs, side-quests, acts of unnecessary kindness…`}</span>
      </div>
      <div class="note" style="text-align:center;margin-top:10px">
        starring BRENDON as himself · with DAWN, EVA, ROXY, GRACE, MARGE,<br>BIG SAL, BRUNO, RANDY, DJ TANGO, THE REV. ELVIS PREZLEY,<br>one (1) philosophical cat &amp; one (1) commemorative porcelain owl<br><br>
        an original parody homage to Sierra On-Line's 1987 classic —<br>all art, words &amp; code made new. no affiliation, only affection.
      </div>
      <div class="mg-row" style="justify-content:center;margin-top:10px">
        <button class="pbtn hot" id="cragain">↻ PLAY AGAIN</button>
        <button class="pbtn" id="crstay">🌅 Linger on the roof</button>
      </div>
    `);
    p.dataset.stay = '1';
    p.querySelector('#cragain').addEventListener('click', () => {
      E.closePanel(true);
      Object.assign(G, FRESH());
      E.goto('title', 320, 330, { noSave: true });
    });
    p.querySelector('#crstay').addEventListener('click', () => {
      E.closePanel(true);
      G.cut = false;
      E.goto('penthouse', 200, 340);
    });
  }

  return { inventory, help, hint, credits, titleMenu, quiz, startGame };
})();
