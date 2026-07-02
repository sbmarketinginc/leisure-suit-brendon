/* ── audio: an original lounge/disco soundtrack + sfx, all WebAudio ── */
let AC = null, MASTER = null, MUTED = false;
try { MUTED = localStorage.getItem('lsb_mute') === '1'; } catch (e) { }

function audioInit() {
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    MASTER = AC.createGain();
    MASTER.gain.value = MUTED ? 0 : 0.5;
    MASTER.connect(AC.destination);
    MUS._start();
  } catch (e) { AC = null; }
}
function audioToggle() {
  MUTED = !MUTED;
  try { localStorage.setItem('lsb_mute', MUTED ? '1' : '0'); } catch (e) { }
  if (MASTER) MASTER.gain.value = MUTED ? 0 : 0.5;
  return !MUTED;
}

const N = m => 440 * Math.pow(2, (m - 69) / 12);
let NOISE = null;
function noiseBuf() {
  if (NOISE || !AC) return NOISE;
  NOISE = AC.createBuffer(1, AC.sampleRate * 0.4, AC.sampleRate);
  const d = NOISE.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return NOISE;
}
function vOsc(type, freq, t, dur, vol, dest, freqEnd) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(dest || MASTER);
  o.start(t); o.stop(t + dur + 0.02);
}
function vNoise(t, dur, vol, freq = 6000, q = 1) {
  const s = AC.createBufferSource(); s.buffer = noiseBuf();
  const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  const g = AC.createGain();
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s.connect(f); f.connect(g); g.connect(MASTER);
  s.start(t); s.stop(t + dur + 0.02);
}

/* ---------- music sequencer ---------- */
const SONGS = {
  //           bass (16 steps of midi, 0=rest)                                kick             hat pattern      lead
  lounge: { bpm: 96, sw: 0.28, bass: [45, 0, 48, 0, 52, 0, 48, 0, 43, 0, 47, 0, 50, 0, 47, 0], kick: [], hat: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0], lead: [0, 0, 0, 0, 76, 0, 0, 74, 0, 0, 0, 0, 71, 0, 0, 0], leadEvery: 4 },
  disco: { bpm: 122, sw: 0, bass: [45, 57, 45, 57, 48, 60, 48, 60, 43, 55, 43, 55, 50, 62, 50, 62], kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1], lead: [69, 0, 0, 72, 0, 74, 0, 0, 76, 0, 74, 0, 72, 0, 69, 0], leadEvery: 2 },
  casino: { bpm: 108, sw: 0.22, bass: [40, 0, 43, 44, 45, 0, 43, 0, 40, 0, 43, 44, 45, 0, 48, 47], kick: [], hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], lead: [0, 0, 0, 0, 0, 0, 79, 0, 0, 0, 0, 0, 76, 0, 0, 0], leadEvery: 4 },
  chapel: { bpm: 76, sw: 0, bass: [41, 0, 0, 0, 45, 0, 0, 0, 48, 0, 0, 0, 45, 0, 0, 0], kick: [], hat: [], lead: [65, 0, 0, 0, 69, 0, 0, 0, 72, 0, 0, 0, 69, 0, 0, 0], leadEvery: 1, pad: 1 },
  suite: { bpm: 72, sw: 0.3, bass: [38, 0, 0, 0, 41, 0, 0, 0, 43, 0, 0, 0, 41, 0, 0, 0], kick: [], hat: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], lead: [], leadEvery: 1 },
  penthouse: { bpm: 92, sw: 0.26, bass: [43, 0, 47, 0, 50, 0, 47, 0, 48, 0, 52, 0, 55, 0, 52, 0], kick: [], hat: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0], lead: [0, 0, 0, 0, 0, 0, 74, 0, 0, 0, 0, 0, 79, 0, 78, 0], leadEvery: 2 },
  finale: { bpm: 100, sw: 0.1, bass: [48, 0, 52, 0, 55, 0, 52, 0, 53, 0, 57, 0, 60, 0, 57, 0], kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], lead: [72, 0, 76, 0, 79, 0, 76, 0, 77, 0, 81, 0, 84, 0, 81, 0], leadEvery: 1 },
};
const MUS = (() => {
  let cur = 'lounge', step = 0, nextT = 0, iv = null, bar = 0;
  function _start() {
    if (iv || !AC) return;
    nextT = AC.currentTime + 0.1;
    iv = setInterval(() => {
      if (!AC) return;
      while (nextT < AC.currentTime + 0.3) { schedule(nextT); }
    }, 110);
  }
  function schedule(t) {
    const s = SONGS[cur] || SONGS.lounge;
    const spb = 60 / s.bpm / 2;
    const swing = (step % 2) ? s.sw * spb : 0;
    const tt = t + swing;
    const b = s.bass[step % 16];
    if (b) vOsc('triangle', N(b), tt, spb * 1.7, 0.16);
    if (s.kick[step % 16]) vOsc('sine', 120, tt, 0.11, 0.32, MASTER, 42);
    if (s.hat[step % 16]) vNoise(tt, 0.04, 0.05, 8000, 1.4);
    const l = s.lead[step % 16];
    if (l && (bar % (s.leadEvery || 1) === 0)) {
      if (s.pad) { vOsc('sine', N(l), tt, spb * 3.4, 0.06); vOsc('sine', N(l) * 1.005, tt, spb * 3.4, 0.05); vOsc('sine', N(l - 12), tt, spb * 3.4, 0.04); }
      else vOsc('square', N(l), tt, spb * 0.9, 0.035);
    }
    step++; if (step % 16 === 0) bar++;
    nextT += spb;
  }
  function set(name) {
    if (SONGS[name]) cur = name;
  }
  function sting(kind) {
    if (!AC || MUTED) return;
    const t = AC.currentTime;
    if (kind === 'death') {
      [64, 62, 60, 56].forEach((m, i) => vOsc('sawtooth', N(m), t + i * 0.22, 0.3, 0.10, MASTER, N(m) - 12));
      vNoise(t + 0.9, 0.5, 0.06, 300, 0.7);
    }
  }
  return { set, sting, _start };
})();

