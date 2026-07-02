/* ── rooms: East Carson Street, Nadine's Bar, bathroom, back room, upstairs, alley ── */
(() => {
  const { K, R, dither, bands, glow } = A;

  /* ═════════ EAST CARSON STREET ═════════ */
  ROOMS.street = {
    name: "East Carson Street — South Side",
    music: 'lounge',
    desc: "East Carson Street, the South Side — Pittsburgh's longest continuous argument, and tonight, the doorstep of destiny. Nadine's Bar hums to the right; a suspicious alley yawns to the left; taxis prowl for the hopeful.",
    walk: { x0: 24, x1: 616, y0: 306, y1: 338 }, sMin: 1.0, sMax: 1.16,
    spawn: [90, 330],
    draw(t) {
      A.sky(24, 172, 7, 540, 54);
      A.skyline(176, 3);
      // left building with alley gap
      A.brickWall(0, 150, 64, 152, '#2c2333', '#211a28');
      A.brickWall(122, 140, 180, 162, '#33222b', '#251821');
      R(64, 148, 58, 30, '#16121f');                      // wall above alley mouth
      R(64, 176, 58, 126, '#050308');                     // alley mouth
      R(64, 176, 58, 4, '#211a28');
      F.text(cx, '↑', 84, 200, 2, '#3f3550');
      A.windowLit(150, 170, 30, 24, '#8a5f9e'); A.windowLit(230, 170, 30, 24, '#3d3d55');
      F.neon(cx, 'LOUNGE', 212, 214, 2, '#9a5fd0', t, 1);
      // Nadine's
      A.brickWall(302, 132, 338, 170, '#3a1f24', '#2a161a');
      F.neon(cx, "NADINE'S", 470, 158, 4, '#ff5df1', t, 1);
      F.center(cx, 'BAR', 470, 196, 2, '#41f0e0');
      glow(470, 170, 90, '#ff5df1', 0.10);
      A.doorway(452, 232, 44, 70, '#54341c', '#6e4a24', '#f0c46a');
      A.windowLit(330, 220, 76, 52, '#e8a33d', '#1d1016');
      R(334, 238, 10, 26, '#7a4020'); R(352, 232, 8, 32, '#7a4020'); R(378, 242, 12, 22, '#7a4020'); // silhouettes
      A.sidewalk(302, 40);
      A.road(342, 58);
      // painted TAXI zone
      F.text(cx, 'TAXI', 168, 346, 2, '#b9a13c');
      R(150, 344, 2, 14, '#b9a13c'); R(250, 344, 2, 14, '#b9a13c');
      A.lampPost(280, 336, t);
      // hydrant
      R(548, 320, 12, 16, '#a02828'); R(551, 314, 6, 8, '#a02828'); R(544, 324, 20, 4, '#a02828');
      // the parking chair (it was here before you; it will be here after)
      R(594, 302, 18, 4, '#3a6ea8'); R(594, 306, 4, 26, '#3a6ea8'); R(608, 306, 4, 26, '#3a6ea8');
      R(592, 314, 22, 4, '#3a6ea8'); R(596, 318, 3, 14, '#2a5280'); R(607, 318, 3, 14, '#2a5280');
      // cruising cab
      const cabX = ((t / 22) % 900) - 130;
      R(cabX, 358, 62, 14, '#d9b62a'); R(cabX + 12, 350, 34, 10, '#d9b62a');
      R(cabX + 16, 352, 12, 6, '#222'); R(cabX + 30, 352, 12, 6, '#222');
      R(cabX + 24, 346, 14, 5, '#222'); F.text(cx, 'TAXI', cabX + 25, 347, 1, '#ffe9a3');
      R(cabX + 54, 362, 6, 4, '#ffe9a3'); R(cabX + 2, 362, 5, 4, '#a33');
      R(cabX + 8, 370, 10, 4, '#111'); R(cabX + 44, 370, 10, 4, '#111');
    },
    hot() {
      return [
        { name: "door to Nadine's Bar", syn: ['bar', 'nadines', 'door', 'enter'], x: 448, y: 228, w: 52, h: 76, wx: 474, wy: 314, goto: () => { SFX.door(); E.goto('bar', 80, 330); }, look: "The door to Nadine's. The hinges wheeze like they've seen things." },
        { name: 'neon sign', syn: ['sign', 'neon'], x: 400, y: 140, w: 150, h: 60, remote: true, look: "NADINE'S — 'EST. LAST TUESDAY. UNDER NEW MANAGEMENT SINCE WEDNESDAY.'" },
        { name: 'bar window', syn: ['window'], x: 326, y: 216, w: 84, h: 60, look: "Through the grime: hunched silhouettes nursing drinks. One of them is about to be you." },
        { name: 'the alley', syn: ['alley', 'dark alley'], x: 64, y: 176, w: 58, h: 126, wx: 92, wy: 312, goto: () => E.goto('alley', 580, 330), look: "A dark alley. In adventure games, dark alleys are basically gift shops." },
        { name: 'taxi zone', syn: ['taxi', 'cab', 'curb'], x: 140, y: 306, w: 130, h: 46, autoUse: true, wx: 200, wy: 334, use: () => TAXI.open(), look: "A painted taxi zone. Stand here and commerce happens.", talk: () => TAXI.open() },
        { name: 'fire hydrant', syn: ['hydrant'], x: 540, y: 310, w: 28, h: 30, look: "A fire hydrant, doing quiet, honest work. The only thing on this street with a steady job.", use: "It's city property, and the city is litigious." },
        { name: 'the street', syn: ['street', 'road', 'traffic'], x: 0, y: 344, w: 640, h: 56, wx: 320, wy: 336, remote: true, look: "Traffic whips past with the confidence of people who have somewhere to be.", goto: async () => { await E.die('JAYWALKED INTO LEGEND', "You stride into traffic with big Frogger energy. A taxi — possibly the one you were about to hail — makes its counter-argument.", "The cabbie honks an apology. It is not accepted, because you are a speed bump now."); } },
        { name: 'city skyline', syn: ['skyline', 'city', 'moon', 'sky', 'downtown'], x: 0, y: 24, w: 640, h: 130, remote: true, look: "Pittsburgh by night: four hundred bridges, three rivers, two sports feelings, and a thousand lit windows — every one of them somebody else's better evening." },
        { name: 'parking chair', syn: ['chair', 'parking chair', 'folding chair'], x: 588, y: 294, w: 30, h: 42, wx: 592, wy: 330, look: "A folding chair standing guard over a parking spot. It has been there since the '93 snowstorm. It has more legal authority than most courts.", take: "You reach for it. Somewhere, a curtain twitches. A porch light snaps on. You withdraw your hand and NOD, slowly, at the street itself. Wise.", use: "Sit in a stranger's parking chair? On THIS street? Brendon, people have moved away for less." },
      ];
    },
    hint() {
      if (!G.flags.introDone) return "Try LOOK, then head into Nadine's Bar.";
      if (!E.has('remote') && !G.flags.salGone) return "Everything starts inside Nadine's Bar. Talk to everyone. Buy things. Trust the process.";
      if (!E.has('card') && !G.flags.discoIn) return "That alley on the left is 'a gift shop', remember? A dumpster dive might pay off.";
      return "The taxi zone can take you anywhere: the store, the casino, the disco…";
    },
    async enter(first) {
      if (!G.flags.introDone) {
        G.flags.introDone = true;
        await E.sayRaw([
          { t: "PITTSBURGH. THE SOUTH SIDE. 10 PM. Meet Brendon: 38, creative genius (self-described), owner of one (1) white polyester leisure suit and a heart the size of his gold chain.", who: 'THE NARRATOR' },
          { t: "After a lifetime of 'let's just be friends', Brendon has bet it all on one night in the City of Bridges — 446 of them, and he intends to burn none. By sunrise he'll find true love… or at least a really good story.", who: 'THE NARRATOR' },
          { t: "He has $94, breath like ambition, and no plan whatsoever. Perfect. Let's begin.", who: 'THE NARRATOR' },
        ]);
        await E.think("Okay. New city, new me. Step one: the classiest establishment on East Carson. …So, Nadine's.");
      }
    },
  };

  /* ═════════ NADINE'S BAR ═════════ */
  ROOMS.bar = {
    name: "Nadine's Bar",
    music: 'lounge',
    desc: "Nadine's: sticky floors, stickier clientele. Matty, the owner, polishes a glass into a dirtier glass. A regular is fused to the corner booth. Doors lead to the GENTS, a PRIVATE hallway, and freedom.",
    walk: { x0: 40, x1: 600, y0: 300, y1: 372 }, sMin: 0.95, sMax: 1.2,
    spawn: [80, 330],
    draw(t) {
      // wood wall + floor
      bands(0, 24, 640, 256, ['#3d2417', '#432a1a', '#38200f']);
      R(0, 24, 640, 4, '#241108');
      dither(0, 280, 640, 120, '#5a3a20', '#4a2e16', 2);
      for (let y = 292; y < 400; y += 22) R(0, y, 640, 2, '#3a2210');
      // back wall doors
      A.doorway(296, 176, 46, 104, '#2a1a10', '#4c3018'); F.center(cx, 'GENTS', 319, 160, 1, '#c9b45a');
      A.doorway(372, 176, 46, 104, '#2a1a10', '#3a2412'); F.center(cx, 'PRIVATE', 395, 160, 1, '#c05555');
      R(384, 216, 22, 6, '#1a1008'); // door slot
      // bar counter + mirror + bottles
      R(36, 130, 230, 84, '#26150c');
      R(46, 138, 210, 60, '#4a5568'); // mirror
      dither(46, 138, 210, 60, '#4a5568', '#39424f', 2);
      for (let i = 0; i < 8; i++) {
        const bx = 56 + i * 25;
        R(bx, 176, 10, 22, ['#2d5','#a33','#37c','#c93','#7a3','#a3c','#3aa','#c55'][i]);
        R(bx + 3, 168, 4, 8, '#222');
      }
      F.neon(cx, 'BEER', 150, 100, 2, '#41f0e0', t, 1);
      R(36, 214, 236, 10, '#6e4a24');
      R(36, 224, 230, 66, '#54341c');     // bar front
      dither(36, 224, 230, 66, '#54341c', '#482c16', 2);
      // pretzel bowl
      R(200, 206, 26, 8, '#8a5a2a'); R(204, 202, 18, 6, '#c9974a');
      // stools
      for (const sx of [80, 150, 220]) { R(sx - 12, 290, 24, 8, '#7a1f1f'); R(sx - 8, 298, 4, 30, '#2a2a30'); R(sx + 4, 298, 4, 30, '#2a2a30'); }
      // bartender
      A.person({ x: 150, y: 288, scale: 1.02, hair: 'bald', hairC: '#4a3320', skin: K.skin2, top: '#7a2a2a', apron: 1, stache: 1, frame: 0 });
      // booth right
      R(420, 210, 130, 12, '#7a1f1f'); R(420, 222, 12, 70, '#7a1f1f'); R(538, 222, 12, 70, '#7a1f1f');
      R(444, 250, 86, 34, '#54341c'); R(450, 244, 74, 8, '#6e4a24'); // table
      // the drunk
      A.person({ x: 500, y: 290, scale: 1.0, pose: 'sit', hair: 'wave', hairC: '#777', skin: '#d8a07a', top: '#4a5a3a', bottom: '#3a3a2a' });
      R(492, 246, 3, 3, '#c47a1e');  // his empty glass
      if (!G.flags.drunkPaid) F.text(cx, '?', 512, 216, 2, '#c9b45a');
      // jukebox
      const jx = 566;
      R(jx, 216, 58, 90, '#5a2ba0'); R(jx + 6, 222, 46, 26, '#f5c542');
      R(jx + 10, 252, 38, 40, '#2a1445');
      const ph = Math.floor(t / 300) % 3;
      R(jx + 14 + ph * 10, 258, 8, 28, '#ff5df1'); glow(jx + 29, 250, 40, '#ff5df1', 0.12);
      F.text(cx, '♪', jx + 24, 228, 2, '#5a2ba0');
      // dartboard
      R(478, 90, 40, 40, '#2a2a30'); R(486, 98, 24, 24, '#a33'); R(492, 104, 12, 12, '#f7f3e6'); R(496, 108, 4, 4, '#222');
      // hanging lamps
      for (const lx of [150, 470]) { R(lx - 1, 24, 2, 30, '#222'); R(lx - 14, 54, 28, 10, '#2c5c2c'); glow(lx, 70, 50, '#ffe9a3', 0.10); }
      // exit door left
      A.doorway(0, 190, 34, 100, '#241108', '#3a2412'); F.text(cx, 'EXIT', 2, 172, 1, '#c9b45a');
    },
    hot() {
      return [
        { name: 'Matty', syn: ['matty', 'bartender', 'barman', 'owner', 'barkeep'], x: 110, y: 220, w: 80, h: 70, wx: 150, wy: 316, talk: talkBartender, look: "Matty, owner of this place. Mustache like a push broom, eyes like he's seen every pickup line since Prohibition, and the confidence of a man who owns the only good bar on the block.", buy: talkBartender, items: { ring: "He squints at the ring. 'Already married. To this BAR. And I own it.'", rose: "'Buddy, I'm flattered, and no.'" } },
        { name: 'the regular', syn: ['drunk', 'regular', 'man', 'guy', 'barfly', 'old man'], x: 470, y: 226, w: 70, h: 66, wx: 470, wy: 322, talk: talkDrunk, look: "A gentleman marinating in the corner booth. His glass is empty. His eyes say it has been empty for a GENERATIONALLY long time.", items: { whiskey: giveWhiskey, wine: "He eyes the wine. 'Grape juice? Kid, I have STANDARDS. Barely, but I have 'em.'" } },
        { name: 'jukebox', syn: ['jukebox', 'music', 'juke'], x: 560, y: 216, w: 64, h: 94, wx: 560, wy: 330, use: useJukebox, look: "A grape-purple jukebox. Half the tracks are labeled 'FOXY' and the other half are just labeled 'SAX'.", autoUse: false },
        { name: 'GENTS door', syn: ['bathroom', 'gents', 'restroom', 'toilet door', 'wc'], x: 292, y: 156, w: 54, h: 126, wx: 319, wy: 312, goto: () => { SFX.door(); E.goto('bath', 90, 330); }, look: "The gentlemen's room. The apostrophe on the sign gave up years ago." },
        { name: 'PRIVATE door', syn: ['private', 'hallway', 'back door', 'back room', 'door slot'], x: 368, y: 156, w: 54, h: 126, wx: 395, wy: 312, goto: knockPrivate, use: knockPrivate, knock: knockPrivate, talk: knockPrivate, look: "A heavy door marked PRIVATE, with a sliding slot at eye level. Very speakeasy. Very 'you're not invited'." },
        { name: 'dartboard', syn: ['dartboard', 'darts'], x: 474, y: 86, w: 48, h: 48, remote: true, look: "A dartboard with a suspicious number of holes NOT in the dartboard.", use: "You consider darts. The wall behind it has suffered enough." },
        { name: 'pretzels', syn: ['pretzels', 'bowl', 'snacks'], x: 196, y: 198, w: 34, h: 18, wx: 220, wy: 316, look: "Communal bar pretzels. Carbon dating suggests late disco era.", take: "You reach for one. It reaches back. You withdraw with dignity.", use: "Nope. Those pretzels have seniority." },
        { name: 'mirror & bottles', syn: ['bottles', 'mirror', 'shelf', 'bottle'], x: 46, y: 138, w: 210, h: 60, remote: true, look: "Bottles of every color, plus a mirror so you can watch yourself make decisions." },
        { name: 'exit to street', syn: ['exit', 'street', 'leave', 'out'], x: 0, y: 180, w: 38, h: 112, wx: 50, wy: 330, goto: () => { SFX.door(); E.goto('street', 474, 320); }, look: "The way out, for people with somewhere better to be." },
      ];
    },
    cmds: [
      { re: /^(order|buy) (whiskey|drink|booze)$/, fn: () => talkBartender() },
    ],
    hint() {
      if (!E.has('whiskey') && !E.has('remote') && !G.flags.drunkPaid) return "Bartenders sell drinks. That thirsty regular in the booth looks like a man with something to trade.";
      if (E.has('whiskey') && !E.has('remote')) return "You own a whiskey and that regular owns a powerful thirst. GIVE WHISKEY TO DRUNK.";
      if (!G.flags.knowDoorPass) return "The PRIVATE door wants a password. Bar wisdom is traditionally written where gentlemen wash their hands…";
      if (!G.flags.salGone) return "You know the password. Knock on the PRIVATE door and say it with confidence.";
      return "Upstairs, through the private room, opportunity awaits. Or check the alley and the taxi for the wider world.";
    },
  };
  async function talkBartender() {
    if (!G.flags.metBartender) {
      G.flags.metBartender = true;
      await E.speak('MATTY', "Evenin'. You look like a man who owns exactly one suit and this is it.", "What'll it be?");
    }
    const opts = ["A whiskey, my good man. ($5)", "Tell me about this place.", "What's behind the PRIVATE door?", "Any romance advice?", "Nothing right now."];
    const c = await E.choose('Say to the bartender:', opts);
    if (c === 0) {
      if (E.has('whiskey')) return E.speak('MATTY', "One at a time, champ. This ain't a juggling act.");
      if (!E.pay(5, 'whiskey')) return E.speak('MATTY', "Five bucks. You got lint. Come back when the lint appreciates in value.");
      E.addItem('whiskey'); E.award('whiskey_buy', 'liquid diplomacy'); SFX.pour();
      await E.speak('MATTY', "One house whiskey. Legally I gotta tell you it's 'aged'. I don't gotta tell you in WHAT.");
      return;
    }
    if (c === 1) return E.speak('MATTY', "I've owned this place for fifteen years. It's been the beating heart of East Carson since before the health department had feelings about it.", "We got darts, a jukebox, and a regular who'd sell his memoirs for a drink. Rich text, that guy. I run a tight ship — or at least, a ship that LOOKS tight from a distance.");
    if (c === 2) return E.speak('MATTY', "Private room. Nadine's cousin Sal 'runs' it, which means he watches TV in it.", "Members only — and the membership exam is one question long. Folks say the study guide is scrawled around here somewhere… gentlemen's room has a rich literary tradition.");
    if (c === 3) return E.speak('MATTY', "Romance advice? Sure: mint your breath, mind your wallet, and if a woman at the disco asks about your credit limit, that's not flirting, that's UNDERWRITING.", "Also — if anybody tells you 'Kennywood's open', check your zipper BEFORE you check the calendar. Free tip. Welcome to Pittsburgh.");
    return E.speak('MATTY', "I'll be here. That's the whole job.");
  }
  async function talkDrunk() {
    if (E.has('remote') || G.flags.drunkPaid) return E.speak('THE REGULAR', "*happy humming* Best trade I ever made. You need anything else, I also got opinions. Mostly about wrasslin'.");
    if (!G.flags.metDrunk) {
      G.flags.metDrunk = true;
      await E.speak('THE REGULAR', "*gravelly* Kid. KID. C'mere. You see this glass? Empty. Tragic. A museum of better times.",
        "Get a whiskey in front of me and I'll make it worth your while. I got ASSETS. Liberated assets.");
      return;
    }
    return E.speak('THE REGULAR', "The offer stands, kid. One whiskey. I'm good for it. I'm SOMETHING for it.");
  }
  async function giveWhiskey() {
    E.removeItem('whiskey');
    G.flags.drunkPaid = true;
    SFX.pour();
    await E.speak('THE REGULAR', "*the whiskey evaporates* AHHH. You, sir, are a humanitarian.",
      "As promised: one TV remote, genuine article. Swiped it from Sal's room out of spite — man's had wrasslin' on for a WEEK straight and called MY stories 'garbage'.",
      "Word of advice: Sal doesn't move for nothin' except a hot deal. Man cannot resist a bargain. It's medical.");
    E.addItem('remote'); E.award('drunk_whiskey', 'the trade');
    await E.think("A remote control. In a town like this, this is basically Excalibur.");
  }
  async function useJukebox() {
    const c = await E.choose('The jukebox glows expectantly. Pick a track:', ["'Polyester Nights' — The Smooth Units", "'Girl, My Chain Is Real' — Brendon B. & The Marketing Dept.", "'Saxophone Emergency' — Various Artists"]);
    E.award('egg_jukebox', 'music appreciation'); SFX.fanfare();
    if (c === 0) return E.say("The Smooth Units ooze from the speakers. Two patrons slow-dance with their own regrets.");
    if (c === 1) return E.say("Wait — this is YOUR demo tape from 2003?! The bartender makes eye contact and slowly turns it up. This is the nicest thing anyone's ever done for you.");
    return E.say("A saxophone erupts. Every person in the bar sits up slightly straighter. The 80s are BACK, baby. (They never left.)");
  }
  async function knockPrivate() {
    SFX.knock();
    await E.say("You knock. The slot SLAMS open. A pair of eyes with no discernible mercy appears.");
    await E.speak('THE SLOT', "Password.");
    if (!G.flags.knowDoorPass) {
      const c = await E.choose('Take a wild swing:', ["'Open sesame?'", "'…Password.'", "'I'm with the band.'"]);
      await E.speak('THE SLOT', ["'Cute.' SLAM.", "'Wow.' SLAM.", "'There's no band.' SLAM."][c]);
      return E.think("A password. Great. If only bars had some kind of… wall-based knowledge repository. Maybe where the gentlemen go.");
    }
    const c = await E.choose('You know this one:', ["'VINNIE SENT ME.'", "'A vinnie sent for me?'", "'Vidi vici Vinnie.'"]);
    if (c !== 0) { await E.speak('THE SLOT', "'So close and yet so unemployed.' SLAM."); return; }
    await E.speak('THE SLOT', "…Vinnie's good people. *CLUNK. CLUNK. clunk-clunk-CLUNK* (that's five locks)");
    E.award('password', 'made it inside'); SFX.door();
    E.goto('backroom', 90, 330);
  }

  /* ═════════ THE GENTS ═════════ */
  ROOMS.bath = {
    name: "the gentlemen's room",
    music: 'lounge',
    desc: "The gents: flickering light, philosophical graffiti, a sink, a mirror, and a toilet that has achieved sentience and chosen violence.",
    walk: { x0: 40, x1: 600, y0: 300, y1: 368 }, sMin: 1.0, sMax: 1.2,
    spawn: [90, 330],
    draw(t) {
      const flick = Math.sin(t / 90) * Math.sin(t / 411) > -0.9 ? 1 : 0.55;
      // tile walls
      dither(0, 24, 640, 236, '#3f5a5e', '#33494d', 4);
      for (let y = 24; y < 260; y += 24) R(0, y, 640, 2, '#243638');
      for (let x = 0; x < 640; x += 32) R(x, 24, 2, 236, '#243638');
      // floor checker
      dither(0, 260, 640, 140, '#5c6a70', '#49565c', 8);
      // fluorescent light
      R(240, 34, 160, 8, flick === 1 ? '#e8fbff' : '#7a9a9e'); glow(320, 40, 90, '#bfefff', 0.10 * flick);
      // graffiti wall panel
      R(230, 80, 200, 130, '#4a666b');
      cx.globalAlpha = 0.9;
      F.text(cx, 'FOR A GOOD TIME', 244, 96, 1, '#e05555');
      F.text(cx, 'TELL THE DOOR:', 244, 108, 1, '#e05555');
      F.text(cx, '"VINNIE SENT ME"', 244, 122, 1, '#ffe9a3');
      F.text(cx, 'YINZ WAS HERE', 250, 146, 1, '#8fd6ff');
      F.text(cx, 'ALL OF YINZ', 250, 158, 1, '#8fd6ff');
      F.text(cx, 'CALL DOREEN', 250, 178, 1, '#f0a6ff');
      R(244, 190, 120, 6, '#3a5257');
      cx.globalAlpha = 1;
      // sink + mirror
      R(80, 90, 70, 90, '#39424f'); R(86, 96, 58, 78, '#9fb6c9');
      R(100, 130, 30, 3, '#5f7a8a'); // crack
      R(70, 200, 90, 20, '#e8e8e8'); R(76, 220, 78, 34, '#cfcfcf'); R(100, 254, 24, 40, '#b8b8b8');
      R(106, 194, 18, 8, '#8a8a8a');
      const drip = Math.floor(t / 700) % 3;
      if (drip === 2) R(114, 206 + ((t / 40) % 12), 2, 4, '#bfefff');
      if (!G.flags.tookRing) { R(96, 206, 8, 4, '#f5c542'); const s = Math.floor(t / 260) % 4; if (s === 0) { R(94, 202, 2, 2, '#fff'); R(104, 208, 2, 2, '#fff'); } }
      // toilet
      R(470, 210, 60, 20, '#e8e8e8'); R(478, 230, 44, 40, '#dcdcdc'); R(474, 168, 52, 42, '#e8e8e8'); R(496, 178, 10, 6, '#9a9a9a');
      // paper roll
      R(552, 190, 20, 16, '#f2f2f2'); R(558, 196, 8, 4, '#c9c9c9');
      // door back
      A.doorway(20, 160, 44, 108, '#2a1a10', '#4c3018');
    },
    hot() {
      return [
        { name: 'sink', syn: ['sink', 'faucet', 'basin', 'hands'], x: 66, y: 190, w: 98, h: 80, wx: 120, wy: 316, look: () => G.flags.tookRing ? E.say("A sink with a faucet that drips in waltz time.") : E.say("A sink. Wedged by the drain: a RING, sparkling with desperation. Somebody's night ended worse than yours is going."), use: washHands, take: takeRing },
        { name: 'ring in the sink', syn: ['ring'], when: () => !G.flags.tookRing, x: 90, y: 200, w: 20, h: 14, wx: 120, wy: 316, take: takeRing, look: "A gaudy ring, one careless rinse from a life in the sewer. Its sparkle says 'engagement'; its price tag said 'gas station'." },
        { name: 'mirror', syn: ['mirror', 'reflection'], x: 76, y: 86, w: 78, h: 98, wx: 120, wy: 316, look: async () => { E.award('egg_mirror', 'self-regard'); await E.say("You check the mirror. Hair: immaculate. Chain: gleaming. Crack in the glass: adds character, like a duelling scar.", "You wink. The mirror-you winks back a quarter-second late, which is troubling, but you let it go."); }, use: "You give the mirror finger-guns. The mirror gives them back. Electric." },
        { name: 'graffiti', syn: ['graffiti', 'wall', 'writing', 'walls'], x: 230, y: 80, w: 200, h: 130, wx: 330, wy: 316, look: readGraffiti, use: readGraffiti, read: readGraffiti },
        { name: 'toilet', syn: ['toilet', 'john', 'commode'], x: 466, y: 164, w: 70, h: 108, wx: 500, wy: 320, look: "The toilet crouches in the corner like a dare.", use: flushToilet, flush: flushToilet },
        { name: 'paper roll', syn: ['paper', 'towel', 'roll'], x: 548, y: 186, w: 28, h: 24, wx: 545, wy: 320, look: "One (1) square remains. This bathroom runs on courage.", take: "You leave it. Somebody's going to need that square more than you." },
        { name: 'door to bar', syn: ['door', 'exit', 'bar', 'leave', 'out'], x: 16, y: 150, w: 52, h: 122, wx: 50, wy: 320, goto: () => { SFX.door(); E.goto('bar', 319, 320); }, look: "Back to the bar, where the drinks are wet and the futures are dry." },
      ];
    },
    cmds: [
      { re: /^wash( my)?( hands)?$/, fn: washHands },
      { re: /^flush( toilet)?$/, fn: flushToilet },
      { re: /^(read|look)( at)? (graffiti|wall|walls)$/, fn: readGraffiti },
    ],
    hint() {
      if (!G.flags.tookRing) return "That sparkle in the sink is a RING. Take it — tacky is a currency here.";
      if (!G.flags.knowDoorPass) return "READ the GRAFFITI. Bathroom walls are the town newspaper.";
      return "Wash up (hygiene is points), then go tell that PRIVATE door what Vinnie would want you to say.";
    },
  };
  async function washHands() {
    if (G.room !== 'bath') return E.say("Wash your hands? Out here? Bold, but no.");
    SFX.splash(); E.award('wash_hands', 'hygiene hero');
    return E.say("You wash your hands thoroughly, like a man who might shake hands with destiny later. The soap dispenser wheezes out one heroic bubble.");
  }
  async function takeRing() {
    if (G.flags.tookRing) return E.say("Already got it. Your pocket now contains one entire karat of ambition.");
    G.flags.tookRing = true; E.addItem('ring'); E.award('ring_take', 'finders keepers');
    return E.say("You fish the ring from the drain with the focus of a surgeon and the ethics of a raccoon. Got it!");
  }
  async function flushToilet() {
    if (G.room !== 'bath') return E.say("There is nothing here to flush except your prospects.");
    SFX.flush(); E.award('egg_flush', 'civic duty');
    return E.say("WHOOOOSH. The flush echoes like applause. You take a small bow. Somewhere, a plumber wakes in a cold sweat.");
  }
  async function readGraffiti() {
    if (G.room !== 'bath') return E.say("No graffiti here. This establishment prefers its wisdom verbal.");
    if (!G.flags.knowDoorPass) {
      G.flags.knowDoorPass = true; E.award('graffiti', 'wall scholarship');
      return E.say("The wall is a library: 'YINZ WAS HERE'. 'ALL OF YINZ.' 'CALL DOREEN' (number scratched out by, presumably, Doreen).",
        "And there — in confident marker: 'FOR A GOOD TIME, TELL THE DOOR: VINNIE SENT ME.'",
        "You commit it to memory, displacing your mother's birthday.");
    }
    return E.say("Further study reveals: 'THE OWL KNOWS' (ominous), a phone number for 'DISCREET LLAMA RIDES' (tempting), and a heartfelt sonnet about a sandwich with the fries and slaw already on it (honestly, moving).");
  }

  /* ═════════ THE BACK ROOM ═════════ */
  ROOMS.backroom = {
    name: "the back room",
    music: 'lounge',
    desc: "Sal's kingdom: a TV older than cable, a recliner shaped like Sal, a poker table nobody's allowed to touch, and a staircase roped off like it leads somewhere interesting. (It does.)",
    walk: { x0: 40, x1: 560, y0: 300, y1: 368 }, sMin: 1.0, sMax: 1.2,
    spawn: [90, 330],
    draw(t) {
      bands(0, 24, 640, 256, ['#2c1f2e', '#332536', '#2a1d2c']);
      dither(0, 280, 640, 120, '#463048', '#3a273c', 2);
      // smoke haze
      cx.globalAlpha = 0.08;
      for (let i = 0; i < 3; i++) R(0, 60 + i * 30 + Math.sin(t / 1400 + i) * 6, 640, 12, '#c9c9d9');
      cx.globalAlpha = 1;
      // velvet painting of a sad clown
      R(30, 70, 70, 90, '#5a4a20'); R(36, 76, 58, 78, '#1a1030');
      R(56, 96, 18, 18, '#e8d8c8'); R(60, 100, 3, 3, '#333'); R(68, 100, 3, 3, '#333'); R(60, 110, 10, 2, '#a33');
      R(52, 90, 26, 6, '#c55'); R(62, 114, 6, 8, '#c55');
      // TV on crate
      R(120, 236, 110, 60, '#54341c');
      R(112, 140, 126, 96, '#3a3a44'); R(122, 150, 92, 72, '#101018');
      R(218, 150, 14, 10, '#222'); R(220, 166, 10, 10, '#555'); R(220, 180, 10, 10, '#555');
      R(150, 130, 3, 14, '#888'); R(168, 124, 3, 20, '#888'); // antenna
      // screen content
      if (!G.flags.salGone) { // wrasslin'
        const b = Math.abs(Math.sin(t / 200)) * 20;
        R(132, 190 - b / 2, 14, 20 + b / 2, '#e8a33d'); R(180, 176, 14, 34, '#55c'); R(122, 206, 92, 8, '#333');
        F.text(cx, 'WRASSLIN', 138, 156, 1, '#e8e8e8');
      } else { // THE OWL
        R(154, 172, 28, 26, '#e8e2d0'); R(158, 178, 6, 6, '#f5c542'); R(172, 178, 6, 6, '#f5c542');
        R(160, 180, 2, 2, '#111'); R(174, 180, 2, 2, '#111'); R(165, 186, 6, 5, '#c9974a');
        F.text(cx, 'OWL 19.99', 134, 156, 1, '#7dffb0');
        F.text(cx, 'ONLY ' + (12 - (Math.floor(t / 900) % 9)) + ' LEFT', 130, 210, 1, '#ff8b96');
      }
      glow(168, 186, 70, G.flags.salGone ? '#7dffb0' : '#8fd6ff', 0.12);
      // poker table
      R(360, 190, 130, 16, '#1d6b30'); R(368, 206, 10, 40, '#54341c'); R(472, 206, 10, 40, '#54341c');
      R(388, 182, 20, 14, '#c9c9c9'); R(420, 184, 16, 10, '#a33');
      // recliner + Sal
      if (!G.flags.salGone) {
        R(268, 236, 92, 66, '#6a3a7a'); R(258, 216, 20, 80, '#6a3a7a'); R(350, 216, 20, 80, '#6a3a7a'); R(268, 208, 92, 30, '#7a4a8a');
        A.person({ x: 312, y: 296, scale: 1.28, pose: 'sit', hair: 'bald', hairC: '#333', skin: '#d8a07a', top: '#3a3a3a', bottom: '#2a2a34', stache: 1 });
        if (Math.floor(t / 2200) % 4 === 0) F.text(cx, 'ZZZ?', 340, 190, 1, '#8d8798');
      } else {
        R(268, 236, 92, 66, '#6a3a7a'); R(258, 216, 20, 80, '#6a3a7a'); R(350, 216, 20, 80, '#6a3a7a'); R(268, 208, 92, 30, '#7a4a8a');
        R(290, 250, 50, 12, '#5a2a6a'); // the Sal-shaped dent
      }
      // stairs
      for (let i = 0; i < 7; i++) R(520 + i * 14, 280 - i * 18, 100 - i * 14, 18, i % 2 ? '#4c3018' : '#54341c');
      R(516, 140, 8, 150, '#2a1a10');
      if (!G.flags.salGone) { R(520, 240, 100, 4, '#a02840'); F.text(cx, 'PRIVATE', 528, 226, 1, '#ff8b96'); }
      else F.text(cx, 'UP', 560, 226, 1, '#7dffb0');
      // door back to bar
      A.doorway(10, 190, 40, 100, '#241108', '#3a2412');
    },
    hot() {
      return [
        { name: 'Big Sal', syn: ['sal', 'big sal', 'guy', 'man'], when: () => !G.flags.salGone, x: 250, y: 200, w: 120, h: 100, wx: 230, wy: 330, talk: talkSal, look: "Big Sal. Imagine a vending machine that lifts. He hasn't blinked since the wrestling started, possibly since it was INVENTED.", items: { whiskey: "Sal, without looking: 'On duty.' …Watching TV is the duty.", remote: () => useRemoteTV(), ring: "'Married. She's the size of me. Beat it.'" } },
        { name: 'television', syn: ['tv', 'television', 'screen', 'set'], x: 108, y: 136, w: 132, h: 104, wx: 200, wy: 330, look: () => E.say(G.flags.salGone ? "The Home Shopping Bonanza is mid-owl. The owl's eyes follow you. $19.99 and it could follow you FOREVER." : "A TV bolted to channel 3: ALL-NIGHT WRASSLIN'. Two enormous men are pretending to hurt each other; Sal believes with his whole chest."), use: () => E.say("The channel dial snapped off during the Carter administration. You'd need the remote… which Sal has 'misplaced'."), items: { remote: () => useRemoteTV() } },
        { name: 'stairs', syn: ['stairs', 'staircase', 'up', 'upstairs'], x: 516, y: 130, w: 110, h: 160, wx: 540, wy: 320, goto: () => { if (!G.flags.salGone) return E.say("You drift toward the stairs. Sal's head rotates like a tank turret: 'Stairs are PRIVATE, pal.' The head rotates back. You reconsider your life."); SFX.door(); E.goto('roxy', 100, 330); }, look: () => E.say(G.flags.salGone ? "The stairs, now Sal-free. Whatever's up there better be worth five locks and a porcelain owl." : "A staircase guarded by a rope and 300 pounds of loyalty.") },
        { name: 'poker table', syn: ['poker', 'table', 'cards'], x: 356, y: 180, w: 140, h: 66, wx: 420, wy: 320, look: "A poker table with cards mid-hand, abandoned like Pompeii. House rule: nobody touches Sal's table.", use: "You reach toward the cards. The air pressure changes. You un-reach." },
        { name: 'velvet clown', syn: ['painting', 'clown', 'velvet'], x: 26, y: 66, w: 78, h: 98, remote: true, look: "A velvet painting of a sad clown. Its eyes say 'I've seen the books, and Nadine knows I've seen the books. Pray for me.'" },
        { name: 'door to bar', syn: ['door', 'exit', 'bar', 'leave'], x: 6, y: 180, w: 48, h: 112, wx: 60, wy: 330, goto: () => { SFX.door(); E.goto('bar', 395, 320); }, look: "Back to the bar." },
      ];
    },
    hint() {
      if (!G.flags.salGone) return E.has('remote') ? "Sal can't resist a hot deal, and you hold the channel-changing power. USE REMOTE ON TV." : "Sal only moves for a bargain. Someone in this bar 'liberated' his remote… a thirsty someone.";
      return "The stairs are open, tiger. Go on up.";
    },
  };
  async function talkSal() {
    return E.speak('BIG SAL', "*without turning* Week six of All-Night Wrasslin'. Remote walked off. Dial's busted.",
      "It's fine. It's FINE. …You know what I miss? The Shopping Channel. Deals, kid. I am a man of DEALS.",
      "*a single tear, quickly denied* Stairs are private, by the way.");
  }
  async function useRemoteTV() {
    if (G.flags.salGone) return E.say("The owl remains. The owl abides.");
    E.removeItem('remote');
    await E.say("You raise the remote like a duelist. CLICK.");
    SFX.blip(880, 0.08);
    await E.sayRaw([{ t: '"—AND WE\'RE BACK with the HOME SHOPPING BONANZA! Feast your eyes on this COMMEMORATIVE PORCELAIN OWL — $19.99, and folks, there are only TWELVE LEFT—"', who: 'TELEVISION' }]);
    G.flags.salGone = true;
    await E.speak('BIG SAL', "…A porcelain… OWL…? Nineteen ninety-nine?! TWELVE LEFT?!",
      "*Sal rises like a continent* PHONE. I need a PHONE. Nobody touch NOTHING.");
    await E.say("Sal thunders past you toward the payphone out front, wallet already open, heart already owl-shaped.", "The stairs stand undefended.");
    E.award('tv_shop', 'the owl gambit');
    await E.think("I just weaponized daytime television. My marketing degree finally pays off.");
  }

  /* ═════════ UPSTAIRS — ROXY'S STUDIO ═════════ */
  ROOMS.roxy = {
    name: "Roxy's studio",
    music: 'lounge',
    desc: "The room above Nadine's, reborn as a content studio: ring light, phone tripod, a neon heart, and Roxy herself — mid-shoot, maximum focus, zero patience.",
    walk: { x0: 60, x1: 580, y0: 300, y1: 366 }, sMin: 1.0, sMax: 1.18,
    spawn: [100, 330],
    draw(t) {
      bands(0, 24, 640, 256, ['#3c2038', '#472643', '#3a1f36']);
      dither(0, 280, 640, 120, '#6a3a5a', '#5a2f4c', 2);
      // window w/ moon
      R(420, 60, 90, 80, '#0d0a1e'); R(416, 56, 98, 4, '#241a2c'); R(416, 140, 98, 4, '#241a2c'); R(416, 60, 4, 80, '#241a2c'); R(510, 60, 4, 80, '#241a2c'); R(462, 60, 4, 80, '#241a2c');
      R(478, 76, 14, 14, '#efeadb');
      // neon heart
      F.neon(cx, '♥ LIVE ♥', 140, 70, 2, '#ff5df1', t, 1);
      // ring light + phone
      const pulse = 0.75 + Math.abs(Math.sin(t / 600)) * 0.25;
      cx.globalAlpha = pulse;
      R(210, 120, 80, 10, '#fff2d9'); R(210, 200, 80, 10, '#fff2d9'); R(200, 130, 10, 70, '#fff2d9'); R(290, 130, 10, 70, '#fff2d9');
      cx.globalAlpha = 1;
      glow(250, 165, 90, '#fff2d9', 0.16 * pulse);
      R(246, 150, 12, 26, '#222'); R(248, 154, 8, 18, '#3af');
      R(246, 210, 8, 90, '#333'); R(232, 296, 36, 6, '#333');
      // vanity
      R(480, 190, 120, 14, '#7a4a8a'); R(488, 204, 10, 60, '#5a3a6a'); R(582, 204, 10, 60, '#5a3a6a');
      R(492, 120, 96, 70, '#39424f');
      for (let i = 0; i < 5; i++) { R(494 + i * 20, 112, 8, 8, (Math.floor(t / 300) + i) % 5 ? '#ffe9a3' : '#7a6a3a'); }
      if (!G.flags.roseGiven) { R(540, 168, 4, 24, '#1d6b30'); R(536, 158, 12, 12, '#c22'); R(524, 184, 32, 8, '#8fd6ff'); }
      // clothes rack
      R(60, 160, 4, 130, '#888'); R(160, 160, 4, 130, '#888'); R(60, 158, 104, 4, '#888');
      const rc = ['#ff5df1', '#41f0e0', '#f5c542', '#c22', '#7a5db8'];
      rc.forEach((c, i) => { R(70 + i * 18, 162, 12, 60 + (i % 3) * 14, c); });
      // Roxy
      A.person({ x: 340, y: 316, scale: 1.12, hair: 'long', hairC: '#c93a68', skin: K.skin, top: '#ff5df1', bottom: '#c2258f', dress: 1, lipstick: 1, armsUp: Math.floor(t / 800) % 3 === 0, frame: 0 });
      // stairs down
      for (let i = 0; i < 5; i++) R(20 + i * 10, 300 + i * 14, 60 - i * 8, 14, i % 2 ? '#4c3018' : '#54341c');
    },
    hot() {
      return [
        { name: 'Roxy', syn: ['roxy', 'influencer', 'woman', 'girl', 'lady'], x: 310, y: 240, w: 70, h: 84, wx: 300, wy: 330, talk: talkRoxy, look: "Roxy: 1.2 million followers, hair the color of a fire alarm, and the thousand-yard stare of someone who has read her own comment section.", items: { ring: giveRing, rose: "'That's… my prop rose. You're offering me my own rose. Incredible. Post that.'", spray: "'My breath is contractually perfect, sweetie.'", wine: "'Sponsored by a DIFFERENT wine, sorry.'" } },
        { name: 'ring light', syn: ['ring light', 'light', 'tripod', 'phone'], x: 196, y: 116, w: 108, h: 100, wx: 250, wy: 330, look: "A ring light bright enough to interrogate the sun. The phone in the middle is filming… everything. Wave? Don't wave. Too late, you waved.", use: "You lean into frame and smolder. Roxy, without looking: 'You're in my shot, and also my restraining radius.'" },
        { name: 'prop rose', syn: ['rose', 'vase', 'flower'], when: () => !G.flags.roseGiven, x: 520, y: 150, w: 40, h: 46, wx: 520, wy: 330, look: "A single perfect red rose in a vase, labeled 'PROP — DO NOT TOUCH (THIS MEANS EVERYONE)'.", take: "Roxy, without turning her head: 'Touch the prop rose and lose the hand, sweetie.' You develop a sudden interest in your shoes." },
        { name: 'vanity', syn: ['vanity', 'mirror', 'bulbs'], x: 480, y: 110, w: 122, h: 96, wx: 520, wy: 330, look: "A vanity mirror ringed in bulbs. Taped to the corner: a sticky note reading 'YOU ARE THE BRAND'. Chilling.", use: "You check yourself in Roxy's mirror. The bulbs make even YOU look famous. Dangerous technology." },
        { name: 'clothes rack', syn: ['clothes', 'rack', 'outfits'], x: 56, y: 150, w: 112, h: 140, wx: 130, wy: 330, look: "A rack of outfits in every color that hurts. One garment might be a dress or a warning flag.", take: "Roxy: 'The vintage rack is LOOK, don't LOOT.'" },
        { name: 'stairs down', syn: ['stairs', 'down', 'exit', 'leave'], x: 10, y: 290, w: 90, h: 80, wx: 70, wy: 330, goto: () => E.goto('backroom', 540, 330), look: "Back down to Sal's lair." },
      ];
    },
    hint() {
      if (!G.flags.roseGiven) return E.has('ring') ? "Roxy needs a 'genuinely tacky vintage ring' for her shoot. You literally fished one out of a sink. GIVE RING TO ROXY." : "Roxy needs a tacky ring for her video. Where would a tacky ring end up in a place like Nadine's? (Think: plumbing.)";
      return "You have the rose and the penthouse password. The disco and the Rivers Casino await — taxi's out front.";
    },
  };
  async function talkRoxy() {
    if (G.flags.roseGiven) return E.speak('ROXY', "The ring content? ALREADY VIRAL. You're 'sink ring guy' in three time zones.", "Go use that rose, sink ring guy. And remember the penthouse password: BOLOGNA PONY. Doorman still charges fifty. Everyone's a critic.");
    if (!G.flags.metRoxy) {
      G.flags.metRoxy = true;
      await E.speak('ROXY', "*filming* —and THAT'S why vintage is a LIFESTYLE— *notices you* Oh. A walking before-photo. Hi.",
        "You're in luck: I need a prop for this shoot. A ring. Something ancient and desperate and SPECTACULARLY tacky. The algorithm loves tacky.",
        "Find me one and I'll make it worth your while. I'm basically a fairy godmother with a ring light.");
      return;
    }
    const c = await E.choose('Say to Roxy:', ["'Define tacky.'", "'So… do you come here often?' *wink*", "'Working on the ring thing.'"]);
    if (c === 0) return E.speak('ROXY', "Tacky is a ring that says 'I panicked at a gas station'. Gold-ISH. Stone like a headlight. If a sink drain would reject it, PERFECT.");
    if (c === 1) {
      if (G.flags.minty) return E.speak('ROXY', "*sniffs* Minty. Points for effort, none for material. Sweetie, I've been hit on by three governors. You're not even a mayor.");
      return E.speak('ROXY', "*recoils* Your breath just unfollowed me. Hard pass, distillery-breath.");
    }
    return E.speak('ROXY', "Tick tock, sink ring guy. The algorithm waits for NO ONE.");
  }
  async function giveRing() {
    E.removeItem('ring');
    G.flags.roseGiven = true; G.flags.knowPassword = true;
    await E.speak('ROXY', "*gasps into the camera* PERFECT. Look at this thing. It's ATROCIOUS. It's giving 'proposal at a truck stop'. My followers will WEEP.");
    E.award('roxy_ring', 'prop supplier to the stars');
    await E.speak('ROXY', "As promised, fairy-godmother time. Take the prop rose — romance hardware, single use, works on 60% of hearts 100% of the time.",
      "And a PRO tip: the real party tonight is the PENTHOUSE of the Rivers Casino. Doorman's password is 'BOLOGNA PONY' — don't ask, it's a long story involving a catering mishap.",
      "He'll still charge you a fifty cover, because this economy is a nightmare. Now shoo, I'm rendering.");
    E.addItem('rose'); E.award('rose_get', 'romance hardware');
    await E.think("A rose, a password, and a dream. The disco first? The casino? The night is a buffet, and I brought a plate.");
  }

  /* ═════════ THE ALLEY ═════════ */
  ROOMS.alley = {
    name: "the alley",
    music: 'lounge',
    desc: "The alley behind Nadine's: a dumpster with gravitational pull, a fire escape to nowhere, one philosophical cat, and steam that rises from nothing in particular, for atmosphere.",
    walk: { x0: 40, x1: 600, y0: 306, y1: 368 }, sMin: 1.0, sMax: 1.18,
    spawn: [560, 330],
    draw(t) {
      A.sky(24, 120, 11, -1);
      A.brickWall(0, 60, 250, 250, '#2c2333', '#211a28');
      A.brickWall(390, 60, 250, 250, '#33222b', '#251821');
      bands(250, 90, 140, 220, ['#0a0714', '#0e0a1a']);
      A.skyline(310, 5);
      // fire escape
      for (let i = 0; i < 3; i++) { R(400, 90 + i * 66, 90, 4, '#3a3a44'); R(400, 90 + i * 66, 4, 66, '#3a3a44'); R(486, 90 + i * 66, 4, 66, '#3a3a44'); for (let s = 0; s < 6; s++) R(408 + s * 12, 94 + i * 66 + s * 9, 24, 3, '#32323c'); }
      // ground
      dither(0, 310, 640, 90, '#33313e', '#2a2834', 2);
      // puddle with neon reflection
      R(300, 344, 90, 14, '#141824');
      cx.globalAlpha = 0.5; F.text(cx, "NADINE", 314, 346, 1, '#ff5df1'); cx.globalAlpha = 1;
      // steam vent
      R(280, 330, 30, 6, '#222');
      cx.globalAlpha = 0.14;
      for (let i = 0; i < 3; i++) { const p = ((t / 1600 + i / 3) % 1); R(285 + Math.sin(p * 6) * 6, 330 - p * 80, 20 - p * 8, 14, '#cfcfe0'); }
      cx.globalAlpha = 1;
      // dumpster
      R(90, 250, 150, 70, '#2d5c3a'); dither(90, 250, 150, 70, '#2d5c3a', '#265030', 2);
      R(84, 244, 162, 12, '#224a2c');
      if (G.flags.dumpsterOpen) { R(86, 216, 158, 12, '#224a2c'); R(96, 228, 138, 20, '#101a10'); R(120, 232, 30, 8, '#7a6a3a'); R(170, 234, 24, 6, '#a33'); }
      F.text(cx, "NADINE'S", 128, 276, 1, '#9fe3af');
      R(100, 320, 12, 8, '#222'); R(216, 320, 12, 8, '#222');
      // trash can + cat
      R(470, 288, 40, 44, '#4a4a55'); R(466, 284, 48, 8, '#3c3c46');
      const blink = Math.floor(t / 2400) % 5 === 0;
      R(478, 262, 24, 20, '#22202a');
      R(478, 256, 6, 8, '#22202a'); R(496, 256, 6, 8, '#22202a');
      if (!blink) { R(482, 268, 4, 3, '#f5c542'); R(494, 268, 4, 3, '#f5c542'); }
      const tail = Math.sin(t / 500) * 8;
      R(500 + tail / 2, 272, 12, 3, '#22202a');
      // bar back door
      A.doorway(556, 210, 46, 100, '#2a1a10', '#4c3018'); F.text(cx, 'STAFF', 562, 194, 1, '#c9b45a');
      // to street
      F.text(cx, '← STREET', 8, 290, 1, '#8d8798');
    },
    hot() {
      return [
        { name: 'dumpster', syn: ['dumpster', 'trash', 'garbage', 'bin'], x: 84, y: 214, w: 162, h: 110, wx: 180, wy: 332, use: searchDumpster, search: searchDumpster, take: searchDumpster, open: searchDumpster, look: () => E.say(G.flags.gotCard ? "The dumpster has given you all it has to give. Respect the dumpster." : "A green dumpster radiating mystery and casserole. High rollers from the disco allegedly rage-toss valuables in here. Allegedly."), climb: dumpsterDeath, goto: undefined },
        { name: 'cat', syn: ['cat', 'kitty', 'alley cat'], x: 466, y: 250, w: 56, h: 36, wx: 470, wy: 332, look: "An alley cat with the bearing of a retired jazz musician. It has seen every mistake this alley has hosted, including several of its own.", talk: petCat, use: petCat, pet: petCat },
        { name: 'fire escape', syn: ['fire escape', 'ladder', 'stairs'], x: 396, y: 84, w: 100, h: 210, remote: true, look: "A fire escape zigzagging up to a window that has been painted shut since the moon landing.", use: "You give the ladder a tug. It gives a shriek of rust that scatters three pigeons and your nerve.", climb: () => E.say("You climb two rungs, remember your suit is DRY CLEAN ONLY, and climb back down. Priorities.") },
        { name: 'steam vent', syn: ['steam', 'vent'], x: 270, y: 300, w: 50, h: 40, remote: true, look: "Steam rises from the grate. From WHAT? Unclear. The city just produces steam. It's a feature." },
        { name: 'puddle', syn: ['puddle', 'water'], x: 296, y: 340, w: 98, h: 20, remote: true, look: "A puddle reflecting Nadine's neon, which is honestly the most flattering way to view Nadine's." },
        { name: 'staff door', syn: ['door', 'staff', 'bar'], x: 552, y: 200, w: 54, h: 114, wx: 560, wy: 330, goto: () => { SFX.door(); E.goto('bar', 80, 330); }, look: "Nadine's staff door. 'Staff' is generous — it's the bartender and a mop." },
        { name: 'to the street', syn: ['street', 'exit', 'leave'], x: 0, y: 240, w: 36, h: 130, wx: 50, wy: 330, goto: () => E.goto('street', 92, 322), look: "East Carson Street glitters at the mouth of the alley. 'Glitters' is also generous." },
      ];
    },
    cmds: [
      { re: /^(climb|jump)( in| into)?( the)? dumpster$/, fn: dumpsterDeath },
      { re: /^pet( the)? cat$/, fn: petCat },
    ],
    hint() {
      if (!G.flags.gotCard) return "Roxy's tip: a high roller trashed his PLATINUM DISCO CARD in a dumpster around here. Search it. Maybe twice — treasure sinks.";
      return "Platinum card in hand — the disco's velvet rope means nothing to you now. Grab a taxi on the street.";
    },
  };
  async function searchDumpster() {
    if (G.flags.gotCard) return E.say("You've extracted everything of value. What remains is a civic problem.");
    if (!G.flags.dumpsterOpen) {
      G.flags.dumpsterOpen = true; SFX.thunk();
      return E.say("You heave the lid open. The smell files a restraining order.", "First pass: a toupee (warm — don't think about it), a bowling trophy for 'MOST IMPROVED ATTITUDE', and a VHS labeled 'WEDDING (DO NOT PLAY)'.", "There's… more under there. You can feel it. Search again if your soul can take it.");
    }
    G.flags.gotCard = true; SFX.fanfare();
    await E.say("You go in DEEP. Elbow deep. Career deep.", "Your fingers close on laminated plastic: a PLATINUM CARD for DISCO INFERNO, member name 'CHAD THUNDER'.", "Under it, a receipt for one (1) emotional support cheeseburger. Chad had a rough night. Chad's loss is your entire future.");
    E.addItem('card'); E.award('card_find', 'dumpster archaeology');
    await E.think("Tonight, I'm Chad Thunder. Chad Thunder gets into places.");
  }
  async function dumpsterDeath() {
    if (G.room !== 'alley') return E.say("Blessedly, there is no dumpster here.");
    await E.die('DIED AS HE LIVED: IN GARBAGE',
      "You climb ALL the way in, because searching from outside was 'inefficient'.",
      "The lid slams. Muffled, from outside: the cheerful beeping of a garbage truck arriving ahead of schedule for the first time in municipal history.",
      "CRUNCH. You are now 30% more compact and 100% more recycled.");
  }
  async function petCat() {
    if (G.room !== 'alley') return E.say("No cat here. The universe apologizes.");
    SFX.purr(); E.award('egg_cat', 'friend of cats');
    return E.say("You offer a respectful hand. The cat headbutts it once — a full endorsement by alley standards.", "For three warm seconds, you are somebody's favorite. The cat then remembers it has a meeting.");
  }
})();
