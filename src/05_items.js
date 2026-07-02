/* ── score ledger: exactly 222 points, as tradition demands ── */
Object.assign(PTS, {
  whiskey_buy: 3, drunk_whiskey: 8, ring_take: 3, graffiti: 4, wash_hands: 2,
  password: 6, tv_shop: 10, roxy_ring: 8, rose_get: 4, card_find: 8,
  buy_spray: 2, buy_wine: 2, buy_mag: 2, buy_apple: 2, buy_prot: 5,
  bouncer_in: 5, dawn_meet: 3, dawn_drink: 4, dawn_rose: 6, dance: 8,
  propose: 5, wed: 6, escape_bed: 10, marge: 2,
  slots_win: 4, bj_win: 4, bank_50: 6,
  grace_mag: 8, keycard: 6, ph_password: 5, ph_cover: 3,
  eva_spray: 4, eva_apple: 8, eva_wine: 8, eva_talk1: 5, eva_talk2: 5, eva_talk3: 5,
  finale: 20,
  egg_jukebox: 2, egg_mirror: 1, egg_flush: 1, egg_cat: 1, egg_tip: 2, egg_scope: 2, egg_jackpot: 4,
});

/* ── inventory items ── */
const ITEMS = {
  whiskey: {
    name: 'whiskey', syn: ['drink', 'booze', 'glass', 'shot'],
    desc: "One well whiskey, mostly whiskey. Nadine calls it 'the house pour'. The house should apologize.",
    icon: g => { g('#c47a1e', 7, 10, 10, 10); g('#e8a33d', 8, 11, 8, 4); g('#dfe6ee', 6, 8, 12, 2); g('#dfe6ee', 6, 8, 2, 12); g('#dfe6ee', 16, 8, 2, 12); g('#dfe6ee', 6, 19, 12, 2); },
    verbs: {
      drink: async () => {
        await E.say("You raise the glass… then remember it's a NEGOTIATING ASSET. Somewhere in this bar is a man who'd trade state secrets for it.");
        const c = await E.choose('Drink it anyway?', ['Down the hatch!', 'No. Business before pleasure.']);
        if (c === 0) { E.removeItem('whiskey'); await E.say("Smooth, like gravel in a blender. Well… Nadine's can always pour another, for a price.", "Your breath is now a registered weapon."); G.flags.boozeBreath = true; }
        else await E.say("Restraint! From YOU! The night is full of surprises.");
      }
    }
  },
  remote: {
    name: 'TV remote', syn: ['remote', 'control', 'clicker', 'tv'],
    desc: "A greasy universal remote. The CHANNEL button gleams with destiny (and hot sauce).",
    icon: g => { g('#3a3a44', 7, 5, 10, 15); g('#c33', 9, 7, 3, 3); g('#3c3', 13, 7, 3, 3); g('#888', 9, 12, 7, 2); g('#888', 9, 15, 7, 2); },
    verbs: { use: () => E.say("You click it at the sky. The moon fails to change channel. It needs a TELEVISION — say, one hypnotizing a large man near a staircase.") }
  },
  ring: {
    name: 'cheap ring', syn: ['ring', 'jewelry', 'diamond'],
    desc: "A 'diamond' ring from a sink. The stone is cubic zirconia's less successful cousin. It is MAGNIFICENTLY tacky.",
    icon: g => { g('#f5c542', 8, 12, 8, 8); g('#0b0b13', 10, 14, 4, 4); g('#bfefff', 10, 6, 4, 4); g('#fff', 11, 7, 2, 2); g('#bfefff', 11, 3, 2, 2); g('#bfefff', 7, 8, 2, 2); g('#bfefff', 15, 8, 2, 2); },
    verbs: { wear: () => E.say("You try it on. Your finger turns green almost immediately. It's not jewelry, it's a chemistry experiment."), }
  },
  rose: {
    name: 'red rose', syn: ['rose', 'flower'],
    desc: "A single red rose, professional romance equipment. Slightly used in one (1) influencer video.",
    icon: g => { g('#1d6b30', 11, 10, 2, 12); g('#1d6b30', 9, 14, 3, 2); g('#c22', 8, 4, 8, 7); g('#f55', 10, 5, 4, 3); },
    verbs: { smell: () => E.say("Smells like romance and faintly of ring-light ozone.") }
  },
  card: {
    name: 'platinum disco card', syn: ['card', 'platinum', 'membership', 'pass'],
    desc: "PLATINUM member card for DISCO INFERNO, issued to 'Chad Thunder'. Tonight, YOU are Chad Thunder. Smells like the dumpster it came from.",
    icon: g => { g('#cfd6de', 4, 8, 16, 10); g('#8a94a0', 4, 8, 16, 3); g('#f5c542', 6, 13, 8, 2); g('#555', 6, 16, 12, 1); },
  },
  spray: {
    name: 'breath spray', syn: ['spray', 'breath', 'mint', 'binaca'],
    desc: "'ARCTIC BLAST' breath spray. Warning label: 'Do not use near open flame or open hearts.'",
    icon: g => { g('#2fae5f', 9, 8, 6, 13); g('#ddd', 10, 5, 4, 3); g('#fff', 11, 4, 2, 1); g('#e8ffe8', 10, 11, 4, 6); },
    verbs: {
      use: sprayBreath, spray: sprayBreath,
    }
  },
  wine: {
    name: 'bottle of wine', syn: ['wine', 'bottle', 'chateau'],
    desc: "Château Persuasion, vintage 'recent'. The label says 'notes of oak'. The oak is the cork.",
    icon: g => { g('#1d4d2b', 9, 6, 6, 15); g('#1d4d2b', 10, 3, 4, 4); g('#722', 10, 2, 4, 2); g('#f7f3e6', 9, 12, 6, 5); g('#722', 10, 13, 4, 1); },
    verbs: { drink: () => E.say("Alone? From the bottle? No. This wine has a DESTINY. A classy, rooftop-shaped destiny.") }
  },
  mag: {
    name: 'gossip magazine', syn: ['magazine', 'mag', 'gossip', 'tabloid'],
    desc: "'STEEL CITY CONFIDENTIAL' — celebrity gossip so hot the pages are legally an open flame.",
    icon: g => { g('#f7f3e6', 6, 4, 12, 16); g('#c33', 6, 4, 12, 4); g('#f5c542', 8, 10, 8, 6); g('#333', 8, 17, 8, 1); },
    verbs: {
      read: async () => {
        G.flags.readMag = true;
        await E.say(
          "'STEEL CITY CONFIDENTIAL' — you read it cover to cover in the classic way: quickly, and for the articles.",
          "PAGE 6: 'GRACE, legendary front-desk queen of the Rivers Casino, hasn't taken a break in THREE YEARS. Sources say only two things exist for her: that desk, and celebrity gossip she hasn't read yet.'",
          "PAGE 9: 'POLYESTER: the fabric that fights back.' Inspiring stuff.");
        E.think("So the Rivers Casino receptionist would trade her own desk bell for fresh gossip. Noted.");
      }
    }
  },
  apple: {
    name: 'apple', syn: ['apple', 'fruit'],
    desc: "One perfect red apple. In a town of neon and regret, it might be the only honest object for miles.",
    icon: g => { g('#c22', 7, 8, 10, 11); g('#f55', 9, 10, 3, 3); g('#5a3b20', 11, 5, 2, 4); g('#1d6b30', 13, 5, 4, 3); },
    verbs: { eat: async () => { await E.say("You polish it on your lapel… and put it back. Some healthy rooftop-dwelling stranger might value this more than you value snacking."); } }
  },
  prot: {
    name: "'protection'", syn: ['protection', 'lubber', 'lubbers', 'wallet item'],
    desc: "A discreet foil square, brand name 'OPTIMIST'. You bought it out of hope. Hope, and a public address system.",
    icon: g => { g('#7a5db8', 7, 7, 10, 10); g('#a88fe0', 8, 8, 8, 8); g('#fff', 11, 10, 2, 4); g('#fff', 10, 11, 4, 2); },
    verbs: { wear: () => E.say("Not here. Not now. Possibly not ever, but a gentleman prepares."), use: () => E.say("Its time may come. Tonight it remains, like you: sealed, hopeful, slightly crushed.") }
  },
  keycard: {
    name: 'penthouse keycard', syn: ['keycard', 'key', 'elevator card'],
    desc: "Gold elevator keycard stamped 'PH — RIVERS CASINO'. Warm to the touch, like ambition.",
    icon: g => { g('#f5c542', 4, 8, 16, 10); g('#b98a1e', 4, 8, 16, 3); g('#fff', 6, 13, 6, 2); g('#333', 6, 16, 12, 1); },
  },
  note: {
    name: "Dawn's note", syn: ['note', 'letter', 'paper'],
    desc: "Hotel stationery, lipstick-kissed.",
    icon: g => { g('#f7f3e6', 6, 5, 12, 14); g('#c22', 9, 8, 6, 3); g('#333', 8, 13, 8, 1); g('#333', 8, 15, 8, 1); },
    verbs: {
      read: () => E.say("'Dearest B — the wedding was magical, the credit cards were maxable. Don't take it personally: I'm a gold digger, you were more of a bronze situation. Kisses! — Dawn ♥'", "There's a P.S.: 'The minibar counts as community property. I took the community.'")
    }
  },
};
async function sprayBreath() {
  G.flags.minty = true; SFX.spray();
  await E.say("PSSHHT. Arctic Blast deployed. Your breath could now legally officiate a wedding in Switzerland.");
  if (G.room === 'penthouse') E.award('eva_spray', 'minty fresh');
}
