/* ── the wider town: taxi, Get-N-Go, Disco Inferno, chapel, honeymoon suite ── */
const TAXI = (() => {
  const BANTER = [
    "Yinz goin' aht or comin' back? Trick question. In this cab, everybody's comin' back.",
    "Took the Fort Pitt Tunnel today. Guy ahead of me brakes for NO REASON. Forty years, pal. No reason. Ever.",
    "I once ate a sandwich with the fries and the slaw ALREADY INSIDE it. Changed my whole life. Changed my SON'S life.",
    "See that bridge? Yellow. That one? Also yellow. We had a system and we COMMITTED, buddy.",
    "This town'll eat you alive, pal. But like, romantically.",
    "I'm writing a screenplay. It's about a cab driver who writes screenplays. It's layered, like the cookie table at a weddin'.",
    "Buckle up. Not the law here, just my personal brand. Stillers won, so I'm drivin' emotional tonight.",
  ];
  let banterN = 0;
  const DESTS = () => [
    { id: 'street', label: "Nadine's Bar — E. Carson St." },
    { id: 'store', label: 'Get-N-Go 24hr Mart' },
    { id: 'disco', label: 'Disco Inferno' },
    { id: 'lobby', label: 'Rivers Casino' },
    ...(G.flags.engaged && !G.flags.wedded ? [{ id: 'chapel', label: '⚡ The Quickie Chapel (Dawn is waiting!)' }] : []),
  ];
  function open() {
    const dests = DESTS().filter(d => d.id !== G.room && !(d.id === 'street' && G.room === 'street'));
    const p = E.panel(`
      <h3>🚕 Vinnie's Cab Co. — "We Get Yinz There, Eventually"</h3>
      <div class="note" id="cabsay">"${BANTER[banterN++ % BANTER.length]}"</div>
      <div class="note" style="margin:6px 0 10px">Fare: <b style="color:var(--gold)">$5</b> anywhere. ${G.money < 5 ? "You're broke — Vinnie says this one's on the marketing budget." : ''}</div>
      <div id="cabdests"></div>
      <button class="pbtn" id="cabtip">Tip the driver ($2)</button>
      <button class="pbtn" id="cabno">Never mind</button>
    `);
    const dd = p.querySelector('#cabdests');
    dests.forEach(d => {
      const b = document.createElement('button');
      b.className = 'pbtn'; b.style.display = 'block'; b.style.width = '100%'; b.style.margin = '0 0 6px';
      b.textContent = '→ ' + d.label;
      b.addEventListener('click', async () => {
        E.closePanel(true);
        if (G.money >= 5) E.pay(5, 'cab fare');
        SFX.car(); E.clock(9);
        const spots = { street: [200, 330], store: [90, 330], disco: [560, 336], lobby: [320, 340], chapel: [320, 336] };
        E.goto(d.id, ...(spots[d.id] || []));
      });
      dd.appendChild(b);
    });
    p.querySelector('#cabtip').addEventListener('click', () => {
      if (!E.pay(2, 'tip')) return;
      E.award('egg_tip', 'a gentleman tips');
      p.querySelector('#cabsay').textContent = '"A TIPPER! You hear that, city?! Kindness ain\'t dead, it\'s just BUDGETED!"';
    });
    p.querySelector('#cabno').addEventListener('click', () => E.closePanel(true));
  }
  return { open };
})();

