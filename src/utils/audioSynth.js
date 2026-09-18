/**
 * POETICA Web Audio Ambient Synthesizer
 * Generates organic, calming sounds purely in code with zero external audio assets.
 * Strictly user-controlled (Never auto-plays).
 */

class AmbientSoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.currentTrack = null;
    this.gainNode = null;
    this.nodes = [];
    this.volume = 0.4;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  stop() {
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.nodes = [];
    this.currentTrack = null;
  }

  playRain() {
    this.init();
    this.stop();
    this.currentTrack = 'rain';

    // Pink/white noise buffer for gentle rainfall
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter to soften rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.nodes.push(whiteNoise, filter);
  }

  playWind() {
    this.init();
    this.stop();
    this.currentTrack = 'wind';

    // Modulated noise for gentle wind
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // LFO for breathing wind swells
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
    lfo.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);

    lfo.start();
    noise.start();

    this.nodes.push(noise, filter, lfo, lfoGain);
  }

  playNight() {
    this.init();
    this.stop();
    this.currentTrack = 'night';

    // Soft resonant harmonic drone for starlight
    const freqs = [220, 330, 440, 554.37];
    freqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();
      this.nodes.push(osc, oscGain);
    });
  }

  playSingingBowl() {
    this.init();
    this.stop();
    this.currentTrack = 'bowl';

    const baseFreq = 432;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const overtone = this.ctx.createOscillator();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(baseFreq * 2.76, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

    osc.connect(oscGain);
    overtone.connect(oscGain);
    oscGain.connect(this.gainNode);

    osc.start();
    overtone.start();

    this.nodes.push(osc, overtone, oscGain);
  }

  playOcean() {
    this.init();
    this.stop();
    this.currentTrack = 'ocean';

    // Pink noise buffer for rhythmic ocean waves
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.22;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for deep resonant water
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO for periodic wave swell (surf surge and retreat)
    const swellLfo = this.ctx.createOscillator();
    swellLfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // ~10s per wave cycle

    const swellGain = this.ctx.createGain();
    swellGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    swellLfo.connect(waveGain.gain);
    whiteNoise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode);

    swellLfo.start();
    whiteNoise.start();

    this.nodes.push(whiteNoise, filter, swellLfo, waveGain, swellGain);
  }

  toggle(type) {
    if (this.currentTrack === type) {
      this.stop();
      return null;
    } else {
      if (type === 'rain') this.playRain();
      else if (type === 'wind') this.playWind();
      else if (type === 'night') this.playNight();
      else if (type === 'bowl') this.playSingingBowl();
      else if (type === 'ocean') this.playOcean();
      return this.currentTrack;
    }
  }
}

export const ambientSound = new AmbientSoundSynthesizer();