/* ---------- sound effects ---------- */
const SFX = (() => {
  const ok = () => AC && !MUTED;
  const t0 = () => AC.currentTime;
  return {
    blip(f = 300, d = 0.05) { if (ok()) vOsc('square', f, t0(), d, 0.05); },
    score() { if (!ok()) return; [72, 76, 79, 84].forEach((m, i) => vOsc('square', N(m), t0() + i * 0.07, 0.09, 0.06)); },
    pay() { if (!ok()) return; vOsc('square', 220, t0(), 0.08, 0.06); vOsc('square', 165, t0() + 0.09, 0.12, 0.06); },
    cash() { if (!ok()) return; vNoise(t0(), 0.05, 0.1, 5000, 1); vOsc('square', N(88), t0() + 0.05, 0.12, 0.07); vOsc('square', N(93), t0() + 0.12, 0.16, 0.07); },
    pickup() { if (!ok()) return; vOsc('square', 500, t0(), 0.06, 0.06); vOsc('square', 750, t0() + 0.06, 0.09, 0.06); },
    door() { if (!ok()) return; vNoise(t0(), 0.16, 0.12, 300, 0.8); vOsc('triangle', 90, t0(), 0.14, 0.12); },
    knock() { if (!ok()) return; vNoise(t0(), 0.06, 0.2, 900, 1.5); vNoise(t0() + 0.18, 0.06, 0.2, 800, 1.5); },
    pour() { if (!ok()) return; vNoise(t0(), 0.5, 0.06, 3000, 0.6); vNoise(t0() + 0.1, 0.35, 0.05, 1800, 0.8); },
    splash() { if (!ok()) return; vNoise(t0(), 0.3, 0.09, 2200, 0.7); },
    splashBig() { if (!ok()) return; vNoise(t0(), 0.5, 0.16, 1400, 0.6); vOsc('sine', 200, t0(), 0.2, 0.08, MASTER, 60); },
    flush() { if (!ok()) return; vNoise(t0(), 1.1, 0.12, 900, 0.5); vOsc('sine', 300, t0(), 1.0, 0.04, MASTER, 60); },
    spray() { if (!ok()) return; vNoise(t0(), 0.35, 0.14, 9000, 1.2); },
    purr() { if (!ok()) return; for (let i = 0; i < 6; i++) vOsc('triangle', 55, t0() + i * 0.09, 0.07, 0.10); },
    thunk() { if (!ok()) return; vOsc('sine', 120, t0(), 0.12, 0.2, MASTER, 50); vNoise(t0(), 0.1, 0.1, 500, 1); },
    fanfare() { if (!ok()) return; [72, 76, 79, 84, 79, 84].forEach((m, i) => vOsc('square', N(m), t0() + i * 0.09, 0.14, 0.06)); },
    bell() { if (!ok()) return; vOsc('sine', 1568, t0(), 0.5, 0.1); vOsc('sine', 2350, t0(), 0.3, 0.04); },
    buzz() { if (!ok()) return; vOsc('sawtooth', 110, t0(), 0.25, 0.09); vOsc('sawtooth', 116, t0(), 0.25, 0.09); },
    ding() { if (!ok()) return; vOsc('sine', 988, t0(), 0.4, 0.09); vOsc('sine', 1319, t0() + 0.12, 0.5, 0.08); },
    phone() { if (!ok()) return; for (let i = 0; i < 8; i++) vOsc('square', i % 2 ? 440 : 480, t0() + i * 0.05, 0.045, 0.05); },
    organ() { if (!ok()) return; [53, 57, 60, 65].forEach(m => { vOsc('sine', N(m), t0(), 1.2, 0.05); vOsc('sine', N(m) * 2.01, t0(), 1.2, 0.02); }); },
    intercom() { if (!ok()) return; vOsc('square', 800, t0(), 0.06, 0.1); vNoise(t0() + 0.06, 0.4, 0.03, 4000, 0.4); },
    car() { if (!ok()) return; vOsc('sawtooth', 70, t0(), 0.7, 0.08, MASTER, 140); vNoise(t0(), 0.6, 0.04, 800, 0.5); },
    spin() { if (!ok()) return; for (let i = 0; i < 14; i++) vNoise(t0() + i * 0.09, 0.03, 0.05, 3000 + (i % 3) * 800, 2); },
    jingle() { if (!ok()) return; [76, 79, 84, 88, 91].forEach((m, i) => vOsc('square', N(m), t0() + i * 0.08, 0.12, 0.06)); },
    card() { if (!ok()) return; vNoise(t0(), 0.05, 0.12, 2500, 1.8); },
  };
})();
