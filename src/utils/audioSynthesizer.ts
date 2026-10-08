/**
 * Romantic Acoustic Guitar / Ambient Music Synthesizer (Web Audio API)
 * Generates an emotional, warm, romantic acoustic progression (C - G/B - Am - F - C/E - Dm7 - G)
 * so music can play seamlessly out-of-the-box in any browser without needing external assets.
 */

class RomanticSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private tempo: number = 72; // Romantic and slow (BPM)
  private currentStep: number = 0;

  // Romantic chord progression in Hertz (Acoustic guitar / gentle electric piano voicing)
  private chords = [
    // C major (warm root, 5th, 3rd)
    [130.81, 196.00, 261.63, 329.63, 392.00], // C3, G3, C4, E4, G4
    // G / B (hopeful)
    [123.47, 196.00, 246.94, 293.66, 392.00], // B2, G3, B3, D4, G4
    // A minor (emotional depth)
    [110.00, 164.81, 220.00, 261.63, 329.63], // A2, E3, A3, C4, E4
    // F maj7 (sweet romantic intimacy)
    [87.31, 174.61, 261.63, 329.63, 349.23],  // F2, F3, C4, E4, F4
    // E minor / G
    [98.00, 164.81, 246.94, 329.63, 392.00],  // G2, E3, B3, E4, G4
    // D minor 9
    [146.83, 220.00, 293.66, 349.23, 440.00], // D3, A3, D4, F4, A4
    // G sus4 to G
    [98.00, 196.00, 261.63, 293.66, 392.00],  // G2, G3, C4, D4, G4
    [98.00, 196.00, 246.94, 293.66, 392.00],  // G2, G3, B3, D4, G4
  ];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public start() {
    if (this.isPlaying) return;
    const ctx = this.getAudioContext();
    this.isPlaying = true;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    this.scheduleNotes();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      } catch {
        // ignore
      }
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  private playPluck(freq: number, time: number, duration: number = 2.4, velocity: number = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Dual oscillator for warm string harmonic depth
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const noteGain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, time); // Subtle chorus detune

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + duration);

    // Pluck envelope (fast attack, natural acoustic decay)
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.45, time + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  private playWarmPad(chord: number[], time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    chord.slice(0, 3).forEach((freq) => {
      const padOsc = ctx.createOscillator();
      const padFilter = ctx.createBiquadFilter();
      const padGain = ctx.createGain();

      padOsc.type = 'sine';
      padOsc.frequency.setValueAtTime(freq * 0.5, time); // Sub/warm base

      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(450, time);

      padGain.gain.setValueAtTime(0.0001, time);
      padGain.gain.linearRampToValueAtTime(0.06, time + 0.8);
      padGain.gain.linearRampToValueAtTime(0.0001, time + duration);

      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(this.masterGain!);

      padOsc.start(time);
      padOsc.stop(time + duration);
    });
  }

  private scheduleNotes() {
    if (!this.isPlaying || !this.ctx) return;
    const ctx = this.ctx;
    const chordIndex = Math.floor(this.currentStep / 4) % this.chords.length;
    const chord = this.chords[chordIndex];
    const beatIndex = this.currentStep % 4;
    const now = ctx.currentTime;
    const beatDuration = 60 / this.tempo;

    // Pad on first beat of chord
    if (beatIndex === 0) {
      this.playWarmPad(chord, now, beatDuration * 4);
    }

    // Gentle fingerstyle arpeggio pattern:
    // Beat 0: Bass + Middle string
    // Beat 1: Higher strings
    // Beat 2: Alternate string
    // Beat 3: Top sparkle note
    if (beatIndex === 0) {
      this.playPluck(chord[0], now, beatDuration * 2.8, 0.7);
      this.playPluck(chord[2], now + 0.05, beatDuration * 2.0, 0.45);
    } else if (beatIndex === 1) {
      this.playPluck(chord[1], now, beatDuration * 1.8, 0.4);
      this.playPluck(chord[3], now + beatDuration * 0.5, beatDuration * 1.6, 0.5);
    } else if (beatIndex === 2) {
      this.playPluck(chord[2], now, beatDuration * 2.2, 0.45);
      this.playPluck(chord[4] || chord[3], now + beatDuration * 0.5, beatDuration * 1.8, 0.55);
    } else {
      this.playPluck(chord[1], now, beatDuration * 1.5, 0.4);
      this.playPluck(chord[3], now + beatDuration * 0.5, beatDuration * 1.5, 0.45);
    }

    this.currentStep++;
    const nextTimeMs = beatDuration * 1000;
    this.timerId = window.setTimeout(() => {
      this.scheduleNotes();
    }, nextTimeMs);
  }
}

export const romanticSynth = new RomanticSynthesizer();
