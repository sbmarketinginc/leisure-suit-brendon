/* ── minigames: slots, blackjack, the dance-off ── */
const MG = (() => {

  /* ---------- SLOTS ---------- */
  const SYMS = ['♦', '♥', '★', 'BAR', '7'];
  const WEIGHTS = [30, 26, 20, 14, 10];
  function spinSym() {
    let r = Math.random() * 100, acc = 0;
    for (let i = 0; i < SYMS.length; i++) { acc += WEIGHTS[i]; if (r < acc) return SYMS[i]; }
    return SYMS[0];
  }
  function slots() {
    let bet = 5, spinning = false;
    G.flags.spinCount = G.flags.spinCount || 0;
    const p = E.panel(`
      <h3>♦ CHERRY FURY DELUXE ♦</h3>
      <div class="mg-row" style="justify-content:center">
        <span class="reel" id="r0">♦</span><span class="reel" id="r1">♥</span><span class="reel" id="r2">★</span>
      </div>
      <div class="mg-row" style="justify-content:center">
        <button class="pbtn" id="betdn">−</button>
        <span class="mg-stat">bet: <b id="bet">$5</b></span>
        <button class="pbtn" id="betup">+</button>
        <button class="pbtn hot" id="spin">PULL THE LEVER</button>
      </div>
      <div class="mg-stat" id="slotmsg" style="min-height:34px">Pays: three 7s — 25× (JACKPOT) · three of a kind — 10× · two 7s — 3× · any pair — 2×</div>
      <div class="mg-row"><span class="mg-stat">cash: <b id="bank">$${G.money}</b></span><span class="spacer"></span><button class="pbtn" id="quit">Walk away</button></div>
    `);
    const $ = s => p.querySelector(s);
    const refresh = () => { $('#bet').textContent = '$' + bet; $('#bank').textContent = '$' + G.money; };
    $('#betdn').addEventListener('click', () => { bet = bet === 10 ? 5 : 1; refresh(); });
    $('#betup').addEventListener('click', () => { bet = bet === 1 ? 5 : 10; refresh(); });
    $('#quit').addEventListener('click', () => E.closePanel(true));
    $('#spin').addEventListener('click', async () => {
      if (spinning) return;
      if (G.money < bet) { $('#slotmsg').textContent = "The machine sniffs your empty pockets. Maybe the waitress has mercy money."; return; }
      spinning = true;
      G.money -= bet; refresh();
      SFX.spin();
      const reels = [$('#r0'), $('#r1'), $('#r2')];
      let res = [spinSym(), spinSym(), spinSym()];
      // early-luck: first 3 spins, losing rolls get one mercy reroll toward a pair
      G.flags.spinCount++;
      if (G.flags.spinCount <= 3 && !(res[0] === res[1] || res[1] === res[2] || res[0] === res[2])) {
        if (Math.random() < 0.65) res[2] = res[0];
      }
      const t0 = performance.now();
      await new Promise(done => {
        const iv = setInterval(() => {
          const el = performance.now() - t0;
          reels.forEach((r, i) => { if (el < 350 + i * 300) r.textContent = spinSym(); else r.textContent = res[i]; });
          if (el > 1300) { clearInterval(iv); done(); }
        }, 70);
      });
      const [a, b, c] = res;
      let win = 0, msg = '';
      const sevens = res.filter(s => s === '7').length;
      if (a === b && b === c && a === '7') { win = bet * 25; msg = "🎰 JACKPOT!!! Three sevens! The machine plays a tiny anthem. A stranger salutes."; E.award('egg_jackpot', 'JACKPOT'); }
      else if (a === b && b === c) { win = bet * 10; msg = "THREE OF A KIND! The machine coughs up like it owes you money. (It did.)"; }
      else if (sevens === 2) { win = bet * 3; msg = "Two sevens! Two thirds of glory pays three times the bet."; }
      else if (a === b || b === c || a === c) { win = bet * 2; msg = "A pair! Modest, honest winnings. The machine respects the grind."; }
      else msg = ["The reels shrug.", "So close! (It was not close.)", "The machine keeps your dollar and its opinion of you.", "A ♦, a ★, and a lesson."][Math.floor(Math.random() * 4)];
      if (win) {
        G.money += win; SFX.jingle();
        msg += ` +$${win}!`;
        E.award('slots_win', 'beat the machine');
        if (G.money >= 50 && G.flags.escaped) E.award('bank_50', 'bankroll rebuilt');
      }
      $('#slotmsg').textContent = msg;
      refresh(); spinning = false;
    });
  }

  /* ---------- BLACKJACK ---------- */
  function bjCard() {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♥', '♦', '♣'];
    const r = ranks[Math.floor(Math.random() * 13)], s = suits[Math.floor(Math.random() * 4)];
    return { r, s, red: s === '♥' || s === '♦' };
  }
  function bjVal(hand) {
    let v = 0, aces = 0;
    for (const c of hand) {
      if (c.r === 'A') { v += 11; aces++; }
      else if ('JQK'.includes(c.r)) v += 10;
      else v += parseInt(c.r);
    }
    while (v > 21 && aces) { v -= 10; aces--; }
    return v;
  }
  function blackjack() {
    let bet = 10, hand = [], dealer = [], inRound = false;
    const p = E.panel(`
      <h3>♠ BLACKJACK — table minimum: $5, judgment: free ♠</h3>
      <div class="mg-stat">DEALER <span id="dv"></span></div>
      <div class="mg-row" id="dhand"></div>
      <div class="mg-stat">YOU <span id="pv"></span></div>
      <div class="mg-row" id="phand"></div>
      <div class="mg-row">
        <button class="pbtn" id="betdn">−</button><span class="mg-stat">bet: <b id="bet">$10</b></span><button class="pbtn" id="betup">+</button>
        <button class="pbtn hot" id="deal">DEAL</button>
        <button class="pbtn" id="hit" disabled>HIT</button>
        <button class="pbtn" id="stand" disabled>STAND</button>
      </div>
      <div class="mg-stat" id="bjmsg" style="min-height:34px">The dealer riffles the deck like it insulted him. Place your bet.</div>
      <div class="mg-row"><span class="mg-stat">cash: <b id="bank">$${G.money}</b></span><span class="spacer"></span><button class="pbtn" id="quit">Leave table</button></div>
    `);
    const $ = s => p.querySelector(s);
    const draw = (hideHole) => {
      $('#dhand').innerHTML = dealer.map((c, i) => i === 1 && hideHole ? `<span class="card back">??</span>` : `<span class="card ${c.red ? 'red' : ''}">${c.r}${c.s}</span>`).join('');
      $('#phand').innerHTML = hand.map(c => `<span class="card ${c.red ? 'red' : ''}">${c.r}${c.s}</span>`).join('');
      $('#pv').textContent = hand.length ? '(' + bjVal(hand) + ')' : '';
      $('#dv').textContent = dealer.length ? (hideHole ? '(' + bjVal([dealer[0]]) + ' + ?)' : '(' + bjVal(dealer) + ')') : '';
      $('#bank').textContent = '$' + G.money;
      $('#bet').textContent = '$' + bet;
    };
    const setBtns = () => { $('#deal').disabled = inRound; $('#hit').disabled = !inRound; $('#stand').disabled = !inRound; $('#betdn').disabled = inRound; $('#betup').disabled = inRound; };
    const finish = (msg, delta, win = delta > 0) => {
      inRound = false;
      if (delta > 0) G.money += delta;
      if (win) { SFX.jingle(); E.award('bj_win', 'read the table'); }
      if (G.money >= 50 && G.flags.escaped) E.award('bank_50', 'bankroll rebuilt');
      $('#bjmsg').textContent = msg + (win ? ` +$${delta}!` : '');
      draw(false); setBtns();
    };
    $('#betdn').addEventListener('click', () => { bet = Math.max(5, bet - 5); draw(inRound); });
    $('#betup').addEventListener('click', () => { bet = Math.min(50, bet + 5); draw(inRound); });
    $('#quit').addEventListener('click', () => E.closePanel(true));
    $('#deal').addEventListener('click', () => {
      if (G.money < bet) { $('#bjmsg').textContent = "The dealer taps the felt: 'Cash plays, friend. Sympathy doesn't.'"; return; }
      G.money -= bet; SFX.card();
      hand = [bjCard(), bjCard()]; dealer = [bjCard(), bjCard()];
      inRound = true;
      if (bjVal(hand) === 21) {
        const pay = Math.floor(bet * 2.5);
        finish("BLACKJACK! The dealer nods once — the highest honor he can legally bestow.", pay);
        return;
      }
      $('#bjmsg').textContent = 'Hit or stand?';
      draw(true); setBtns();
    });
    $('#hit').addEventListener('click', () => {
      if (!inRound) return;
      SFX.card(); hand.push(bjCard());
      if (bjVal(hand) > 21) return finish(`BUST at ${bjVal(hand)}. The dealer sweeps your chips with genuine, practiced sorrow.`, 0);
      draw(true);
    });
    $('#stand').addEventListener('click', () => {
      if (!inRound) return;
      while (bjVal(dealer) < 17) { dealer.push(bjCard()); }
      const pv = bjVal(hand), dv = bjVal(dealer);
      SFX.card();
      if (dv > 21) return finish(`Dealer BUSTS at ${dv}! He deals himself a tiny look of betrayal.`, bet * 2);
      if (pv > dv) return finish(`${pv} beats ${dv}. 'Nice hand,' the dealer says, meaning it professionally.`, bet * 2);
      if (pv === dv) return finish(`Push at ${pv}. You and the dealer briefly respect each other. Bet returned.`, bet, false);
      return finish(`${dv} beats ${pv}. The house wins, as is its custom and entire business model.`, 0);
    });
    draw(false); setBtns();
  }

  /* ---------- THE DANCE-OFF ---------- */
  function dance() {
    const ARROWS = ['←', '↑', '↓', '→'];
    const KEYMAP = { ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓', ArrowRight: '→' };
    let round = 0, hits = 0, target = null, timer = null, done = false;
    const p = E.panel(`
      <h3>🕺 DANCE-OFF: BRENDON vs. THE BEAT</h3>
      <div class="note">Dawn is watching. The floor is watching. Hit the arrow that appears — 6 rounds, 4 hits to win her heart (terms and conditions apply).</div>
      <div class="mg-big" id="darrow" style="text-align:center;font-size:64px;min-height:80px;line-height:80px">💃</div>
      <div class="mg-row" style="justify-content:center">
        <button class="pbtn" data-a="←" style="font-size:22px">←</button>
        <button class="pbtn" data-a="↑" style="font-size:22px">↑</button>
        <button class="pbtn" data-a="↓" style="font-size:22px">↓</button>
        <button class="pbtn" data-a="→" style="font-size:22px">→</button>
      </div>
      <div class="mg-stat" id="dmsg" style="min-height:24px;text-align:center">round <span id="dr">0</span>/6 · hits <span id="dh">0</span></div>
      <div class="mg-row" style="justify-content:center"><button class="pbtn hot" id="dgo">HIT IT</button></div>
    `);
    const $ = s => p.querySelector(s);
    function press(a) {
      if (!target || done) return;
      if (a === target) { hits++; SFX.blip(660, 0.06); $('#darrow').textContent = '✓'; }
      else { SFX.buzz(); $('#darrow').textContent = '✗'; }
      target = null; clearTimeout(timer);
      $('#dh').textContent = hits;
      setTimeout(next, 420);
    }
    function next() {
      if (done) return;
      round++;
      $('#dr').textContent = Math.min(round, 6);
      if (round > 6) return finishDance();
      target = ARROWS[Math.floor(Math.random() * 4)];
      $('#darrow').textContent = target;
      SFX.blip(440, 0.05);
      timer = setTimeout(() => { if (!done) { SFX.buzz(); $('#darrow').textContent = '…'; target = null; setTimeout(next, 380); } }, 2000);
    }
    async function finishDance() {
      done = true;
      document.removeEventListener('keydown', keyHandler);
      E.closePanel(true);
      if (hits >= 4) {
        G.flags.dawnDanced = true; E.award('dance', 'The Fax Machine, perfected');
        SFX.fanfare();
        await E.say(`FOUR${hits > 4 ? '-PLUS' : ''} CLEAN HITS. You deploy The Fax Machine, The Photocopier, and a bold new move you invent mid-song called The Quarterly Report.`,
          "The floor clears. Someone yells 'TAX SEASON!' in tribute. Dawn is FANNING herself with a cocktail menu.");
        await E.speak('DAWN', "*breathless* Okay, polyester. That was... that was FILING-CABINET HOT. Come here. We need to talk about our FUTURE.");
      } else {
        await E.say(`${hits} of 6. You attempt The Fax Machine but transmit mostly static. A slow, respectful circle forms around your collapse.`,
          "Dawn mouths 'we will practice'. Ask her to dance again — the beat believes in second chances.");
      }
    }
    const keyHandler = (e) => { if (KEYMAP[e.key]) { e.preventDefault(); press(KEYMAP[e.key]); } };
    document.addEventListener('keydown', keyHandler);
    p.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => press(b.dataset.a)));
    $('#dgo').addEventListener('click', () => { if (round === 0) { $('#dgo').style.display = 'none'; next(); } });
  }

  return { slots, blackjack, dance };
})();
