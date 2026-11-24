#!/usr/bin/env node
// Generate the original island exploration WAVs. Pass an output directory to export elsewhere.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RATE = 44100;
const TAU = 2 * Math.PI;
const destination = resolve(process.argv[2] ?? fileURLToPath(new URL("../audio/exploration/", import.meta.url)));
const effects = {
  chop: {
    duration: 0.24,
    tones: [
      { seconds: 0.13, from: 214, to: 82, gain: 0.65, decay: 6, harmonic: 0.25 },
      { start: 0.09, seconds: 0.09, from: 610, to: 270, gain: 0.12, decay: 5 },
    ],
    noises: [
      { seconds: 0.075, gain: 0.75, brightness: 0.32, decay: 7 },
      { start: 0.065, seconds: 0.13, gain: 0.33, brightness: 0.43, decay: 6 },
    ],
  },
  mine: {
    duration: 0.36,
    tones: [
      { seconds: 0.28, from: 1279, gain: 0.32, harmonic: 0.26, decay: 6 },
      { seconds: 0.20, from: 2003, gain: 0.20, decay: 8 },
      { seconds: 0.12, from: 310, to: 138, gain: 0.40, decay: 6 },
    ],
    noises: [
      { seconds: 0.10, gain: 0.82, brightness: 0.67, decay: 7 },
      { start: 0.10, seconds: 0.13, gain: 0.18, brightness: 0.53, decay: 6 },
    ],
  },
  pickup: {
    duration: 0.20,
    tones: [
      { seconds: 0.067, from: 493.9, to: 740, gain: 0.38, decay: 2, harmonic: 0.14 },
      { start: 0.052, seconds: 0.125, from: 987.8, gain: 0.40, decay: 4, harmonic: 0.14 },
    ],
  },
  "craft-complete": {
    duration: 0.46,
    tones: [
      { seconds: 0.20, from: 392, gain: 0.44, decay: 4, harmonic: 0.38 },
      { start: 0.075, seconds: 0.22, from: 523.25, gain: 0.38, decay: 4, harmonic: 0.27 },
      { start: 0.15, seconds: 0.27, from: 659.25, gain: 0.35, decay: 4, harmonic: 0.23 },
      { start: 0.15, seconds: 0.14, from: 1318.5, gain: 0.13, decay: 5 },
    ],
  },
  "land-unlock": {
    duration: 0.92,
    tones: [
      { seconds: 0.16, from: 255, to: 135, gain: 0.31, decay: 4 },
      { start: 0.08, seconds: 0.30, from: 349.23, gain: 0.36, harmonic: 0.21, decay: 3 },
      { start: 0.17, seconds: 0.30, from: 523.25, gain: 0.35, harmonic: 0.17, decay: 3 },
      { start: 0.26, seconds: 0.33, from: 698.46, gain: 0.32, harmonic: 0.21, decay: 3 },
      { start: 0.36, seconds: 0.51, from: 880, gain: 0.35, harmonic: 0.18, decay: 3 },
      { start: 0.39, seconds: 0.38, from: 1046.5, gain: 0.16, harmonic: 0.19, decay: 3 },
    ],
    noises: [{ seconds: 0.28, gain: 0.20, brightness: 0.55, attack: 0.035, decay: 4 }],
  },
};

function mixVoice(out, voice, oscillator) {
  const { start = 0, seconds, gain, attack = 0.004, decay } = voice;
  const offset = Math.round(start * RATE);
  for (let i = 0; i < Math.round(seconds * RATE) && offset + i < out.length; i++) {
    const t = i / RATE;
    const envelope = Math.min(1, t / attack) * Math.min(1, (seconds - t) / 0.025) * Math.exp(-decay * t / seconds);
    out[offset + i] += oscillator(t) * envelope * gain;
  }
}

function synthesize({ duration, tones, noises = [] }) {
  const out = new Float32Array(Math.round(duration * RATE));
  for (const tone of tones) {
    const { from, to = from, seconds, harmonic = 0 } = tone;
    mixVoice(out, tone, (t) => {
      const phase = TAU * (from * t + (to - from) * t * t / (2 * seconds));
      return Math.sin(phase) + harmonic * Math.sin(phase * 2.01);
    });
  }
  let seed = 9519;
  for (const noise of noises) {
    let filtered = 0;
    mixVoice(out, noise, () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      filtered += (seed / 0x80000000 - 1 - filtered) * noise.brightness;
      return filtered;
    });
  }
  return out;
}

function encodeWav(samples) {
  const bytes = samples.length * 2;
  const wav = Buffer.alloc(44 + bytes);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + bytes, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(RATE, 24);
  wav.writeUInt32LE(RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(bytes, 40);
  const peak = samples.reduce((max, sample) => Math.max(max, Math.abs(sample)), 0);
  const normalization = 0.79 * 32767 / peak;
  for (let i = 0; i < samples.length; i++) wav.writeInt16LE(Math.round(samples[i] * normalization), 44 + i * 2);
  return wav;
}

mkdirSync(destination, { recursive: true });
for (const [name, recipe] of Object.entries(effects)) {
  writeFileSync(join(destination, `${name}.wav`), encodeWav(synthesize(recipe)));
}
console.log(`${Object.keys(effects).length} WAVs -> ${destination}`);
