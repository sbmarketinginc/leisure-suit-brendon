/* ── text parser: because it isn't 1987 without one ── */
const PARSER = (() => {
  const FILLER = new Set(['a', 'an', 'the', 'to', 'at', 'my', 'that', 'this', 'some', 'of', 'please', 'up', 'in', 'into', 'on', 'onto', 'with']);
  const VERB = {
    walk: ['walk', 'go', 'run', 'move', 'head'],
    look: ['look', 'l', 'examine', 'x', 'inspect', 'watch', 'stare', 'view'],
    use: ['use', 'open', 'push', 'pull', 'press', 'turn', 'touch', 'operate', 'climb', 'sit', 'spin', 'hail', 'dial', 'change'],
    talk: ['talk', 'speak', 'ask', 'tell', 'chat', 'greet', 'hi', 'hello', 'flirt', 'hit'],  // "hit on" — this IS that kind of game
    take: ['take', 'get', 'grab', 'pick', 'steal', 'lift'],
    give: ['give', 'hand', 'offer', 'show'],
    buy: ['buy', 'order', 'purchase', 'pay'],
  };
  const V2C = {};
  Object.entries(VERB).forEach(([c, ws]) => ws.forEach(w => V2C[w] = c));

  const ERRORS = [
    "The parser squints at that and slowly shakes its head.",
    "You can't do that. At least not here, not now, and definitely not in those pants.",
    "That's not something Brendon knows how to do. His skill tree is mostly 'winking'.",
    "Try LOOK, TAKE, USE, TALK, GIVE… or type HINT when dignity fails.",
  ];
  let errN = 0;

  const norm = s => s.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = s => norm(s).split(' ').filter(w => w && !FILLER.has(w));

  function matchWords(phrase, words) {
    // score: how many phrase tokens appear in candidate words
    let hit = 0;
    for (const t of phrase) if (words.some(w => w === t || w.startsWith(t) && t.length >= 3)) hit++;
    return hit;
  }
  function findItem(phrase) {
    let best = null, bs = 0;
    for (const id of G.inv) {
      const it = ITEMS[id];
      const words = norm(it.name).split(' ').concat(it.syn || []);
      const s = matchWords(phrase, words);
      if (s > bs) { bs = s; best = id; }
    }
    return bs > 0 ? best : null;
  }
  function findHot(phrase) {
    let best = null, bs = 0;
    for (const h of E.hotspots()) {
      if (!h.name) continue;
      const words = norm(h.name).split(' ').concat(h.syn || []);
      const s = matchWords(phrase, words);
      if (s > bs) { bs = s; best = h; }
    }
    return bs > 0 ? best : null;
  }

  const GLOBAL = [
    { re: /^(i|inv|inventory|items|pockets)$/, fn: () => UI.inventory() },
    { re: /^(hint|hints|help me|what now|stuck)$/, fn: () => UI.hint() },
    { re: /^(help|how|controls|\?)$/, fn: () => UI.help() },
    { re: /^(score|points)$/, fn: () => E.say(`You have ${G.score} of ${E.maxScore()} points, ${G.money} dollars, and roughly zero shame.`) },
    { re: /^save( game)?$/, fn: () => E.save() },
    { re: /^(load|restore)( game)?$/, fn: () => E.load() },
    { re: /^(quit|exit game)$/, fn: () => E.say("You can't quit. This is a browser tab. YOU hold the power here.") },
    { re: /^(xyzzy|plugh)$/, fn: () => E.say("A hollow voice says: 'Wrong genre, pal.'") },
    { re: /^pray$/, fn: () => E.say("Brendon prays for charisma. The request is politely declined upstream.") },
    { re: /^(sing|whistle)$/, fn: () => E.say("Brendon belts three bars of a power ballad. Somewhere, a dog files a complaint.") },
    { re: /^(wink|smile|pose|flex)$/, fn: () => E.say("Devastating. Absolutely devastating. Zero witnesses, sadly.") },
    { re: /^dance$/, fn: () => E.say("Brendon does the move he calls 'The Fax Machine'. It needs a licensed venue… like a disco.") },
    { re: /^(look|l|look around)$/, fn: () => { const r = E.room(); return E.say(r.desc || "It's a place. People have been in it."); } },
    { re: /^(time|what time is it)$/, fn: () => E.say(`It's ${E.timeStr()}. The night is ${G.time > 24 * 60 ? 'getting away from you' : 'young-ish'}.`) },
  ];

  async function parse(raw) {
    const s = norm(raw);
    if (!s) return;
    E.snap();   // deaths rewind to just before this command
    // bare "leave/exit" → head for the obvious way out
    if (/^(leave|exit|out|go back)$/.test(s)) {
      const ex = E.hotspots().find(h => h.goto && (h.syn || []).some(w => ['exit', 'leave', 'out'].includes(w)));
      if (ex) return E.actOn(ex, 'walk');
      return E.say("No obvious exit presents itself. Story of this whole town.");
    }
    // 1. global commands
    for (const g of GLOBAL) if (g.re.test(s)) return g.fn();
    // debug cheats (#debug in URL)
    if (location.hash.includes('debug')) {
      const w = s.match(/^warp (\w+)$/);
      if (w && ROOMS[w[1]]) return E.goto(w[1]);
      if (s === 'rich') return E.gain(500, 'debug money');
      if (s === 'gimme') { Object.keys(ITEMS).forEach(i => G.inv.includes(i) || G.inv.push(i)); return E.say('Debug: all items granted.'); }
      if (s === 'stage2') { Object.assign(G.flags, { introDone: 1, drunkPaid: 1, tookRing: 1, knowDoorPass: 1, salGone: 1, roseGiven: 1, knowPassword: 1, gotCard: 1, dumpsterOpen: 1 }); ['remote', 'rose', 'card'].forEach(i => G.inv.includes(i) || G.inv.push(i)); return E.say('Debug: Nadine arc complete.'); }
      if (s === 'stage3') { Object.assign(G.flags, { introDone: 1, salGone: 1, roseGiven: 1, knowPassword: 1, gotCard: 1, discoIn: 1, dawnMet: 1, dawnDrink: 1, dawnRose: 1, dawnDanced: 1, engaged: 1 }); return E.say('Debug: ready to wed at the chapel.'); }
      if (s === 'stage4') { Object.assign(G.flags, { introDone: 1, salGone: 1, roseGiven: 1, knowPassword: 1, discoIn: 1, wedded: 1, escaped: 1 }); ['spray', 'wine', 'apple', 'mag', 'note'].forEach(i => G.inv.includes(i) || G.inv.push(i)); G.money = 20; return E.say('Debug: post-wedding, casino arc ready.'); }
    }
    // 2. room-specific command hooks (passwords, wiggle, wash hands…)
    const r = E.room();
    if (r && r.cmds) for (const c of r.cmds) {
      if (c.when && !c.when()) continue;
      if (c.re.test(s)) return c.fn(s.match(c.re));
    }
    // 3. two-object: use/give/show A on/to/with B
    let m = s.match(/^(use|give|hand|offer|show|put|pour)\s+(.+?)\s+(?:on|to|with|at|in|into)\s+(.+)$/);
    if (m) {
      const item = findItem(tokens(m[2]));
      const hot = findHot(tokens(m[3]));
      if (item && hot) return E.applyItem(item, hot);
      if (!item) return E.say(`You're not carrying ${m[2].match(/s$/) ? 'any' : 'a'} ${m[2]}.`);
      return E.say(`You don't see ${m[3]} here worth the effort.`);
    }
    // 4. verb + object
    const tk = norm(s).split(' ');
    const vw = tk[0];
    const canon = V2C[vw] || null;
    const objPhrase = tokens(tk.slice(1).join(' '));
    if (objPhrase.length) {
      const hot = findHot(objPhrase);
      const item = findItem(objPhrase);
      if (canon && hot) {
        if (canon === 'give' && G.itemSel) return E.applyItem(G.itemSel, hot);
        if (canon === 'give') return E.say('Give WHAT? Try: GIVE thing TO person.');
        if (canon === 'buy') return E.runHandler(hot, hot.buy ? 'buy' : 'use');
        if (canon === 'walk') return E.actOn(hot, 'walk');
        return E.actOn(hot, canon);
      }
      if (hot && !canon) {  // special verb on hotspot: knock door, search dumpster…
        if (hot[vw]) return E.runHandler(hot, vw);
        if (hot.use) return E.runHandler(hot, 'use');
      }
      if (item) {           // verb on inventory item: read magazine, drink whiskey, wear…
        const it = ITEMS[item];
        if (canon === 'look') return E.say(it.desc);
        if (it.verbs && it.verbs[vw]) return it.verbs[vw]();
        if (canon === 'use' && it.verbs && it.verbs.use) return it.verbs.use();
        if (canon === 'take') return E.say("Already got it. It's in the suit. The suit has POCKETS, baby.");
        return E.say(`The ${it.name} resists your attempt to ${vw} it.`);
      }
      if (canon === 'look') return E.say(`You see no ${tk.slice(1).join(' ')} here. Vision's fine — it's the town that's blurry.`);
      return E.say(ERRORS[(errN++) % ERRORS.length]);
    }
    // 5. bare special verb → maybe an item verb ("drink", "spray")
    if (!canon) {
      for (const id of G.inv) { const it = ITEMS[id]; if (it.verbs && it.verbs[vw]) return it.verbs[vw](); }
    }
    if (canon) return E.say(`${canon.toUpperCase()} what? Point at something, hotshot.`);
    return E.say(ERRORS[(errN++) % ERRORS.length]);
  }
  return { parse };
})();
