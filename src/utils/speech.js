/**
 * POETICA Speech Synthesis Assistant
 * Speaks poems in their designated world language when matching browser voices exist.
 */

class PoeticaSpeech {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.utterance = null;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  isSupported() {
    return !!this.synth;
  }

  getVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  speak(text, langCode = 'en-US', onFinish = null) {
    if (!this.synth) return false;

    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 0.85; // Slightly slower, deliberate poetic pace
    this.utterance.pitch = 1.0;

    // Find voice matching language
    const voices = this.getVoices();
    const cleanLang = langCode.toLowerCase().replace('_', '-');
    const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(cleanLang.split('-')[0])) ||
                         voices.find(v => v.lang.toLowerCase().includes('en'));

    if (matchedVoice) {
      this.utterance.voice = matchedVoice;
      this.utterance.lang = matchedVoice.lang;
    }

    this.utterance.onstart = () => {
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange(true);
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onFinish) onFinish();
    };

    this.utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    };

    this.synth.speak(this.utterance);
    return true;
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }
}

export const poeticaSpeech = new PoeticaSpeech();
