// Procedural Audio Synthesizer using Web Audio API
// This avoids downloading heavy audio files and guarantees instant loading.

let audioCtx = null;
let bgmInterval = null;
let bgmGain = null;
let filterNode = null;
let isPlayingBGM = false;

const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]; // C Major Pentatonic (C4 to A5)
let noteIndex = 0;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  // Initialize and start background music loop
  startBGM: () => {
    try {
      const ctx = getAudioContext();
      if (isPlayingBGM) return;

      // 1. Create Nodes
      bgmGain = ctx.createGain();
      bgmGain.gain.setValueAtTime(0.04, ctx.currentTime); // Very soft background level

      filterNode = ctx.createBiquadFilter();
      filterNode.type = "lowpass";
      filterNode.frequency.setValueAtTime(800, ctx.currentTime); // Soft warm tone

      // Connections: Synth -> Filter -> Volume Gain -> Speakers
      filterNode.connect(bgmGain);
      bgmGain.connect(ctx.destination);

      isPlayingBGM = true;

      // 2. Music Sequencer Loop (Plays a note every 0.4 seconds)
      const tempo = 400; // ms
      bgmInterval = setInterval(() => {
        if (ctx.state === "suspended") return;

        // Generate arpeggiating note index
        const noteFreq = pentatonicScale[noteIndex];
        
        // Custom simple synthesizer note
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        osc.type = "triangle"; // Warm retro wind-chime style
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
        
        // ADSR Envelope (Attack & Decay)
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05); // Attack
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35); // Decay/Sustain

        osc.connect(noteGain);
        noteGain.connect(filterNode);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        // Sequence walking step
        noteIndex = (noteIndex + 1) % pentatonicScale.length;
        if (Math.random() > 0.7) {
          noteIndex = Math.floor(Math.random() * pentatonicScale.length); // Randomize occasionally for variety
        }
      }, tempo);
    } catch (e) {
      console.error("Failed to start Web Audio BGM:", e);
    }
  },

  // Stop background music loop
  stopBGM: () => {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    if (bgmGain) {
      try {
        bgmGain.disconnect();
      } catch (e) {}
      bgmGain = null;
    }
    isPlayingBGM = false;
  },

  // Play chirpy coin-harvest sound effect (Clash of Clans style!)
  playCollectSFX: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      // Sweep frequency upwards quickly: 400Hz to 1200Hz (creates a cute slide/chirp)
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn("SFX failed:", e);
    }
  },

  // Play soft button click/tap sound effect
  playClickSFX: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.08);

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("SFX failed:", e);
    }
  }
};
