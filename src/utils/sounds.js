// Web Audio API — keine externe Bibliothek nötig
let ctx = null;
let bgNode = null;
let bgGain = null;
let muted = false;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function play(notes, type = "sine") {
  if (muted) return;
  try {
    const c = getCtx();
    notes.forEach(([freq, start, dur, vol = 0.3]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.connect(gain);
      gain.connect(c.destination);
      osc.frequency.setValueAtTime(freq, c.currentTime + start);
      gain.gain.setValueAtTime(vol, c.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
      osc.start(c.currentTime + start);
      osc.stop(c.currentTime + start + dur + 0.01);
    });
  } catch (e) {}
}

export function playCorrect() {
  play([[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.3, 0.25]]);
}

export function playWrong() {
  play([[300, 0, 0.15, 0.25], [220, 0.15, 0.25, 0.2]], "sawtooth");
}

export function playTick() {
  play([[900, 0, 0.04, 0.06]]);
}

export function playTyping() {
  if (muted) return;
  try {
    const c = getCtx();
    const freq = 400 + Math.random() * 200;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.connect(gain);
    gain.connect(c.destination);
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(0.04, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.05);
  } catch (e) {}
}

export function playCountdownTick() {
  play([[440, 0, 0.08, 0.08]]);
}

export function playMissionStart() {
  play([
    [261, 0, 0.15, 0.2],
    [329, 0.15, 0.15, 0.2],
    [392, 0.3, 0.15, 0.2],
    [523, 0.45, 0.4, 0.25],
  ]);
}

export function playVictory() {
  play([
    [523, 0, 0.1, 0.3],
    [659, 0.1, 0.1, 0.3],
    [784, 0.2, 0.1, 0.3],
    [1046, 0.3, 0.5, 0.25],
  ]);
}

// Hintergrundmusik — leises Drone-Ambient
export function startAmbient() {
  if (muted) return;
  try {
    stopAmbient();
    const c = getCtx();
    bgGain = c.createGain();
    bgGain.gain.setValueAtTime(0.04, c.currentTime);
    bgGain.connect(c.destination);

    const freqs = [55, 82.4, 110, 164.8];
    freqs.forEach(f => {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, c.currentTime);
      osc.connect(bgGain);
      osc.start();
      bgNode = osc;
    });
  } catch (e) {}
}

export function stopAmbient() {
  try { bgNode?.stop(); } catch (e) {}
  bgNode = null;
  bgGain = null;
}

export function toggleMute() {
  muted = !muted;
  if (muted) stopAmbient();
  return muted;
}

export function isMuted() { return muted; }

export function playMatchConnect() {
  play([[880, 0, 0.05, 0.18], [1320, 0.04, 0.1, 0.14]]);
}

export function playAllAnswered() {
  play([
    [880,  0,    0.1, 0.2],
    [1100, 0.12, 0.1, 0.2],
    [1320, 0.24, 0.4, 0.18],
  ]);
}
