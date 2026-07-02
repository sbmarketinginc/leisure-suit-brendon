/* ── Rivers Casino: lobby, casino floor, penthouse, finale ── */
(() => {
  const { K, R, dither, bands, glow } = A;

  /* one of Pittsburgh's yellow sister bridges, with the river under it */
  function yellowBridge(x0, x1, deckY, t) {
    const rTop = deckY + 4, rH = 16;
    R(0, rTop, 640, rH, '#0c1a2b');                                  // the river
    const rr = A.rng(77);
    for (let i = 0; i < 26; i++) {                                   // neon smears on the water
      const rx = rr() * 640, ry = rTop + 2 + rr() * (rH - 4);
      R(rx, ry, 4 + rr() * 6, 1, ['#c9a34a', '#41f0e0', '#ff5df1'][i % 3]);
    }
    const gold = '#d9b62a', w = x1 - x0;
    R(x0, deckY, w, 4, gold);                                        // deck
    const t1 = x0 + w * 0.22, t2 = x0 + w * 0.78, th = 26;
    R(t1 - 3, deckY - th, 6, th, gold); R(t2 - 3, deckY - th, 6, th, gold);
    for (let i = 0; i <= 20; i++) {                                  // main cable sag + hangers
      const x = t1 + (t2 - t1) * i / 20;
      const y = deckY - th + Math.sin(Math.PI * i / 20) * (th - 8);
      R(x, y, 2, 2, gold);
      if (i % 4 === 2) R(x, y, 1, deckY - y, '#a8891e');
      if (i % 5 === 0 && Math.floor(t / 700) % 2 === 0) R(x, y - 1, 2, 2, '#ffe9a3');
    }
    for (const [a, b] of [[x0, t1], [t2, x1]]) {                     // side-span cables
      for (let i = 0; i <= 8; i++) {
        const x = a + (b - a) * i / 8;
        const y = deckY - 2 - Math.sin(Math.PI * i / 8) * 8;
        R(x, y, 2, 2, gold);
      }
    }
  }

  /* ═════════ LOBBY ═════════ */
  ROOMS.lobby = {
    name: "Rivers Casino — lobby",
    music: 'casino',
    desc: "The Rivers Casino lobby: marble that judges your shoes, a chandelier with delusions of Versailles, Grace at the front desk, and a gold elevator marked 'PH' that has never once opened for someone like you.",
    walk: { x0: 50, x1: 590, y0: 306, y1: 368 }, sMin: 1.0, sMax: 1.16,
    spawn: [320, 340],
    draw(t) {
      bands(0, 24, 640, 250, ['#2a2136', '#332a44', '#281f34']);
      dither(0, 274, 640, 126, '#8a8496', '#787184', 8);
      R(0, 274, 640, 4, '#5d5570');
      // chandelier
      R(318, 24, 4, 30, '#c9a34a');
      R(280, 54, 80, 8, '#c9a34a'); R(292, 62, 56, 6, '#e0c068');
      for (let i = 0; i < 5; i++) { const fl = Math.sin(t / 200 + i) * 1.5; R(288 + i * 14, 68 + fl, 4, 8, '#ffe9a3'); }
      glow(320, 70, 80, '#ffe9a3', 0.14);
      // front desk
      R(80, 200, 200, 14, '#6a4a7a'); R(86, 214, 188, 76, '#4a3358');
      F.text(cx, 'FRONT DESK', 130, 184, 1, '#e0c068');
      R(110, 190, 14, 10, '#c9a34a'); // desk bell
      if (G.flags.graceBusy && !G.flags.tookKeycard) { R(230, 192, 26, 8, '#f5c542'); } // keycard on desk!
      // Grace
      if (!G.flags.graceBusy) A.person({ x: 170, y: 268, scale: 1.0, hair: 'beehive', hairC: '#c96a2a', skin: '#f0c8a0', top: '#7a2a5a', lipstick: 1 });
      else { A.person({ x: 190, y: 268, scale: 1.0, hair: 'beehive', hairC: '#c96a2a', skin: '#f0c8a0', top: '#7a2a5a', lipstick: 1, flip: 1 }); R(200, 224, 18, 14, '#f7f3e6'); }
      // gold elevator
      R(470, 120, 110, 160, '#8a6a2a'); R(480, 130, 90, 150, '#c9a34a');
      R(486, 136, 78, 138, '#3a2c10'); R(490, 140, 34, 130, '#e0c068'); R(526, 140, 34, 130, '#e0c068');
      F.center(cx, 'PH', 525, 106, 2, '#f5c542');
      const dial = Math.floor(t / 900) % 3;
      R(500 + dial * 16, 112, 8, 6, '#ff8b96');
      // casino arch left
      R(20, 130, 14, 150, '#8a6a2a'); R(120, 130, 14, 150, '#8a6a2a'); R(20, 118, 114, 14, '#8a6a2a');
      bands(34, 132, 86, 148, ['#3d1140', '#4a1650']);
      F.neon(cx, 'CASINO', 77, 150, 1, '#f5c542', t, 1);
      const chase = Math.floor(t / 150) % 8;
      for (let i = 0; i < 8; i++) R(24 + i * 13, 122, 6, 6, i === chase ? '#ffe9a3' : '#7a6a3a');
      // palms
      A.plant(400, 300, 1.2); A.plant(620, 300, 1.1);
      // suite corridor right
      F.text(cx, 'SUITES →', 590, 214, 1, '#8d8798');
    },
    hot() {
      return [
        { name: 'Grace', syn: ['grace', 'receptionist', 'clerk', 'desk lady'], x: 130, y: 200, w: 90, h: 90, wx: 170, wy: 320, talk: talkGrace, look: () => E.say(G.flags.graceBusy ? "Grace has folded into the magazine like it's a life raft. Her gum has stopped mid-chew. She is GONE." : "Grace: beehive hair with structural integrity, gum with a half-life, and the unblinking vigilance of a woman guarding the only good elevator in town."), items: { mag: giveMag, rose: "'Sweetie, I've got a boyfriend AND a restraining order kit.'", wine: "'On DUTY. Ask me again in three years.'", card: "'Disco Inferno? Wrong lobby, Chad.'" } },
        { name: 'penthouse keycard', syn: ['keycard', 'card', 'key'], when: () => G.flags.graceBusy && !G.flags.tookKeycard, x: 224, y: 186, w: 38, h: 18, wx: 230, wy: 320, take: takeKeycard, look: "The penthouse keycard, unattended, gleaming like a tiny golden opportunity. Grace is DEEP in page six." },
        { name: 'desk bell', syn: ['bell'], x: 104, y: 184, w: 26, h: 18, wx: 150, wy: 320, use: () => { SFX.bell(); return G.flags.graceBusy ? E.say("DING. Grace turns a page. You could ring it into next week; she's reading about a soap star's THIRD secret twin.") : E.speak('GRACE', "*without looking* I heard you the first time, sugar. I hear EVERYTHING."); }, look: "A brass desk bell polished by ten thousand impatient palms." },
        { name: 'gold elevator (PH)', syn: ['elevator', 'penthouse', 'lift', 'ph'], x: 470, y: 110, w: 110, h: 170, wx: 525, wy: 320, use: useElevator, goto: useElevator, look: "The penthouse elevator: gold doors, private, smug. A small sign: 'PARTY TONIGHT — INVITED GUESTS ONLY (THIS MEANS YOU, CHAD)'." },
        { name: 'casino floor', syn: ['casino', 'arch', 'gambling'], x: 20, y: 118, w: 114, h: 162, wx: 80, wy: 320, goto: () => E.goto('casino', 560, 336), look: "Through the arch: the song of slot machines and the gentle weeping of mathematics." },
        { name: 'chandelier', syn: ['chandelier', 'lights'], x: 276, y: 40, w: 90, h: 44, remote: true, look: "A chandelier worth more than your car. Than everyone's car. It knows." },
        { name: 'hotel suites', syn: ['suite', 'suites', 'hallway', 'room'], x: 586, y: 190, w: 54, h: 120, wx: 590, wy: 336, when: () => G.flags.wedded, goto: () => E.goto('suite', 320, 340), look: "The corridor to the suites, including the scene of your marriage. Both minutes of it." },
        { name: 'revolving door (taxi)', syn: ['taxi', 'door', 'exit', 'out', 'revolving door', 'leave'], x: 250, y: 330, w: 140, h: 60, wx: 320, wy: 356, remote: false, autoUse: true, use: () => TAXI.open(), goto: () => TAXI.open(), look: "The revolving door to the street. A taxi idles hopefully outside, as taxis do." },
      ];
    },
    hint() {
      if (!G.flags.graceBusy) return G.flags.readMag || E.has('mag') ? "Grace would trade her own desk bell for fresh gossip. GIVE the MAGAZINE TO GRACE." : "Grace guards the penthouse elevator. Word is she'd kill for celebrity gossip — the Get-N-Go sells a magazine…";
      if (!G.flags.tookKeycard) return "Grace is GONE into page six. That gold KEYCARD on the desk is basically asking to be taken.";
      if (G.flags.phCoverPaid) return "Cover's paid — you're on the doorman's list for good. USE the ELEVATOR whenever you're ready.";
      if (G.money < 50) return "The penthouse doorman charges a $50 cover (once — he'll remember you). The casino floor next door would love to 'help'.";
      return "Keycard, password, cash. USE the ELEVATOR — destiny's on the roof.";
    },
  };
  async function talkGrace() {
    if (G.flags.graceBusy) return E.speak('GRACE', "*turning a page with surgical care* Mmmm. Uh-huh. Sugar, whatever it is, the answer's in TWENTY pages.");
    if (!G.flags.metGrace) {
      G.flags.metGrace = true;
      await E.speak('GRACE', "*snaps gum* Welcome to the Rivers Casino. Checkout's at eleven, the buffet's at your own risk, and NO, you can't go up to the penthouse.",
        "Three years I've held this desk, sugar. THREE YEARS without so much as a coffee break. You know what keeps me going? *leans in* Gossip. And they keep me too busy to BUY any.");
      return;
    }
    const c = await E.choose('Say to Grace:', ["'About that penthouse…'", "'Three years without a break?!'", "'You look radiant tonight.'"]);
    if (c === 0) return E.speak('GRACE', "Keycard guests ONLY, and the keycard lives with ME, and I live HERE, always, forever. *chews gum with finality*");
    if (c === 1) return E.speak('GRACE', "Management calls me 'irreplaceable'. It's a compliment AND a hostage situation, sugar.");
    return E.speak('GRACE', "*points at you with her gum still in* Flattery gets you a MAP TO THE BUFFET, hot stuff, and nothing else.");
  }
  async function giveMag() {
    E.removeItem('mag');
    await E.speak('GRACE', "*sees the cover* Is that— 'CELEBRITY SECRETS THAT WILL RUIN BRUNCH'?! *the gum stops* SUGAR. You beautiful polyester angel.");
    await E.say("Grace snatches the magazine with the speed of a striking cobra, spins her chair to face the wall, and leaves this dimension entirely.",
      "The front desk is now, functionally, unstaffed. Certain gold objects on it are now, functionally, unsupervised.");
    G.flags.graceBusy = true;
    E.award('grace_mag', 'the gossip gambit');
  }
  async function takeKeycard() {
    G.flags.tookKeycard = true;
    E.addItem('keycard'); E.award('keycard', 'borrowed, officially');
    return E.say("You slide the keycard off the desk with the softest touch of your career. Grace turns a page. Somewhere, a soap star's third twin is revealed. Nobody sees ANYTHING.");
  }
  async function useElevator() {
    if (!E.has('keycard')) {
      SFX.buzz();
      return E.say("You press PH. The elevator emits the exact sound of a game show wrong answer. A tiny slot glows: KEYCARD REQUIRED.", "Behind you, Grace, without looking up: 'Told ya, sugar.'");
    }
    SFX.ding();
    if (G.flags.phCoverPaid) {
      await E.say("The keycard turns the slot GREEN. The doors already know you.");
      await E.speak('DOORMAN', "*unhooks the rope without looking up* Mr. Pony. Welcome back.");
      return E.goto('penthouse', 90, 340);
    }
    await E.say("The keycard turns the slot GREEN. The doors part like golden curtains. You ascend past floor after floor of people having a worse night than you're about to have.");
    await E.sayRaw([{ t: "The doors open on the penthouse landing. A doorman in a tuxedo the size of a two-car garage blocks the velvet rope. He looks at you like an RSVP that bounced.", who: 'THE NARRATOR' }]);
    await E.speak('DOORMAN', "Private party. Password.");
    if (!G.flags.knowPassword) {
      const c = await E.choose('You do NOT know it. Swing anyway:', ["'Swordfish?'", "'Grace sent me?'", "'…Vinnie sent me?'"]);
      await E.speak('DOORMAN', ["Nope.", "Grace sends NOBODY. That's her whole thing.", "Wrong building, wrong Vinnie."][c]);
      await E.say("The elevator returns you to the lobby with the smooth efficiency of a bank declining a loan.");
      return E.think("I need the password. Word on the street is an influencer above Nadine's knows EVERYTHING about this party…");
    }
    const c = await E.choose('The password. You know this. You KNOW this.', ["'BOLOGNA PONY.'", "'Salami Stallion?'", "'Pastrami Pegasus?'"]);
    if (c !== 0) { await E.speak('DOORMAN', "*almost smiles* Close. Deli, equine, but no. Down you go."); return; }
    await E.speak('DOORMAN', "*unhooks precisely nothing yet* Correct. That'll be the cover. Fifty.");
    E.award('ph_password', 'lunch-meat linguistics');
    if (G.money < 50) { await E.speak('DOORMAN', "*re-hooks the nothing* Fifty. Cash. The casino floor is thataway, and statistically speaking, so is bankruptcy. Good luck."); return; }
    const pc = await E.choose('Pay the $50 cover?', ["Pay it. Destiny doesn't haggle.", "Not yet."]);
    if (pc === 1) return E.say("You retreat to count your money like a squirrel with trust issues.");
    E.pay(50, 'penthouse cover'); E.award('ph_cover', 'high roller');
    G.flags.phCoverPaid = true;
    SFX.fanfare();
    await E.say("The velvet rope unclips. Warm night air, string lights, the hum of a rooftop party that considers itself the center of the universe. And beyond it… a jacuzzi.");
    E.goto('penthouse', 90, 340);
  }

  /* ═════════ CASINO FLOOR ═════════ */
  ROOMS.casino = {
    name: "Rivers Casino — floor",
    music: 'casino',
    desc: "The casino floor: slot machines singing their siren song, a blackjack dealer with hands like a magician, and a cocktail waitress who has seen every system fail. The carpet pattern is a war crime.",
    walk: { x0: 50, x1: 590, y0: 306, y1: 368 }, sMin: 1.0, sMax: 1.16,
    spawn: [560, 336],
    draw(t) {
      bands(0, 24, 640, 250, ['#2e1030', '#3a1440', '#280e2c']);
      // war-crime carpet
      dither(0, 274, 640, 126, '#6a1f4f', '#3d1140', 4);
      for (let y = 280; y < 400; y += 16) for (let x = ((y / 16) % 2) * 16; x < 640; x += 32) R(x, y, 6, 6, '#c9a34a');
      F.neon(cx, 'RIVERS', 320, 60, 4, '#41f0e0', t, 1);
      glow(320, 74, 100, '#41f0e0', 0.08);
      // slot bank (starts clear of the cash cage)
      for (let i = 0; i < 3; i++) {
        const sx = 104 + i * 108;
        R(sx, 160, 90, 130, ['#a02840', '#2a5a8a', '#7a3a9a'][i]);
        R(sx + 8, 172, 74, 40, '#1a1020');
        for (let rr = 0; rr < 3; rr++) R(sx + 12 + rr * 24, 178, 18, 28, '#f2ead8');
        const sym = ['♦', '7', '♥'];
        for (let rr = 0; rr < 3; rr++) F.text(cx, sym[(rr + i + Math.floor(t / 700)) % 3], sx + 16 + rr * 24, 186, 1.6, '#a02840');
        R(sx + 24, 220, 42, 14, '#f5c542'); F.text(cx, 'SPIN', sx + 30, 223, 1, '#3a2c10');
        R(sx + 92, 170, 6, 34, '#c9c9c9'); R(sx + 90, 162, 10, 10, '#c22');
        const lit = (Math.floor(t / 180) + i) % 6;
        for (let b = 0; b < 6; b++) R(sx + 6 + b * 14, 152, 8, 6, b === lit ? '#ffe9a3' : '#5a4a2a');
      }
      // blackjack table
      R(430, 210, 170, 70, '#1d6b30'); R(422, 202, 186, 14, '#54341c');
      R(470, 226, 16, 12, '#f2ead8'); R(492, 226, 16, 12, '#f2ead8'); R(530, 230, 16, 12, '#a02840');
      A.person({ x: 515, y: 208, scale: 0.95, hair: 'short', hairC: '#222', skin: K.skin2, top: '#1a1a2a', tie: '#c22', hat: 1, hatC: '#2a4a2a' });
      F.text(cx, 'BLACKJACK', 468, 186, 1, '#7dffb0');
      // cash cage
      R(8, 120, 84, 160, '#4a3a1a'); R(16, 130, 68, 90, '#2a200e');
      for (let i = 0; i < 6; i++) R(18 + i * 11, 130, 3, 90, '#8a6a2a');
      F.text(cx, 'CAGE', 36, 110, 1, '#e0c068');
      // waitress on patrol
      const wx = 320 + Math.sin(t / 2600) * 130;
      A.person({ x: wx, y: 340, scale: 1.05, pose: 'walk', frame: Math.floor(t / 260), flip: Math.cos(t / 2600) < 0, hair: 'long', hairC: '#3a2a1a', skin: K.skin, top: '#c22', bottom: '#901a1a', dress: 1, lipstick: 1 });
      R(wx - 14, 296, 24, 4, '#c9c9c9');
      // lobby door
      F.text(cx, 'LOBBY →', 592, 296, 1, '#c9b45a');
      // a man losing quietly
      A.person({ x: 250, y: 306, scale: 0.9, hair: 'bald', hairC: '#555', skin: '#d8a07a', top: '#3a3a4a' });
    },
    hot() {
      return [
        { name: 'slot machines', syn: ['slots', 'slot', 'machine', 'machines'], x: 100, y: 145, w: 322, h: 150, wx: 200, wy: 322, use: () => MG.slots(), play: () => MG.slots(), autoUse: true, look: "Three slot machines: CHERRY FURY, THREE RIVERS RICHES, and one just labeled 'THE PROBLEM'. They sing. Oh, how they sing." },
        { name: 'blackjack table', syn: ['blackjack', 'cards', 'table', 'dealer'], x: 422, y: 180, w: 190, h: 100, wx: 500, wy: 322, use: () => MG.blackjack(), play: () => MG.blackjack(), autoUse: true, talk: () => E.speak('THE DEALER', "*shuffles a bridge of cards without looking* Table's open, friend. The cards don't care about your night. That's their gift."), look: "The blackjack table. The dealer's name tag says 'LUCKY'. His eyes say he is the only lucky thing at this table." },
        { name: 'cocktail waitress', syn: ['waitress', 'server', 'lady with tray'], x: 190, y: 280, w: 260, h: 64, wx: 320, wy: 344, talk: talkWaitress, look: "A cocktail waitress orbiting the floor with a tray of 'complimentary' drinks and a doctorate in human nature.", items: { rose: "'Aw. Sweet. I've got a vase at home full of these from gamblers on heaters. It's a big vase.'" } },
        { name: 'cash cage', syn: ['cage', 'cashier', 'cash'], x: 4, y: 106, w: 92, h: 176, wx: 80, wy: 320, look: "The cash cage: where chips become money, dreams become receipts, and the teller has heard EVERY plan.", use: "The teller looks up. 'Chips or cash?' You have neither in interesting quantities. You compliment the bars. She's heard that too." },
        { name: 'sad gambler', syn: ['gambler', 'man', 'loser'], x: 226, y: 250, w: 50, h: 60, wx: 250, wy: 330, talk: () => E.speak('THE GAMBLER', "*staring at nothing* I had a SYSTEM. The system was 'keep going'. *a slot machine jingles mockingly* …It needs work."), look: "A man communing with the carpet pattern. He came in with a system. The system did not come with him." },
        { name: 'to the lobby', syn: ['lobby', 'exit', 'door', 'leave'], x: 586, y: 260, w: 54, h: 90, wx: 590, wy: 336, goto: () => E.goto('lobby', 90, 330), look: "Back to the lobby, past a sign reading 'THANKS FOR PLAYING' in a font that means it." },
      ];
    },
    cmds: [
      { re: /^count cards$/, fn: () => E.die('COUNTED OUT', "You begin counting cards. Openly. Moving your lips. Using FINGERS.", "Two gentlemen named after neck muscles materialize. There is a brief physics lesson involving your trajectory and the alley out back.", "The alley, at least, feels like home.") },
      { re: /^(gamble|bet)$/, fn: () => E.say("Pick your poison: the SLOTS or the BLACKJACK table.") },
    ],
    hint() {
      if (G.flags.phCoverPaid) return "You're on the doorman's list — no more cover. Cash out while you're smiling; the elevator's in the lobby.";
      if (G.money < 50) return "You need a bankroll ($50+ for the penthouse cover — you only pay it once). Slots are fast; blackjack pays better if you keep your head. If you go fully broke, flag down the waitress.";
      return "You're flush! The penthouse elevator is back in the lobby. (Keycard? Password? You know the drill.)";
    },
  };
  async function talkWaitress() {
    if (G.money < 5) {
      G.flags.pityCount = (G.flags.pityCount || 0) + 1;
      const lines = [
        "*assesses you in one glance* Broke. Married-and-robbed broke, if I know that haircut. Here — the house comps ten bucks to anyone who looks THAT defeated. House rules. Don't spend it on hope.",
        "*again?* Sugar, this is a rescue, not a subscription. Ten. LAST one. (It's not, but pretend.)",
        "*silently hands you $10 with the eyes of a disappointed guidance counselor*",
      ];
      await E.speak('THE WAITRESS', lines[Math.min(G.flags.pityCount - 1, lines.length - 1)]);
      E.gain(10, 'pity chip');
      return;
    }
    return E.speak('THE WAITRESS', "Drinks are 'complimentary', which means they're included in the price of everything else in your life.", "*leans in* Real talk: the slots giveth to the fresh and taketh from the greedy. Cash out while you're smiling, hon.");
  }

  /* ═════════ THE PENTHOUSE ═════════ */
  ROOMS.penthouse = {
    name: "Rivers Casino — penthouse",
    music: 'penthouse',
    desc: "The Rivers Casino rooftop: string lights, the three rivers braiding together at the Point, a yellow bridge glowing like jewelry, a party pretending not to watch itself, and — in the jacuzzi, reading an actual BOOK — Eva.",
    walk: { x0: 60, x1: 560, y0: 310, y1: 368 }, sMin: 1.0, sMax: 1.14,
    spawn: [90, 340],
    draw(t) {
      A.sky(24, 240, 21, 90, 60);
      A.skyline(244, 9);
      yellowBridge(330, 640, 222, t);
      // roof deck
      dither(0, 244, 640, 156, '#2e2a3c', '#262234', 4);
      R(0, 244, 640, 4, '#1c1926');
      // railing
      for (let x = 0; x < 640; x += 26) R(x, 218, 4, 30, '#3a3548');
      R(0, 214, 640, 6, '#4a4460');
      // string lights
      for (let x = 20; x < 640; x += 34) { const sag = Math.sin((x / 640) * Math.PI * 3) * 8; R(x, 130 + sag, 3, 3, ['#ffe9a3', '#ff8bc9', '#8fd6ff'][Math.floor(x / 34) % 3]); glow(x, 131 + sag, 10, '#ffe9a3', 0.10); }
      // jacuzzi
      R(380, 280, 180, 60, '#7a6248');
      R(390, 288, 160, 44, '#1d7a8a');
      for (let i = 0; i < 10; i++) { const bx = 396 + ((i * 37 + Math.floor(t / 90) * 7) % 148); const by = 292 + ((i * 23 + Math.floor(t / 120) * 5) % 32); R(bx, by, 4, 4, '#7fd6d0'); }
      cx.globalAlpha = 0.10; for (let i = 0; i < 3; i++) { const p = ((t / 2000 + i / 3) % 1); R(420 + i * 40 + Math.sin(p * 5) * 5, 280 - p * 50, 16 - p * 6, 10, '#cfe3ff'); } cx.globalAlpha = 1;
      // Eva in the jacuzzi (shoulders up, book in hand, unimpressed by everything except the book)
      A.person({ x: 470, y: 330, scale: 1.0, pose: 'sit', hair: 'long', hairC: '#1e1e28', skin: '#d8a888', top: '#2aa090', lipstick: 1 });
      R(486, 284, 16, 20, '#e8d8a0'); R(488, 286, 12, 16, '#c9b070');
      // champagne cart
      R(160, 270, 90, 14, '#c9c9d4'); R(168, 284, 8, 40, '#9a9aa8'); R(234, 284, 8, 40, '#9a9aa8');
      R(180, 246, 12, 26, '#1d4d2b'); R(200, 250, 10, 22, '#1d4d2b'); R(216, 254, 20, 16, '#c9c9d4');
      // telescope
      R(80, 220, 6, 50, '#3a3548'); R(64, 200, 44, 12, '#c9a34a');
      // partygoers (background silhouettes)
      A.person({ x: 300, y: 300, scale: 0.85, hair: 'pomp', hairC: '#222', skin: K.skin3, top: '#3a3a55', bottom: '#2a2a3a' });
      A.person({ x: 335, y: 296, scale: 0.85, hair: 'long', hairC: '#803', skin: K.skin, top: '#7a2a5a', dress: 1 });
      // elevator back
      R(0, 150, 50, 100, '#8a6a2a'); R(6, 158, 38, 92, '#3a2c10'); F.text(cx, 'ELEV', 8, 138, 1, '#e0c068');
    },
    hot() {
      return [
        { name: 'Eva', syn: ['eva', 'woman', 'girl', 'reader', 'jacuzzi woman'], x: 430, y: 260, w: 90, h: 70, wx: 400, wy: 340, talk: talkEva, look: "Eva. She's at the most exclusive party in Pittsburgh… reading a novel in the jacuzzi. She has the calm of someone who has already left three better parties.", items: { apple: giveApple, wine: giveWine, rose: "She smiles: 'Roses are what this town gives you INSTEAD of honesty. Nice try though.' (Noted. NOTED.)", prot: "You reconsider mid-reach and pocket it, smoothness intact. Barely. She noticed. The BOOK noticed.", note: "'Her handwriting slants left. Runs on ambition. You dodged a yacht-sized bullet.' She hands it back.", spray: () => sprayBreath() } },
        { name: 'jacuzzi', syn: ['jacuzzi', 'hot tub', 'tub', 'water'], x: 380, y: 276, w: 180, h: 66, wx: 360, wy: 344, look: "The jacuzzi burbles at a temperature scientifically tuned for confessions.", use: () => E.say(G.flags.evaDone ? "Soon. Sunrise first." : "You test the water with one finger, going for 'casual'. Eva, not looking up: 'The suit stays ON, polyester.' Fair.") },
        { name: 'champagne cart', syn: ['champagne', 'cart', 'bottles'], x: 156, y: 240, w: 100, h: 84, wx: 200, wy: 330, look: "A champagne cart. The bottles cost more than your rent and taste like celebrating anyway.", use: "The attendant materializes: 'Bottle service is for BOOTH guests.' There are no booths. It's a ROOF. Power move respected.", take: "Bottle service has security. His name is also Bruno. Different Bruno. Same neck." },
        { name: 'telescope', syn: ['telescope', 'scope'], x: 60, y: 196, w: 52, h: 76, wx: 100, wy: 330, use: useTelescope, look: "A coin-op telescope aimed at the city. 25¢ for perspective — the cheapest thing in this whole town." },
        { name: 'the railing', syn: ['railing', 'edge', 'ledge', 'rivers', 'point', 'bridge'], x: 0, y: 210, w: 640, h: 38, remote: true, look: "The railing between you and forty stories of consequences. Below, the Allegheny and the Mon shake hands and become the Ohio, and a yellow bridge glows like somebody spilled the good jewelry.", climb: () => railDeath(), use: () => E.say("You lean on the railing, gazing at the Point like an album cover. Hold the pose… nailed it.") },
        { name: 'partygoers', syn: ['party', 'people', 'guests', 'crowd'], x: 280, y: 260, w: 80, h: 60, wx: 320, wy: 336, talk: () => E.speak('A PARTYGOER', "*not looking at you* We're discussing yields. Do you have opinions on yields?", "*you do not* …Fascinating. *turns away at the speed of money*"), look: "Beautiful people discussing interest rates beautifully." },
        { name: 'elevator down', syn: ['elevator', 'elev', 'down', 'exit', 'leave'], x: 0, y: 140, w: 54, h: 116, wx: 70, wy: 336, goto: () => { SFX.ding(); E.goto('lobby', 525, 336); }, look: "The elevator back to the mortal realm." },
      ];
    },
    cmds: [
      { re: /^(climb|jump)( over| off)?( the)? (railing|edge|roof)$/, fn: () => railDeath() },
      { re: /^spray breath( spray)?$/, fn: () => E.has('spray') ? sprayBreath() : E.say("You have no breath spray. The Get-N-Go does.") },
    ],
    hint() {
      if (!G.flags.minty) return E.has('spray') ? "Before you talk to anyone up here — ESPECIALLY her — deploy the breath spray. Trust the hint. USE SPRAY." : "Your breath arrived up here a full minute before you did. The Get-N-Go sells ARCTIC BLAST ($3) — and relax, the doorman remembers you now. Taxi's downstairs.";
      const t3 = G.got.eva_talk3;
      if (!t3) return "TALK to Eva. Be honest. Be funny. Every sleazy line you've practiced tonight? Bury it.";
      if (!G.got.eva_apple) return E.has('apple') ? "Eva, 4 AM, health nut, surrounded by champagne and canapés. Somewhere in your pocket is the one thing she actually wants. (It's the APPLE.)" : "She wants something REAL. Real food. The Get-N-Go's FRESH-ISH basket holds exactly one honest apple ($1) — and you're on the doorman's list, so the roof will wait.";
      if (!G.got.eva_wine) return E.has('wine') ? "You've still got that wine. Two glasses, one skyline. GIVE WINE TO EVA." : "Real drink, she said. Château Persuasion, $10 at the Get-N-Go — beats every $400 bottle on this roof. The elevator remembers you.";
      return "Talk to Eva one more time. The sun's almost up.";
    },
  };
  async function useTelescope() {
    E.award('egg_scope', 'perspective');
    return E.say("You feed it a quarter. The city swings into focus: the disco's glow, Nadine's flickering apostrophe, the chapel's neon heart, and the Incline crawling up Mount Washington like a very determined firefly.",
      "You can see EVERYWHERE you embarrassed yourself tonight. All at once. It's almost beautiful. The telescope clicks off exactly at the moment of insight, as designed.");
  }
  async function railDeath() {
    if (G.room !== 'penthouse') return E.say("Nothing to climb here but social ladders.");
    await E.die('GRAVITY: STILL UNDEFEATED',
      "You swing a leg over the railing for a 'cool photo angle'. Your platform shoe — traction rating: ballroom — disagrees with the decision.",
      "The good news: for six full seconds, you are the most interesting man at the party.",
      "The bad news is the ground.");
  }
  async function talkEva() {
    if (G.flags.finaleDone) return E.speak('EVA', "*sun on her face, your jacket somehow around her shoulders* Best sunrise this roof has ever produced. Breakfast's on me, polyester — I know a diner in the Strip where the pancakes hang off the plate. Yes, off ALL sides.");
    if (G.flags.evaDone) return finale();
    if (!G.flags.minty) {
      await E.speak('EVA', "*you open your mouth; she holds up one finger without looking up from her book*",
        "Whatever that sentence was going to be… it arrived before you did. By a lot. *she produces, from NOWHERE, a tiny judgmental fan*");
      return E.think("Right. The whiskey. The dumpster. The ENTIRE EVENING. I need that breath spray, immediately and heroically.");
    }
    if (!G.flags.metEva) {
      G.flags.metEva = true;
      await E.speak('EVA', "*closes the book on one finger* Minty. Bold choice for this roof — most guys up here smell like Sinistro cigars and portfolio anxiety.",
        "I'm Eva. I'm hiding from that party at the party. You have the look of a man having either the best or worst night of his life.");
      await E.speak('BRENDON', "…Both? Genuinely both.");
      await E.speak('EVA', "*the smallest smile* Okay, 'both'. You may perch.");
    }
    // three rounds of actual conversation
    if (!G.got.eva_talk1) {
      const c = await E.choose("EVA: 'So how does a leisure suit end up at THIS party?'", [
        "'A rumor, a dumpster dive, and a password involving lunch meat. In that order.'",
        "'I'm Chad Thunder. You may have heard of me.'",
        "'Heaven called. They're missing a Brendon.'"]);
      if (c === 0) { E.award('eva_talk1', 'honesty!'); return E.speak('EVA', "*laughs — a real one, it startles both of you* BOLOGNA PONY. You said it to his FACE? With CONFIDENCE? Okay, polyester. Continue existing near me."); }
      if (c === 1) { await E.speak('EVA', "I've MET Chad Thunder. He cried into my nachos over a jet ski. Try again — the true stuff. It's more your size."); return; }
      SFX.splashBig();
      await E.speak('EVA', "*without breaking eye contact, flicks exactly one tablespoon of jacuzzi water onto your lapel* That line has been to more parties than you have. What ELSE you got?");
      return;
    }
    if (!G.got.eva_talk2) {
      const c = await E.choose("EVA: 'Real question. Why are you actually out tonight?'", [
        "'Networking, mostly. I have cards.'",
        "'Honestly? Tired of laughing at my own jokes alone. Wanted someone to trade.'",
        "'My horoscope said tonight was non-refundable.'"]);
      if (c === 1) { E.award('eva_talk2', 'the real answer'); return E.speak('EVA', "*sets the book fully down — a first* …That's the correct answer, and nobody ever says it. This town is ten thousand people avoiding exactly that sentence."); }
      if (c === 2) { await E.speak('EVA', "*snorts* Cute. And a DODGE. Real answer. I've got all night; the book's mid."); return; }
      await E.speak('EVA', "*silently holds up a business card of her own, then drops it in the water* Whoops. Try again, HUMAN answer this time.");
      return;
    }
    if (!G.got.eva_talk3) {
      const opts = [
        G.flags.wedded ? "'Tonight I got married, robbed, and untied by a housekeeper named Marge — and I STILL believe in this town.'" : "'Tonight I traded a sink ring to an influencer for a rose and I regret NOTHING.'",
        "'My chain? Real gold. Probably. It's real SOMETHING.'",
        "'I know every cab driver in this city by name now. That's basically a network.'"];
      const c = await E.choose("EVA: 'Last one. Tell me something TRUE.'", opts);
      if (c === 0) {
        E.award('eva_talk3', 'the whole truth');
        await E.speak('EVA', G.flags.wedded ? "*HOWLS* Married AND robbed?! And you took the elevator UP instead of home?! You absurd, indestructible man." : "*cackles* A SINK RING. This town deserves you and doesn't know it.",
          "Okay. You're real. Horrifyingly, delightfully real.");
        if (!G.got.eva_apple || !G.got.eva_wine) await E.speak('EVA', "*stretches* Ugh, I'd trade this whole catered roof for something SIMPLE right now. Real food. Real drink. Real anything.");
        return maybeFinale();
      }
      if (c === 1) { await E.speak('EVA', "The chain is fifty percent real and one hundred percent not the point. TRUE thing. Go."); return; }
      await E.speak('EVA', "That's adorable and I'm keeping it, but I said TRUE, not TRIVIA."); return;
    }
    return maybeFinale();
  }
  async function giveApple() {
    if (!G.flags.metEva) return E.say("Approach her first, produce sudden fruit second. Order of operations, Brendon.");
    E.removeItem('apple'); E.award('eva_apple', 'the apple');
    await E.speak('EVA', "*stares at the apple, then at you* It's 4 AM on a roof full of caviar and NONSENSE… and you brought an APPLE.",
      "*takes a bite; it crunches like an argument being won* This is the best thing that has happened at this party in the history of this party.");
    return maybeFinale();
  }
  async function giveWine() {
    if (!G.flags.metEva) return E.say("Wine before 'hello'? Even you know better. Talk to her first.");
    E.removeItem('wine'); E.award('eva_wine', 'the wine');
    await E.speak('EVA', "*reads the label* Château Persuasion. From the GET-N-GO. *she's already holding out two glasses from somewhere*",
      "Everything up here costs four hundred dollars and tastes like showing off. THIS tastes like a Tuesday with a good person. Pour, polyester.");
    return maybeFinale();
  }
  async function maybeFinale() {
    if (G.got.eva_talk3 && G.got.eva_apple && G.got.eva_wine && !G.flags.evaDone) {
      G.flags.evaDone = true;
      await E.speak('EVA', "*looks east, where the sky is going soft* Sunrise in a few minutes. Best view in the city, and everyone at this party is facing the BAR.",
        "Watch it with me? No lines, no moves. Just… the good part.");
      const c = await E.choose('Well?', ["'I'd love nothing more.' (take her hand)", "'One sec, I want to check the buffet—'"]);
      if (c === 1) { G.flags.evaDone = false; return E.speak('EVA', "*re-opens her book to the exact page* Incredible. INCREDIBLE. The buffet, ladies and gentlemen. …Ask me again when you mean it."); }
      return finale();
    }
  }
  async function finale() {
    G.cut = true; MUS.set('finale');
    E.goto('finale', 320, 350, { noSnap: true, noSave: true });
  }

  /* ═════════ FINALE ═════════ */
  ROOMS.finale = {
    name: 'sunrise',
    music: 'finale',
    hidePlayer: true,
    walk: { x0: 0, x1: 640, y0: 350, y1: 360 },
    draw(t) {
      const p = Math.min(1, (t - (this._t0 || (this._t0 = t))) / 14000);
      // sunrise gradient
      bands(0, 24, 640, 246, p < 0.5 ? ['#0b081d', '#1a1030', '#3a1a40', '#7a2a3a'] : ['#20164a', '#5a2a5a', '#c05a4a', '#f0a04a']);
      const sunY = 250 - p * 60;
      R(300, sunY, 40, 40, '#ffd977'); R(292, sunY + 8, 56, 24, '#ffd977'); glow(320, sunY + 20, 90, '#ffb347', 0.30);
      A.skyline(270, 9);
      yellowBridge(280, 640, 248, t);
      dither(0, 270, 640, 130, '#2e2a3c', '#262234', 4);
      for (let x = 0; x < 640; x += 26) R(x, 244, 4, 30, '#1c1926');
      R(0, 240, 640, 6, '#2a2438');
      // the couple, silhouetted at the rail
      A.brendon(300, 320, { scale: 1.1, flip: false });
      A.person({ x: 336, y: 320, scale: 1.06, hair: 'long', hairC: '#1e1e28', skin: '#d8a888', top: '#2aa090', dress: 1, lipstick: 1, flip: 1 });
      // fireworks!
      const r = A.rng(Math.floor(t / 800));
      for (let f = 0; f < 3; f++) {
        const fx = 80 + r() * 480, fy = 60 + r() * 100, ph = (t / 800) % 1;
        for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; R(fx + Math.cos(a) * ph * 40, fy + Math.sin(a) * ph * 30, 3, 3, ['#ff5df1', '#41f0e0', '#f5c542', '#7dffb0'][f % 4]); }
      }
      // hearts
      for (let i = 0; i < 4; i++) { const hp = ((t / 3000 + i / 4) % 1); F.text(cx, '♥', 300 + Math.sin(hp * 8 + i) * 30 + i * 12, 300 - hp * 120, 1 + i % 2, '#ff8bc9'); }
    },
    hot: () => [],
    async enter() {
      G.cut = true; G.flags.finaleDone = true;
      E.clock(90); G.time = (24 + 4) * 60 + 58;
      await E.sayRaw([
        { t: "They stand at the railing as the sky goes from bruise to gold. Below, Pittsburgh finally shuts up.", who: 'THE NARRATOR' },
        { t: "You know what's funny? I came up here to avoid every guy like you. White suit. Gold chain. WALKING cologne ad.", who: 'EVA' },
        { t: "And I came up here because an influencer taught me to say 'bologna pony' to a man the size of a garage.", who: 'BRENDON' },
        { t: "*laughing* This town. …Hey. Brendon. Look at me for a second.", who: 'EVA' },
        { t: "The sun crests the skyline. Somewhere below, a slot machine pays out for nobody. Eva takes Brendon's lapel — the good one — and pulls him in.", who: 'THE NARRATOR' },
        { t: "💥 The management respectfully directs your attention to these FIREWORKS. 💥", who: 'THE NARRATOR' },
        { t: "Some things, even in Pittsburgh, are private.", who: 'THE NARRATOR' },
      ]);
      E.award('finale', 'true love (or excellent chemistry)');
      G.cut = false;
      UI.credits();
    },
    hint() { return "Enjoy it, champ. You earned it."; },
  };
})();
