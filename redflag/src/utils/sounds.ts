// Simple sound effects using Web Audio API — no external files needed

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playSwipeAccept() {
  playTone(523, 0.1, 'sine', 0.12);          // C5
  setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 80);  // E5
  setTimeout(() => playTone(784, 0.15, 'sine', 0.12), 160); // G5
}

export function playSwipeReject() {
  playTone(330, 0.15, 'square', 0.08);        // E4
  setTimeout(() => playTone(262, 0.2, 'square', 0.08), 100); // C4
}

export function playFlipReveal() {
  playTone(440, 0.08, 'triangle', 0.1);       // A4
  setTimeout(() => playTone(550, 0.08, 'triangle', 0.1), 60);
}

export function playGreenFlag() {
  playTone(523, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 100);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.15), 200);
  setTimeout(() => playTone(1047, 0.2, 'sine', 0.15), 300);
}

export function playResults() {
  const notes = [523, 587, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.1), i * 120);
  });
}
