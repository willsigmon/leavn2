// Speech Synthesis utility for Aurora Reader
// Provides read-aloud functionality with word highlighting

class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isPlaying = false;
  private isPaused = false;
  private currentTextIndex = 0;
  private onBoundaryCallback: ((index: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    // Reload voices if they change
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    setTimeout(() => {
      this.voices = this.synth.getVoices();
    }, 100);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public getAvailableVoiceCategories(): { name: string, id: string }[] {
    // Group similar voices and get a representative for each group
    const categories = [
      { name: 'Default', id: 'default' },
      { name: 'Male (US)', id: 'male-us' },
      { name: 'Female (US)', id: 'female-us' },
      { name: 'Male (UK)', id: 'male-uk' },
      { name: 'Female (UK)', id: 'female-uk' }
    ];
    
    return categories;
  }

  private selectVoiceForCategory(categoryId: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;

    // Default to the first available voice
    let selectedVoice = this.voices[0];

    // Try to match the category
    switch(categoryId) {
      case 'male-us':
        selectedVoice = this.voices.find(v => 
          v.name.includes('Male') && v.lang.startsWith('en-US')) || 
          this.voices.find(v => v.lang.startsWith('en-US')) || 
          selectedVoice;
        break;
      case 'female-us':
        selectedVoice = this.voices.find(v => 
          v.name.includes('Female') && v.lang.startsWith('en-US')) || 
          this.voices.find(v => v.lang.startsWith('en-US')) || 
          selectedVoice;
        break;
      case 'male-uk':
        selectedVoice = this.voices.find(v => 
          v.name.includes('Male') && v.lang.startsWith('en-GB')) || 
          this.voices.find(v => v.lang.startsWith('en-GB')) || 
          selectedVoice;
        break;
      case 'female-uk':
        selectedVoice = this.voices.find(v => 
          v.name.includes('Female') && v.lang.startsWith('en-GB')) || 
          this.voices.find(v => v.lang.startsWith('en-GB')) || 
          selectedVoice;
        break;
      default:
        // Use the default voice
        break;
    }

    return selectedVoice;
  }

  public speak(text: string, voiceCategoryId: string = 'default', rate: number = 1, pitch: number = 1): void {
    this.stop();
    
    const selectedVoice = this.selectVoiceForCategory(voiceCategoryId);
    
    this.utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      this.utterance.voice = selectedVoice;
    }
    
    this.utterance.rate = rate; // 0.1 to 10
    this.utterance.pitch = pitch; // 0 to 2
    
    // Set up boundary event for word highlighting
    this.utterance.onboundary = (event) => {
      if (event.name === 'word') {
        this.currentTextIndex = event.charIndex;
        if (this.onBoundaryCallback) {
          this.onBoundaryCallback(event.charIndex);
        }
      }
    };
    
    // Set up end event
    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentTextIndex = 0;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
    
    this.synth.speak(this.utterance);
    this.isPlaying = true;
    this.isPaused = false;
  }

  public pause(): void {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume(): void {
    if (this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public stop(): void {
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTextIndex = 0;
  }

  public togglePlayPause(text: string, voiceCategoryId: string = 'default'): boolean {
    if (!this.isPlaying) {
      this.speak(text, voiceCategoryId);
      return true;
    } else if (this.isPaused) {
      this.resume();
      return true;
    } else {
      this.pause();
      return false;
    }
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public isCurrentlyPaused(): boolean {
    return this.isPaused;
  }

  public getCurrentTextIndex(): number {
    return this.currentTextIndex;
  }

  public setOnBoundaryCallback(callback: (index: number) => void): void {
    this.onBoundaryCallback = callback;
  }

  public setOnEndCallback(callback: () => void): void {
    this.onEndCallback = callback;
  }
}

// Create a singleton instance
const speechSynthesis = new SpeechSynthesisService();

export default speechSynthesis;