(() => {
  const { K, R, dither, bands, glow } = A;

  /* ═════════ GET-N-GO ═════════ */
  ROOMS.store = {
    name: "Get-N-Go 24hr",
    music: 'lounge',
    desc: "The Get-N-Go: fluorescent lighting with a personal grudge, four aisles of commerce, a cooler older than you, and a clerk paid almost enough to care.",
    walk: { x0: 40, x1: 600, y0: 302, y1: 368 }, sMin: 1.0, sMax: 1.18,
    spawn: [90, 330],
    draw(t) {
      bands(0, 24, 640, 240, ['#2a3440', '#2f3a48', '#28323e']);
      dither(0, 264, 640, 136, '#9aa4ac', '#87919a', 8);
      // ceiling fluorescents
      for (const fx of [140, 360, 540]) { R(fx, 34, 90, 8, Math.sin(t / 137 + fx) > -0.97 ? '#e8fbff' : '#7a8a92'); glow(fx + 45, 40, 60, '#bfefff', 0.07); }
      // cooler back wall
      R(390, 90, 230, 150, '#1c2a36');
      for (let i = 0; i < 3; i++) { R(398 + i * 74, 98, 66, 134, '#0f2b3d'); R(400 + i * 74, 100, 62, 130, '#12384d'); glow(430 + i * 74, 160, 44, '#8fd6ff', 0.10); for (let s = 0; s < 4; s++) { R(404 + i * 74, 110 + s * 30, 54, 3, '#2a5a74'); for (let b = 0; b < 4; b++) R(406 + i * 74 + b * 13, 96 + s * 30 + 18, 9, 12, ['#c33', '#3c6', '#fa3', '#38c'][(b + s + i) % 4]); } }
      F.text(cx, 'KOLD KUZZINS', 442, 76, 1, '#8fd6ff');
      // shelves
      for (const [sx, sy] of [[60, 150], [60, 210], [230, 150], [230, 210]]) {
        R(sx, sy + 34, 140, 10, '#7a6248'); R(sx + 4, sy + 44, 8, 30, '#5a4632'); R(sx + 128, sy + 44, 8, 30, '#5a4632');
        for (let i = 0; i < 7; i++) R(sx + 8 + i * 18, sy + 10, 12, 24, ['#c93', '#3a7', '#a3c', '#c55', '#39c', '#e8a33d', '#7a3'][i]);
      }
      F.text(cx, 'SALE', 100, 132, 2, '#ff8b96');
      // magazine rack
      R(500, 250, 90, 60, '#7a6248');
      for (let i = 0; i < 3; i++) { R(506 + i * 28, 256, 22, 30, '#f7f3e6'); R(508 + i * 28, 258, 18, 8, ['#c33', '#39c', '#a3c'][i]); }
      // produce basket
      R(420, 280, 70, 26, '#8a6a3a'); for (let i = 0; i < 6; i++) R(426 + (i % 3) * 20, 278 - Math.floor(i / 3) * 8, 12, 10, i % 2 ? '#c22' : '#d43');
      F.text(cx, 'FRESH-ISH', 424, 262, 1, '#9fe3af');
      // counter + clerk + intercom
      R(40, 220, 150, 16, '#6a5a7a'); R(46, 236, 138, 60, '#584a66');
      R(60, 196, 20, 24, '#333'); R(64, 200, 12, 12, '#7dffb0'); // register
      R(130, 200, 14, 18, '#444'); R(134, 194, 6, 8, '#666');   // intercom mic
      A.person({ x: 100, y: 288, scale: 1.0, hair: 'short', hairC: '#c9974a', skin: '#e8c098', top: '#3a6a4a', apron: 1 });
      F.text(cx, 'RANDY', 82, 246, 1, '#e8e2d0');
      // door
      A.doorway(0, 190, 34, 100, '#26303a', '#3a4a58', '#ffe9a3');
    },
    hot() {
      const shelfBuy = (id, price, scoreId, flavor) => async () => {
        if (E.has(id)) return E.say("You've already got one. Hoarding is not a good look in a leisure suit.");
        if (!E.pay(price, ITEMS[id].name)) return E.speak('RANDY THE CLERK', "Register says no. Registers don't lie, man. People lie. Registers just BEEP.");
        E.addItem(id); E.award(scoreId);
        SFX.cash();
        return E.say(flavor);
      };
      return [
        { name: 'Randy the clerk', syn: ['clerk', 'randy', 'cashier'], x: 70, y: 220, w: 70, h: 70, wx: 130, wy: 320, talk: talkClerk, look: "Randy: nineteen, sedated by fluorescent light, wearing the apron of a man who has stopped asking questions.", buy: talkClerk, items: { card: "'We don't take Disco Platinum, man. We barely take cash.'" } },
        { name: 'breath spray', syn: ['spray', 'breath spray', 'mints'], x: 60, y: 150, w: 140, h: 44, wx: 130, wy: 322, buy: shelfBuy('spray', 3, 'buy_spray', "One 'ARCTIC BLAST' breath spray. The pharmacist's shelf tag says 'GOOD LUCK OUT THERE'."), use: shelfBuy('spray', 3, 'buy_spray', "One 'ARCTIC BLAST' breath spray. The shelf tag says 'GOOD LUCK OUT THERE'."), take: shelfBuy('spray', 3, 'buy_spray', "Breath spray acquired, and PAID FOR, because you are a gentleman."), look: "Hygiene aisle: breath spray ($3), 'HUNK' brand pomade, and a loofah with a customer loyalty card." },
        { name: 'wine shelf', syn: ['wine', 'bottle', 'booze'], x: 230, y: 150, w: 140, h: 44, wx: 300, wy: 322, buy: shelfBuy('wine', 10, 'buy_wine', "Château Persuasion, $10. The shelf's OTHER wine is just labeled 'WINE?' — you chose wisely."), use: shelfBuy('wine', 10, 'buy_wine', "Château Persuasion, acquired."), take: shelfBuy('wine', 10, 'buy_wine', "Château Persuasion, acquired — legally, even."), look: "The wine section: Château Persuasion ($10), and a jug labeled 'WINE?' ($1.50, includes incident report form)." },
        { name: 'magazine rack', syn: ['magazine', 'magazines', 'rack', 'gossip'], x: 496, y: 246, w: 98, h: 68, wx: 520, wy: 330, buy: shelfBuy('mag', 2, 'buy_mag', "One 'STEEL CITY CONFIDENTIAL'. The cover promises 'CELEBRITY SECRETS THAT WILL RUIN BRUNCH'."), use: shelfBuy('mag', 2, 'buy_mag', "Gossip acquired."), take: shelfBuy('mag', 2, 'buy_mag', "Gossip acquired, $2."), look: "Magazines: 'STEEL CITY CONFIDENTIAL' ($2), 'PRACTICAL MUSTACHE' and 'CROSSWORDS FOR THE ANGRY'." },
        { name: 'produce basket', syn: ['apple', 'produce', 'fruit', 'basket'], x: 414, y: 258, w: 84, h: 52, wx: 450, wy: 330, buy: shelfBuy('apple', 1, 'buy_apple', "One apple, $1. Randy: 'That's the only one that's real, man. The rest are display.' You don't ask."), use: shelfBuy('apple', 1, 'buy_apple', "One real apple, $1."), take: shelfBuy('apple', 1, 'buy_apple', "One real apple, $1. Paid. You're growing."), look: "A basket labeled FRESH-ISH. One apple gleams with genuine fruit energy. The rest are… aspirational." },
        { name: 'coolers', syn: ['cooler', 'coolers', 'fridge', 'soda'], x: 390, y: 90, w: 230, h: 150, wx: 480, wy: 316, look: "The KOLD KUZZINS coolers hum a two-note song they've hummed since 1979. Soda, soda, mystery soda.", use: "You open a cooler, bask in the chill like a commercial, and close it. Randy nods. He gets it." },
        { name: 'register', syn: ['register', 'till'], x: 56, y: 192, w: 30, h: 30, wx: 130, wy: 320, look: "The register displays $0.00 and, somehow, contempt.", use: "Randy slides between you and the register with surprising speed. 'Cool. Anyway.'", take: () => E.say("Randy raises one eyebrow. The eyebrow has seen shoplifters die of embarrassment.") },
        { name: 'door out', syn: ['door', 'exit', 'leave', 'street', 'taxi', 'cab', 'out'], x: 0, y: 180, w: 40, h: 112, wx: 50, wy: 330, goto: () => TAXI.open(), look: "The door. Beyond it: the night, and Vinnie's cab idling like a getaway car." },
      ];
    },
    cmds: [
      { re: /^buy protection$/, fn: () => buyProtection() },
    ],
    hint() {
      const need = [];
      if (!E.has('spray') && !G.flags.minty) need.push('breath spray');
      if (!E.has('wine') && !G.got.eva_wine) need.push('wine');
      if (!E.has('mag') && !G.flags.graceBusy) need.push('the gossip magazine');
      if (!E.has('apple') && !G.got.eva_apple) need.push('an apple');
      if (need.length) return `Shopping list for a night of destiny: ${need.join(', ')}. And ask Randy about the… discreet items. Ahem.`;
      return "You're stocked. The disco (rose + card) or the casino await. Taxi's outside.";
    },
  };
  async function talkClerk() {
    if (!G.flags.metRandy) {
      G.flags.metRandy = true;
      await E.speak('RANDY THE CLERK', "Welcome to Get-N-Go, home of the— man, I'm not saying the whole thing. Shelves got prices. Yell if the cooler bites.");
    }
    const opts = ["'What should a gentleman buy for a big night?'", "'I need something… discreet.' ($5)", "'What's good here?'", "Nothing, thanks."];
    const c = await E.choose('Say to Randy:', opts);
    if (c === 0) return E.speak('RANDY', "Big night protocol: breath spray, decent wine, reading material for the waiting-around parts, and fruit. Nobody expects fruit. Fruit says 'I have LAYERS'.");
    if (c === 1) return buyProtection();
    if (c === 2) return E.speak('RANDY', "The apple's real. The magazine's fresh. The 'WINE?' is neither. That's the whole menu, man.");
    return E.speak('RANDY', "Cool cool cool. I'll be here til the heat death of the universe or 6 AM, whichever.");
  }
  async function buyProtection() {
    if (G.room !== 'store') return E.say("Not the venue for that purchase.");
    if (E.has('prot')) return E.speak('RANDY', "Dude, you're covered. Literally. Metaphorically. It's a whole thing.");
    if (!E.pay(5, "'protection'")) return E.speak('RANDY', "It's $5, man. Optimism ain't free.");
    await E.say("You lean in and murmur your request with the subtlety of a diplomat.");
    await E.speak('RANDY', "*nods sagely… then picks up the intercom microphone*");
    SFX.intercom();
    await E.sayRaw([{ t: '"PRICE CHECK, REGISTER ONE: \'OPTIMIST\' BRAND PERSONAL PROTECTION, SINGLE — that\'s S-I-N-G-L-E — UNIT. FOR THE GENTLEMAN IN THE WHITE LEISURE SUIT. THE POLYESTER ONE. WITH THE CHAIN."', who: 'INTERCOM, AT FULL VOLUME' }]);
    await E.say("Time stops. A grandmother in aisle two mouths 'good luck'. Somewhere, a slushie machine chooses this moment to applaud.",
      "Randy slides the discreet foil square across the counter inside a paper bag, inside another paper bag, wearing sunglasses.");
    E.addItem('prot'); E.award('buy_prot', 'survived the intercom');
    await E.think("Worth it. Probably. Statistically… no, worth it.");
  }

  /* ═════════ DISCO INFERNO ═════════ */
  ROOMS.disco = {
    name: "Disco Inferno",
    music: 'disco',
    desc: "Disco Inferno: a mirror ball the size of a planet, a floor that flashes in colors science hasn't named, and — at a corner table — a vision in sequins named Dawn.",
    walk: { x0: 60, x1: 600, y0: 306, y1: 370 }, sMin: 0.98, sMax: 1.18,
    spawn: [560, 336],
    enter() {
      this.walk.x0 = G.flags.discoIn ? 60 : 470;
      if (!G.flags.discoIn && !G.flags.bouncerMet) { G.flags.bouncerMet = true; talkBouncer(); }
    },
    draw(t) {
      bands(0, 24, 640, 260, ['#160b26', '#1d0f33', '#150a24']);
      dither(0, 284, 640, 116, '#191322', '#131020', 4);   // full floor base (sprites walk right of the tiles)
      // dance floor: color-cycling tiles
      for (let ty = 0; ty < 3; ty++) for (let txx = 0; txx < 10; txx++) {
        const ph = (Math.floor(t / 260) + txx + ty * 3) % 4;
        R(80 + txx * 42, 284 + ty * 34, 40, 32, ['#3d1140', '#10304a', '#4a3010', '#123a20'][ph]);
        R(82 + txx * 42, 286 + ty * 34, 36, 28, ['#ff5df1', '#41f0e0', '#f5c542', '#7dffb0'][ph] + '33');
      }
      R(60, 380, 560, 20, '#0e0618');
      // mirror ball
      R(318, 24, 4, 26, '#888');
      const mb = 320, my = 66;
      R(mb - 18, my - 18, 36, 36, '#9aa4b8');
      for (let i = 0; i < 6; i++) { const a = t / 800 + i; R(mb - 18 + ((i * 13 + Math.floor(t / 100)) % 32), my - 14 + (i * 7) % 28, 5, 5, '#e8f4ff'); }
      for (let i = 0; i < 5; i++) { const a = (t / 1400 + i / 5) * Math.PI * 2; glow(mb + Math.cos(a) * 130, my + 90 + Math.sin(a) * 40, 26, ['#ff5df1', '#41f0e0', '#f5c542', '#7dffb0', '#ff8b96'][i], 0.10); }
      glow(mb, my, 60, '#cfe3ff', 0.14);
      // DJ booth
      R(70, 170, 120, 70, '#2a1445'); R(78, 150, 104, 24, '#3d1f63');
      A.person({ x: 130, y: 208, scale: 0.9, hair: 'wave', hairC: '#222', skin: K.skin3, top: '#f5c542', shades: 1 });
      R(84, 226, 40, 8, '#111'); R(136, 226, 40, 8, '#111');
      F.neon(cx, 'DJ TANGO', 130, 130, 1, '#41f0e0', t);
      // speakers
      for (const sx of [40, 560]) { R(sx, 190, 44, 100, '#191322'); R(sx + 8, 200, 28, 28, '#0a0710'); R(sx + 8, 240, 28, 28, '#0a0710'); const th = Math.abs(Math.sin(t / 130)) * 4; R(sx + 16 - th / 2, 208 - th / 2, 12 + th, 12 + th, '#3d2f55'); R(sx + 16 - th / 2, 248 - th / 2, 12 + th, 12 + th, '#3d2f55'); }
      // neon zigzags
      F.neon(cx, 'DISCO INFERNO', 320, 96, 3, '#ff5df1', t, 1);
      // bar at right rear
      R(430, 200, 180, 12, '#6e4a24'); R(430, 212, 180, 40, '#54341c');
      for (let i = 0; i < 4; i++) R(444 + i * 40, 178, 10, 20, ['#2d5', '#a33', '#37c', '#c93'][i]);
      // Dawn's corner table
      if (!G.flags.wedded) {
        R(200, 250, 60, 10, '#8a2be2'); R(224, 260, 12, 40, '#5a1f96');
        R(214, 236, 12, 14, '#c9e'); // cocktail
        A.person({ x: 180, y: 300, scale: 1.05, pose: 'sit', hair: 'long', hairC: '#f0d060', skin: '#f0c8a0', top: '#f5c542', bottom: '#e0b030', dress: 1, lipstick: 1 });
        if (Math.floor(t / 900) % 3 === 0) F.text(cx, '$', 208, 226, 2, '#f5c542');
      }
      // dancers
      const dframe = Math.floor(t / 240);
      A.person({ x: 360, y: 330, scale: 1.05, hair: 'wave', hairC: '#222', skin: K.skin3, top: '#c22', bottom: '#fff', armsUp: dframe % 2 === 0, frame: dframe });
      A.person({ x: 430, y: 322, scale: 1.0, hair: 'long', hairC: '#803', skin: K.skin, top: '#41f0e0', bottom: '#2a8f86', dress: 1, armsUp: dframe % 2 === 1, frame: dframe });
      // velvet rope + bouncer at right entrance
      if (!G.flags.discoIn) {
        R(470, 280, 6, 60, '#b9a13c'); R(560, 280, 6, 60, '#b9a13c');
        R(476, 288, 84, 6, '#a02840');
        A.person({ x: 520, y: 336, scale: 1.3, hair: 'bald', hairC: '#222', skin: K.skin3, top: '#191322', bottom: '#111', shades: 1 });
      }
      F.text(cx, 'EXIT', 596, 290, 1, '#c9b45a');
    },
    hot() {
      return [
        { name: 'Bruno the bouncer', syn: ['bouncer', 'bruno', 'doorman'], when: () => !G.flags.discoIn, x: 486, y: 236, w: 70, h: 104, wx: 560, wy: 336, talk: talkBouncer, look: "Bruno. His neck has its own zip code. The sunglasses are structural.", items: { card: showCard, ring: "'Engaged? Congratulations. Still no.'", rose: "'…That's sweet. No.'" } },
        { name: 'Dawn', syn: ['dawn', 'woman', 'girl', 'blonde', 'lady'], when: () => G.flags.discoIn && !G.flags.wedded, x: 150, y: 240, w: 90, h: 66, wx: 250, wy: 322, talk: talkDawn, look: "Dawn: sequins, lashes, and eyes that light up at the sound of a wallet opening. She is checking her nails in a way that somehow checks YOUR net worth.", items: { rose: giveRoseDawn, ring: "Dawn eyes the sink ring: 'Sweetie, I've seen better settings on a FOLDING CHAIR.' (Maybe someone with lower standards would value it more. Someone with a ring light.)", wine: "'Gas-station wine? I'm a TOP-SHELF problem, honey.'", card: "'That's… Chad's card. Chad owes me a jet ski. We don't talk about Chad.'" } },
        { name: 'dance floor', syn: ['dance floor', 'floor', 'dancefloor'], when: () => G.flags.discoIn, x: 80, y: 284, w: 420, h: 100, wx: 320, wy: 340, look: "The floor pulses in four colors, each scientifically proven to lower inhibitions and raise bar tabs.", use: () => (G.flags.dawnDanceReady && !G.flags.dawnDanced) ? MG.dance() : danceSolo(), dance: () => (G.flags.dawnDanceReady && !G.flags.dawnDanced) ? MG.dance() : danceSolo() },
        { name: 'DJ Tango', syn: ['dj', 'tango'], when: () => G.flags.discoIn, x: 70, y: 140, w: 120, h: 100, wx: 140, wy: 316, talk: () => E.speak('DJ TANGO', "*lowers headphones exactly one inch* Requests cost dignity. You clearly got SOME left. Come back when you're out.", "*headphones return* …This next one's for the guy in the POLYESTER. Stay dangerous."), look: "DJ Tango has worn those sunglasses since birth. Possibly before." },
        { name: 'disco bar', syn: ['bar', 'drinks'], when: () => G.flags.discoIn, x: 430, y: 178, w: 180, h: 74, wx: 500, wy: 316, look: "The disco bar: $12 drinks with names like 'Neon Regret' and 'The Chad'.", use: () => E.say("$12 for a 'Neon Regret'? You'd rather keep the regret free and homemade, thanks."), buy: () => E.say("The drinks here are for BUYING PEOPLE, not for drinking yourself. Focus, Brendon.") },
        { name: 'mirror ball', syn: ['mirror ball', 'ball', 'disco ball'], x: 296, y: 42, w: 48, h: 48, remote: true, look: "The mirror ball scatters a thousand tiny spotlights, so everyone gets fifteen milliseconds of fame per rotation." },
        { name: 'exit', syn: ['exit', 'leave', 'out', 'taxi'], x: 580, y: 280, w: 60, h: 90, wx: 596, wy: 336, goto: () => TAXI.open(), look: "The way out, past the coat check that lost its last coat in '81." },
      ];
    },
    cmds: [
      { re: /^dance( with dawn)?$/, fn: () => G.flags.discoIn ? (G.flags.dawnDanceReady ? MG.dance() : danceSolo()) : E.say("Bruno's rope says you dance OUTSIDE tonight.") },
      { re: /^show card( to bouncer)?$/, fn: () => G.flags.discoIn ? E.say("You're in, Chad. Own it.") : showCard() },
    ],
    hint() {
      if (!G.flags.discoIn) return E.has('card') ? "SHOW the platinum CARD to Bruno. Tonight you're Chad Thunder." : "Bruno respects exactly one thing: PLATINUM. Rumor says a card got dumpstered behind Nadine's.";
      if (!G.flags.wedded) {
        if (!G.flags.dawnMet) return "The vision in gold sequins at the corner table. TALK to Dawn. Bring your wallet's A-game.";
        if (!G.flags.dawnDrink) return "Dawn is 'so thirsty'. Buy the lady a drink. ($10 — the first of many fees.)";
        if (!G.flags.dawnRose) return "A rose says 'romance'. GIVE the ROSE TO DAWN — it's what it was born for.";
        if (!G.flags.dawnDanced) return "Ask Dawn to DANCE. Warning: actual rhythm required. Some.";
        return "She's ready to be asked something BIG. Talk to Dawn… and consider your life choices at the chapel.";
      }
      return "This chapter is closed (and annulled). The Rivers Casino calls — taxi outside.";
    },
  };
  async function talkBouncer() {
    if (E.has('card')) {
      await E.speak('BRUNO', "*arms crossed, forming an eclipse* Private night. Platinum members only.", "…Unless you got something PLATINUM to show me.");
      return E.think("The dumpster card! GIVE or SHOW the CARD to Bruno.");
    }
    await E.speak('BRUNO', "*looks at you like a coupon for a store that closed* Private night, pal. PLATINUM members only.",
      "No card, no inferno. Rules is rules, and I'M the rules.");
    const c = await E.choose('Your move:', ["'Do you know who I am?'", "'What if I dance REALLY well?'", "Try the secret handshake (it's a punch)", "Back away with dignity"]);
    if (c === 0) return E.speak('BRUNO', "*long pause* …Yes. You're the guy leaving.");
    if (c === 1) return E.speak('BRUNO', "Buddy, the LAST guy who danced at me is now part of the sidewalk's texture.");
    if (c === 2) return E.die('SECRET HANDSHAKE REJECTED', "You wind up the ol' knuckle sandwich. Bruno catches your fist like a fly ball, sighs with genuine disappointment…", "…and files you, gently but decisively, into a nearby decorative hedge. The hedge had it coming, apparently. You: less so.");
    return E.speak('BRUNO', "Smart. The hedge thanks you.");
  }
  async function showCard() {
    await E.say("You produce the PLATINUM CARD with the flourish of a man revealing a royal flush.");
    await E.speak('BRUNO', "*inspects it* …Chad Thunder. Huh. You look different, Chad. Shorter. Flammable-er.",
      "*shrug like two boulders negotiating* Platinum's platinum. Welcome back, 'Chad'.");
    G.flags.discoIn = true; ROOMS.disco.walk.x0 = 60;
    E.award('bouncer_in', 'VIP treatment'); SFX.fanfare();
    await E.say("The velvet rope unclips. The bass hits your chest like a friendly defibrillator. YOU'RE IN.");
  }
  async function danceSolo() {
    return E.say("You unleash 'The Fax Machine' — a personal move involving rhythmic beeping. The crowd forms a circle, which you choose to interpret as admiration.");
  }
  async function talkDawn() {
    if (!G.flags.dawnMet) {
      G.flags.dawnMet = true; E.award('dawn_meet', 'first contact');
      await E.speak('DAWN', "*looks you over like a menu* Well HELLO, polyester. Love the chain. Is it real?",
        "*you open your mouth* Don't answer, you'll ruin it. I'm Dawn. I like long walks to expensive places.",
        "Mmm, I am SO thirsty though. This economy, you know?");
      return E.think("She's dazzling. She's also scanning my wallet like airport security. Eh — love is blind AND has a budget.");
    }
    if (!G.flags.dawnDrink) {
      const c = await E.choose('Dawn eyes her empty glass meaningfully.', ["Buy the lady a drink ($10)", "'Water is nature's champagne.'", "Compliment her instead (free)"]);
      if (c === 0) {
        if (!E.pay(10, "Dawn's 'usual'")) return E.speak('DAWN', "*pats your cheek* Come back when your wallet grows up, sweetie.");
        G.flags.dawnDrink = true; E.award('dawn_drink', 'liquid courtship'); SFX.pour();
        return E.speak('DAWN', "*the drink arrives in a glass shaped like a swan* A gentleman AND a spender! Keep this up and I might remember your name, Brandon.", "(It's Brendon, but you let it go. Love is compromise.)");
      }
      if (c === 1) return E.speak('DAWN', "*blinks slowly* And YOU are nature's 'no'.");
      return E.speak('DAWN', "Flattery's cute, sugar. Flattery with a RECEIPT is cuter.");
    }
    if (!G.flags.dawnRose) return E.speak('DAWN', "You know what this table's missing? FLORA. A girl likes to feel like a garden, you know?");
    if (!G.flags.dawnDanced) {
      if (G.flags.dawnDanceReady) {
        const c = await E.choose('Dawn is already halfway out of the booth.', ["'May I have this dance?' (dance-off!)", "'One more drink first.'"]);
        if (c === 0) return MG.dance();
        return E.speak('DAWN', "*sits back down at exactly the speed of disappointment* Liquid courage, huh. The FLOOR, polyester. The floor is where heroes are made.");
      }
      G.flags.dawnDanceReady = true;
      return E.speak('DAWN', "This song? THIS SONG. Ask me to dance, polyester. Show me what that suit's rated for. (Talk to me again, or hit the dance floor.)");
    }
    if (!G.flags.engaged) {
      const c = await E.choose("Dawn's eyes have gone soft-focus, like a perfume ad.", ["'Dawn… will you marry me? Tonight?'", "'Want to split a basket of wings?'"]);
      if (c === 1) return E.speak('DAWN', "Wings?! We are ONE dance past a PROPOSAL, and you offer POULTRY?");
      G.flags.engaged = true; E.award('propose', 'the big question');
      await E.speak('DAWN', "*a single tear, professionally deployed* YES! Yes, obviously, yes!",
        "The Quickie Chapel on Route 51 does a five-minute ceremony, the officiant is an Elvis, and the gift registry is just my checking account number. I'll meet you there — DON'T dawdle, my love. Money— MARRIAGE waits for no one!");
      return E.say("Dawn vanishes in a cloud of sequins and efficiency. The taxi outside now knows the way to the chapel.");
    }
    return E.speak('DAWN', "Chapel. Route 51. NOW, snookums. The officiant charges by the minute after midnight.");
  }
  async function giveRoseDawn() {
    if (!G.flags.dawnDrink) return E.speak('DAWN', "*eyes the rose, then the empty glass* Adorable. But a girl drinks BEFORE she blooms, sweetie.");
    E.removeItem('rose'); G.flags.dawnRose = true; E.award('dawn_rose', 'flora delivered');
    return E.speak('DAWN', "*presses it to her cheek like a soap-opera close-up* A ROSE! For ME! You're trouble, polyester. The GOOD kind. The kind with a savings account, right?", "(You nod. Technically a Christmas club account. Details.)");
  }

  /* ═════════ THE QUICKIE CHAPEL ═════════ */
  ROOMS.chapel = {
    name: "The Quickie Chapel",
    music: 'chapel',
    desc: "The Quickie Chapel of Eternal-ish Love: pews, candelabras, a neon cupid with one eye out, and an Elvis at the altar. Not AN Elvis — THE Elvis? No. But also don't ask him.",
    walk: { x0: 80, x1: 560, y0: 306, y1: 366 }, sMin: 1.0, sMax: 1.16,
    spawn: [320, 336],
    draw(t) {
      bands(0, 24, 640, 250, ['#2e1830', '#3a1f3c', '#2a1530']);
      dither(0, 274, 640, 126, '#6a2a4a', '#5a2440', 2);
      R(280, 274, 80, 126, '#a03060'); // aisle carpet
      // altar arch
      R(240, 90, 160, 14, '#c9a0b8'); R(236, 104, 14, 130, '#c9a0b8'); R(390, 104, 14, 130, '#c9a0b8');
      F.neon(cx, '♥', 320, 66, 4, '#ff5df1', t, 1);
      F.neon(cx, '24HR LOVE', 320, 120, 2, '#ff8bc9', t, 1);
      R(268, 210, 104, 26, '#7a1f4f'); // altar
      // candelabras
      for (const cxx of [220, 420]) { R(cxx - 2, 180, 4, 56, '#c9a34a'); R(cxx - 16, 186, 32, 4, '#c9a34a'); for (const fx of [-16, 0, 14]) { R(cxx + fx, 178, 3, 8, '#f2f2f2'); const fl = Math.sin(t / 90 + cxx + fx) * 2; R(cxx + fx, 172 + fl, 3, 5, '#ffb347'); } }
      // pews
      for (const [px2, py2] of [[90, 290], [90, 330], [430, 290], [430, 330]]) { R(px2, py2, 120, 10, '#54341c'); R(px2, py2 + 10, 120, 18, '#4c3018'); }
      // organ
      R(40, 190, 90, 90, '#3a2412'); for (let i = 0; i < 10; i++) R(46 + i * 8, 200, 6, 30, i % 2 ? '#f2ead8' : '#2a1c0e');
      // Elvis (sorry, "Rev. Prezley")
      A.person({ x: 320, y: 270, scale: 1.08, hair: 'pomp', hairC: '#0e0e14', skin: '#e8b088', top: '#f2f2f2', bottom: '#f2f2f2', shades: 1, tie: '#f5c542' });
      // Dawn waiting (pre-wedding)
      if (G.flags.engaged && !G.flags.wedded) A.person({ x: 370, y: 300, scale: 1.05, hair: 'long', hairC: '#f0d060', skin: '#f0c8a0', top: '#f2f2f2', bottom: '#e8e2d0', dress: 1, lipstick: 1 });
    },
    hot() {
      return [
        { name: 'Rev. Elvis Prezley', syn: ['elvis', 'reverend', 'prezley', 'officiant', 'priest'], x: 286, y: 210, w: 70, h: 66, wx: 320, wy: 316, talk: talkElvis, look: "The Reverend Elvis Prezley (legally distinct). Rhinestones: 400. Sideburns: regulation. Spiritual authority: laminated." },
        { name: 'Dawn (radiant, impatient)', syn: ['dawn', 'bride'], when: () => G.flags.engaged && !G.flags.wedded, x: 340, y: 240, w: 60, h: 66, wx: 370, wy: 320, talk: () => E.speak('DAWN', "*already holding a bouquet she invoiced you for* Clock's ticking, snookums! Tell the Reverend we're READY."), look: "Dawn has produced a full bridal look from nowhere. Efficiency? Or a go-bag? Love doesn't ask." },
        { name: 'neon cupid', syn: ['cupid', 'neon', 'sign'], x: 290, y: 40, w: 60, h: 60, remote: true, look: "A neon cupid, one eye flickering. He's seen the divorce statistics and he's tired." },
        { name: 'organ', syn: ['organ', 'keys', 'piano'], x: 36, y: 186, w: 98, h: 96, wx: 110, wy: 320, look: "A wheezy chapel organ. The sheet music is 'Here Comes The Bride' with 'BRIDE' crossed out and 'BILL' written in.", use: () => { SFX.organ(); return E.say("You plink out three notes. The Reverend gives you a thumbs up without turning around. Uh-huh-huh."); } },
        { name: 'pews', syn: ['pews', 'bench', 'seats'], x: 90, y: 286, w: 460, h: 66, wx: 320, wy: 340, look: "Pews polished smooth by ten thousand nervous relatives.", use: "You're the GROOM, allegedly. Grooms stand." },
        { name: 'exit', syn: ['exit', 'leave', 'taxi', 'out'], x: 0, y: 300, w: 60, h: 80, wx: 84, wy: 336, goto: () => G.flags.engaged && !G.flags.wedded ? E.speak('DAWN', "*materializes in the doorway* Cold FEET, darling? Feet get cold when they're not wearing MATRIMONY. Back inside.") : TAXI.open(), look: "The exit. Freedom-scented." },
      ];
    },
    hint() {
      if (G.flags.engaged && !G.flags.wedded) return "TALK to the Reverend and hold onto your wallet. What could possibly go wrong?";
      return "Nothing left here but rice on the floor and lessons learned. Taxi awaits.";
    },
  };
  async function talkElvis() {
    if (!G.flags.engaged) return E.speak('REV. PREZLEY', "*uh-huh-huh* No bride, no vows, amigo. The chapel don't do hypotheticals. Come back with a fiancée and a flexible definition of forever.");
    if (G.flags.wedded) return E.speak('REV. PREZLEY', "*polishing rhinestones* Annulments are aisle two. Emotionally speaking.");
    const fee = Math.min(20, Math.max(5, Math.floor(G.money / 2)));
    await E.speak('REV. PREZLEY', `Well well! A groom! Love it. LIVE for it. The Deluxe Eternal-ish Package runs $${fee} — sliding scale, 'cause love shouldn't bankrupt you. That's the CASINO'S job, uh-huh.`);
    const c = await E.choose(`Pay the $${fee} and marry Dawn?`, ["'I do!' (pay the man)", "'Can I think about it?'"]);
    if (c === 1) return E.speak('DAWN', "*from behind you, sweetly, terrifyingly* Think FASTER, snookums.");
    E.pay(fee, 'Deluxe Eternal-ish Package');
    await weddingCutscene();
  }
  async function weddingCutscene() {
    G.cut = true;
    SFX.organ(); E.clock(25);
    await E.sayRaw([
      { t: "Dearly beloved-ish! We are gathered here, at speed, to join Brendon and Dawn in the sacred-adjacent bonds of matrimony…", who: 'REV. PREZLEY' },
      { t: "Do you, Dawn, take this man, his heart, and — *checks notes* — 'all associated accounts and lines of credit'?", who: 'REV. PREZLEY' },
      { t: "I DO. *the words 'associated accounts' echo strangely, but her eyes are so sparkly*", who: 'DAWN' },
      { t: "And do you, Brendon, take this woman, in richness and in richness, till DAWN do you part? …That's just what's printed here. Odd phrasin'. Anyway—", who: 'REV. PREZLEY' },
      { t: "I do!", who: 'BRENDON' },
      { t: "By the power vested in me by the Pennsylvania Gaming Control Board, I now pronounce you MARRIED. Uh-huh-huh. You may kiss the bride and tip the officiant.", who: 'REV. PREZLEY' },
    ]);
    G.flags.wedded = true; E.award('wed', 'till Dawn do you part');
    await E.say("Rice flies. The organ wheezes. Dawn signs the register with a stamp she keeps in her purse.",
      "The happy couple taxis to the honeymoon suite at the Rivers Casino, comped by 'a friend of Dawn's'. Everything is coming up Brendon!");
    G.cut = false;
    E.goto('suite', 320, 340, { first: true });
  }

  /* ═════════ HONEYMOON SUITE ═════════ */
  ROOMS.suite = {
    name: "honeymoon suite",
    music: 'suite',
    desc: "The Rivers Casino honeymoon suite: heart-shaped bed, mood lighting, a rotary phone from the Nixon years, and a window with a million-dollar view of a parking structure.",
    walk: { x0: 60, x1: 580, y0: 310, y1: 368 }, sMin: 1.0, sMax: 1.16,
    spawn: [320, 340],
    hidePlayer: false,
    enter(first) {
      this.hidePlayer = !G.flags.escaped;
      if (first && !G.flags.escaped) tiedScene();
    },
    draw(t) {
      bands(0, 24, 640, 260, ['#3c1a2a', '#4a2136', '#381826']);
      dither(0, 284, 640, 116, '#7a3a5a', '#6a304c', 2);
      // window
      R(440, 60, 130, 110, '#0d0a1e'); R(436, 56, 138, 4, '#241a2c'); R(436, 170, 138, 4, '#241a2c'); R(436, 60, 4, 110, '#241a2c'); R(570, 60, 4, 110, '#241a2c');
      F.neon(cx, 'RIVERS', 505, 90, 2, '#41f0e0', t, 1);
      F.text(cx, '(parking)', 480, 130, 1, '#5d5570');
      // heart bed
      R(140, 220, 200, 80, '#e05a8a'); R(130, 210, 100, 30, '#e05a8a'); R(250, 210, 100, 30, '#e05a8a');
      R(150, 230, 180, 20, '#f2f2f2');
      R(120, 200, 16, 110, '#7a1f4f'); R(344, 200, 16, 110, '#7a1f4f');
      if (!G.flags.escaped) {
        // Brendon, tied to the bed, dignity optional
        A.brendon(238, 292, { scale: 1.15, pose: 'sit' });
        R(200, 246, 80, 6, '#c9974a'); R(200, 262, 80, 6, '#c9974a'); // ropes
        if (Math.floor(t / 700) % 2) F.text(cx, '!', 238, 196, 2, '#ff8b96');
        // the note
        R(300, 236, 20, 14, '#f7f3e6');
      }
      // nightstand + phone
      R(380, 250, 60, 14, '#54341c'); R(386, 264, 10, 40, '#3a2412'); R(424, 264, 10, 40, '#3a2412');
      R(392, 228, 36, 22, '#222'); R(398, 222, 24, 8, '#222'); R(404, 232, 12, 12, '#444');
      // mood lamp
      R(60, 240, 24, 10, '#7a1f4f'); R(66, 200, 12, 40, '#c9a0b8'); glow(72, 210, 40, '#ff8bc9', 0.14);
      // door
      A.doorway(590, 190, 40, 120, '#2a1a10', '#4c3018');
      F.text(cx, 'LOBBY', 588, 174, 1, '#c9b45a');
    },
    hot() {
      const tied = () => !G.flags.escaped;
      return [
        { name: 'the ropes', syn: ['ropes', 'rope', 'knots', 'bonds'], when: tied, x: 190, y: 236, w: 100, h: 40, remote: true, look: "Professional-grade knots. Dawn has DONE THIS BEFORE. The realization arrives in waves.", use: () => E.say("You strain heroically. The knots tighten, as if amused. Maybe WIGGLE toward that phone?"), untie: () => E.say("Your fingers can't reach. WIGGLE, Brendon. Wiggle like your credit score depends on it. (It does.)") },
        { name: 'rotary phone', syn: ['phone', 'telephone'], x: 380, y: 218, w: 60, h: 46, wx: 420, wy: 330, remote: false, look: () => E.say(G.flags.escaped ? "The rotary phone. It has one more favor in it, tops." : "A rotary phone on the nightstand — three heroic wiggles away."), use: phoneCall, call: phoneCall },
        { name: "Dawn's note", syn: ['note', 'letter'], when: () => !G.flags.escaped, x: 296, y: 230, w: 28, h: 24, remote: true, look: "A note on hotel stationery, pinned under a complimentary mint she also took a bite of.", take: () => E.say("Your arms are decorative right now. Wiggle first."), read: () => E.say("From here you can make out the words 'kisses' and 'community property'. Ominous.") },
        { name: 'heart-shaped bed', syn: ['bed', 'heart bed'], x: 130, y: 200, w: 220, h: 100, wx: 320, wy: 330, look: () => E.say(G.flags.escaped ? "The bed. Scene of the crime. The heart shape now reads as sarcasm." : "You are ON it. Tied TO it. The mattress is, credit where due, extremely comfortable."), use: () => E.say(G.flags.escaped ? "Absolutely not. You've BEEN on that bed. It has trust issues now. So do you." : "You are already using it, in the least fun way possible.") },
        { name: 'window', syn: ['window', 'view', 'river'], x: 436, y: 56, w: 138, h: 118, wx: 500, wy: 320, look: "Below: the Rivers Casino's neon empire, and the parking structure where love goes to feed the meter. The Ohio River is out there somewhere, professionally ignoring you." },
        { name: 'door to lobby', syn: ['door', 'lobby', 'exit', 'leave'], when: () => G.flags.escaped, x: 586, y: 180, w: 48, h: 132, wx: 590, wy: 336, goto: () => { SFX.door(); E.goto('lobby', 320, 340); }, look: "The door to the lobby. Onward — poorer, wiser, weirdly motivated." },
      ];
    },
    cmds: [
      { re: /^(wiggle|struggle|squirm|escape)$/, fn: doWiggle },
      { re: /^(call|phone|dial)( for)?( help| front desk| housekeeping)?$/, fn: phoneCall },
      { re: /^(cry|weep|scream)$/, fn: () => E.say(G.flags.escaped ? "You've cried enough for one lifetime. Well. One evening." : "You scream into the decorative pillow. It absorbs your feelings, as designed.") },
    ],
    hint() {
      if (!G.flags.escaped) return G.flags.wiggles >= 2 ? "You're in phone range! USE the PHONE (with your face, apparently)." : "WIGGLE. Type it. Say it. Live it. The phone is your future.";
      return "Read Dawn's note if you dare, then hit the LOBBY. You need money, and the casino downstairs is full of it.";
    },
  };
  async function tiedScene() {
    G.cut = true;
    await E.sayRaw([
      { t: "The suite. Champagne. Soft light. Dawn dims the lamp and whispers, 'Close your eyes, husband. I have a surprise.'", who: 'THE NARRATOR' },
      { t: "You close your eyes. There is a rustling. Several rustlings. An INDUSTRIAL quantity of rustling.", who: 'THE NARRATOR' },
      { t: "You open your eyes. You are tied to the bed with nautical precision. Dawn is wearing your gold chain and holding your wallet like a tiny suitcase.", who: 'THE NARRATOR' },
      { t: "Nothing personal, snookums. You were the sweetest ATM I ever married. …This week. Byeee!", who: 'DAWN' },
      { t: "She leaves the note, takes the cash — every dollar except a fiver she calls 'bus fare, because I'm not a MONSTER' — and is gone.", who: 'THE NARRATOR' },
    ]);
    G.money = 5;
    G.flags.wiggles = 0;
    G.cut = false;
    await E.think("Married and robbed in one night. That's got to be some kind of efficiency record. …Okay. WIGGLE time.");
  }
  async function doWiggle() {
    if (G.room !== 'suite') return E.say("You wiggle, socially. A stranger wiggles back. Community!");
    if (G.flags.escaped) return E.say("You wiggle in celebration. Freedom feels AMAZING.");
    G.flags.wiggles = (G.flags.wiggles || 0) + 1;
    if (G.flags.wiggles === 1) return E.say("You wiggle with purpose. The bed inches sideways with a haunted-house creak. The phone is closer. VICTORY IS A DIRECTION.");
    if (G.flags.wiggles === 2) return E.say("Another mighty wiggle. The nightstand is within FACE range. You could dial with your nose. You were BORN to dial with your nose.");
    return phoneCall();
  }
  async function phoneCall() {
    if (G.room !== 'suite') return E.say("No phone here that'll take your calls.");
    if (G.flags.escaped) return E.say("You consider calling Dawn. The phone displays wisdom by having no redial.");
    if ((G.flags.wiggles || 0) < 2) return E.say("The phone is a full nautical mile away (three feet). WIGGLE closer first.");
    SFX.phone();
    await E.say("You nose-dial '0'. It takes four tries and costs you some eyebrow. Ringing… ringing…");
    await E.speak('FRONT DESK', "Rivers Casino front desk, this is the front desk, how may I— sir, why are you breathing like that?");
    await E.speak('BRENDON', "Tied to bed— new wife— took wallet— send help— tell no one—");
    await E.speak('FRONT DESK', "*zero surprise* A Dawn situation. Third this month. Sending Marge.");
    await E.sayRaw([{ t: "Time passes. The door opens. MARGE from Housekeeping enters, assesses the scene with the eyes of a woman who has seen ALL of it, and produces scissors from her cart.", who: 'THE NARRATOR' }]);
    await E.speak('MARGE', "*snip* *snip* Honeymoon package, huh. *snip* You'd think the heart-shaped bed would tip 'em off. *final snip* There. Widowed by Wednesday, free by Friday, that's our motto.");
    G.flags.escaped = true; ROOMS.suite.hidePlayer = false;
    E.addItem('note');
    E.award('escape_bed', 'the great wiggle');
    const c = await E.choose("Marge waits, palm subtly open.", ["Tip her your last $5", "'I was robbed, Marge. Robbed.'"]);
    if (c === 0 && G.money >= 5) { E.pay(5, 'Marge'); E.award('marge', 'class act'); await E.speak('MARGE', "*pockets it* A tipper. Dawn always did have taste in victims. Casino's downstairs, hon — win it back. Everybody does. (Nobody does.)"); }
    else { E.award('marge', 'sympathy discount'); await E.speak('MARGE', "*sighs, waves it off* On the house, hon. You look like a charity case with GREAT hair. Casino's downstairs. Godspeed."); }
    await E.think("Broke, single-ish, and free. The casino is downstairs and my luck literally cannot get worse. …Statistically.");
  }
})();
