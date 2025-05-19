import React, { useState, useEffect, useRef } from 'react';
import { 
  Pause, 
  Play, 
  SkipBack, 
  SkipForward, 
  Volume2,
  VolumeX,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextToSpeechProps {
  verses: Array<{ number: number; text: string }>;
  book: string;
  chapter: number;
  onHighlightVerse?: (verseNumber: number) => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  verses,
  book,
  chapter,
  onHighlightVerse,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [rate, setRate] = useState(1.0);
  const [voice, setVoice] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [autoHighlight, setAutoHighlight] = useState(true);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  // Initialize speech synthesis and check browser support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      
      // Get available voices when they're loaded
      const handleVoicesChanged = () => {
        const voices = speechSynthesisRef.current?.getVoices() || [];
        setAvailableVoices(voices);
        
        // Set default voice (preferably English)
        if (voices.length > 0) {
          const englishVoice = voices.find(
            (v) => v.lang.startsWith('en-')
          );
          setVoice(englishVoice?.voiceURI || voices[0].voiceURI);
        }
      };
      
      // Some browsers load voices asynchronously
      speechSynthesisRef.current.onvoiceschanged = handleVoicesChanged;
      
      // Initial attempt to get voices (for browsers that load them synchronously)
      handleVoicesChanged();
    } else {
      setIsSpeechSupported(false);
      toast({
        title: 'Speech Synthesis Not Supported',
        description: 'Your browser does not support text-to-speech functionality.',
        variant: 'destructive',
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);
  
  // Reset utterance when verses, book, or chapter changes
  useEffect(() => {
    setCurrentVerseIndex(0);
    setIsPlaying(false);
    
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
  }, [verses, book, chapter]);
  
  // Helper functions for speech synthesis
  const createUtterance = (text: string, verseIndex: number) => {
    if (!speechSynthesisRef.current) return null;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if selected
    if (voice) {
      const selectedVoice = availableVoices.find((v) => v.voiceURI === voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Set speech properties
    utterance.volume = isMuted ? 0 : volume;
    utterance.rate = rate;
    
    // Set event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      if (autoHighlight && onHighlightVerse) {
        onHighlightVerse(verses[verseIndex].number);
      }
    };
    
    utterance.onend = () => {
      // Move to next verse if not the last one
      if (verseIndex < verses.length - 1) {
        speakVerse(verseIndex + 1);
      } else {
        setIsPlaying(false);
        setCurrentVerseIndex(0);
      }
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      toast({
        title: 'Text-to-Speech Error',
        description: 'There was an error during speech playback.',
        variant: 'destructive',
      });
    };
    
    return utterance;
  };
  
  const speakVerse = (verseIndex: number) => {
    if (!speechSynthesisRef.current || verseIndex >= verses.length) return;
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    // Create new utterance for the verse
    const verseText = verses[verseIndex].text;
    const utterance = createUtterance(verseText, verseIndex);
    
    if (utterance) {
      utteranceRef.current = utterance;
      setCurrentVerseIndex(verseIndex);
      speechSynthesisRef.current.speak(utterance);
    }
  };
  
  const handlePlayPause = () => {
    if (!speechSynthesisRef.current) return;
    
    if (isPlaying) {
      speechSynthesisRef.current.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesisRef.current.paused) {
        speechSynthesisRef.current.resume();
      } else {
        speakVerse(currentVerseIndex);
      }
      setIsPlaying(true);
    }
  };
  
  const handleStop = () => {
    if (!speechSynthesisRef.current) return;
    
    speechSynthesisRef.current.cancel();
    setIsPlaying(false);
    setCurrentVerseIndex(0);
  };
  
  const handlePrevVerse = () => {
    const newIndex = Math.max(0, currentVerseIndex - 1);
    setCurrentVerseIndex(newIndex);
    if (isPlaying) {
      speakVerse(newIndex);
    } else if (autoHighlight && onHighlightVerse) {
      onHighlightVerse(verses[newIndex].number);
    }
  };
  
  const handleNextVerse = () => {
    const newIndex = Math.min(verses.length - 1, currentVerseIndex + 1);
    setCurrentVerseIndex(newIndex);
    if (isPlaying) {
      speakVerse(newIndex);
    } else if (autoHighlight && onHighlightVerse) {
      onHighlightVerse(verses[newIndex].number);
    }
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    
    // Update current utterance if playing
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
  };
  
  const handleRateChange = (values: number[]) => {
    const newRate = values[0];
    setRate(newRate);
    
    // Update current utterance if playing
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  };
  
  const handleVoiceChange = (selectedVoice: string) => {
    setVoice(selectedVoice);
    
    // Restart speech with new voice if currently playing
    if (isPlaying && speechSynthesisRef.current) {
      const currentIndex = currentVerseIndex;
      speechSynthesisRef.current.cancel();
      speakVerse(currentIndex);
    }
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    
    // Update current utterance if playing
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : volume;
    }
  };
  
  const handleToggleAutoHighlight = () => {
    setAutoHighlight(!autoHighlight);
  };

  if (!isSpeechSupported) {
    return (
      <Card className="mb-4 border-red-200 dark:border-red-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            Text-to-Speech Unavailable
          </CardTitle>
          <CardDescription>
            Your browser doesn't support the Speech Synthesis API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Try using a modern browser like Chrome, Edge, or Safari to access the
            read-aloud functionality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Read Aloud
          </CardTitle>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Text-to-Speech Settings</SheetTitle>
                <SheetDescription>
                  Customize the read-aloud experience
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="voice">Voice</Label>
                  <Select value={voice} onValueChange={handleVoiceChange}>
                    <SelectTrigger id="voice">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices.map((v) => (
                        <SelectItem key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rate">Speech Rate</Label>
                    <span className="text-xs text-muted-foreground">
                      {rate.toFixed(1)}x
                    </span>
                  </div>
                  <Slider
                    id="rate"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={[rate]}
                    onValueChange={handleRateChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume">Volume</Label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="volume"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    disabled={isMuted}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="auto-highlight" className="flex-1">
                    Auto-highlight verses
                  </Label>
                  <Toggle
                    id="auto-highlight"
                    pressed={autoHighlight}
                    onPressedChange={handleToggleAutoHighlight}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <CardDescription>
          Listen to {book} {chapter} with text-to-speech
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handlePrevVerse}
                disabled={currentVerseIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant={isPlaying ? "secondary" : "default"}
                className={cn(
                  "h-10 w-10 p-0 rounded-full",
                  !isPlaying && "bg-[#2c4c3b] hover:bg-[#1a3329]"
                )}
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextVerse}
                disabled={currentVerseIndex === verses.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <div className="w-1/3">
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  disabled={isMuted}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        <div className="text-xs text-muted-foreground w-full text-center">
          {isPlaying ? (
            <>Reading verse {verses[currentVerseIndex]?.number || 1} of {verses.length}</>
          ) : (
            <>Ready to read {verses.length} verses</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TextToSpeech;