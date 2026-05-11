export type Language = 'en' | 'hi' | 'hi-en' | 'mr';

// BCP-47 codes to try for each language, in preference order
const langVoiceMap: Record<Language, string[]> = {
  en:      ['en-IN', 'en-US', 'en-GB', 'en'],
  hi:      ['hi-IN', 'hi'],
  'hi-en': ['en-IN', 'hi-IN', 'en-US'],
  mr:      ['mr-IN', 'mr', 'hi-IN'],
};

// Tags that contain readable content text
const CONTENT_TAGS = ['h1','h2','h3','h4','h5','h6','p','li','td','th','label','span','a','strong','em','blockquote','caption'];

class TTSService {
  private synth = window.speechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    const load = () => { this.voices = this.synth.getVoices(); };
    load();
    this.synth.onvoiceschanged = load;
  }

  /** Extract only readable content text from the current page — never modifies the real DOM */
  extractPageText(): string {
    const root = document.querySelector('main') ?? document.body;
    const lines: string[] = [];

    CONTENT_TAGS.forEach(tag => {
      root.querySelectorAll<HTMLElement>(tag).forEach(el => {
        // Skip if inside a button, nav, header, form control, or hidden element
        if (el.closest('button, nav, header, footer, input, select, textarea, [aria-hidden="true"], .tts-skip')) return;
        // Only take direct/shallow text — skip if this element is a parent of another content tag
        const text = (el.innerText ?? el.textContent ?? '').trim();
        if (text.length > 1) lines.push(text);
      });
    });

    // Deduplicate consecutive identical lines (nested tags can repeat text)
    const deduped = lines.filter((line, i) => line !== lines[i - 1]);

    return deduped
      .join('. ')
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getVoice(language: Language): SpeechSynthesisVoice | undefined {
    const prefs = langVoiceMap[language];
    for (const code of prefs) {
      const v = this.voices.find(v => v.lang.startsWith(code));
      if (v) return v;
    }
    return this.voices[0];
  }

  speak(text: string, language: Language, onEnd?: () => void) {
    this.stop();
    if (!text.trim()) return;

    const doSpeak = () => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate   = 0.88;
      utt.pitch  = 1;
      utt.volume = 1;

      const voice = this.getVoice(language);
      if (voice) {
        utt.voice = voice;
        utt.lang  = voice.lang;
      } else {
        utt.lang = langVoiceMap[language][0];
      }

      utt.onend   = () => { if (onEnd) onEnd(); };
      utt.onerror = () => { if (onEnd) onEnd(); };
      this.synth.speak(utt);
    };

    if (this.voices.length > 0) {
      doSpeak();
    } else {
      // Poll up to 1 s for voices to load (Chrome lazy-loads them)
      const start = Date.now();
      const poll = setInterval(() => {
        this.voices = this.synth.getVoices();
        if (this.voices.length > 0 || Date.now() - start > 1000) {
          clearInterval(poll);
          doSpeak();
        }
      }, 50);
    }
  }

  stop() {
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
  }

  get speaking() {
    return this.synth.speaking;
  }
}

export const ttsService = new TTSService();
