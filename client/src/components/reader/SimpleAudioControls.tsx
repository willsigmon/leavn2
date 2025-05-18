import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipForward, 
  SkipBack
} from 'lucide-react';

interface SimpleAudioControlsProps {
  text?: string;
  verseTexts?: string[];
  currentVerseIndex?: number;
  onVerseChange?: (index: number) => void;
  onHighlight?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function SimpleAudioControls({ 
  text,
  verseTexts = [], 
  currentVerseIndex = 0,
  onVerseChange,
  onHighlight,
  onPlayStateChange
}: SimpleAudioControlsProps) {
  // If text is provided, convert it to an array of individual verses
  const verses = text ? [text] : verseTexts;
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(currentVerseIndex);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
      
      // Clean up
      return () => {
        if (speechSynthRef.current?.speaking) {
          speechSynthRef.current.cancel();
        }
      };
    }
  }, []);

  // Update current verse when prop changes
  useEffect(() => {
    if (currentVerseIndex !== currentVerse) {
      setCurrentVerse(currentVerseIndex);
    }
  }, [currentVerseIndex, currentVerse]);

  // Handle speech synthesis end event
  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.onend = () => {
        setIsPlaying(false);
        
        if (onPlayStateChange) {
          onPlayStateChange(false);
        }
        
        // Move to next verse if available
        if (currentVerse < verses.length - 1) {
          const nextVerse = currentVerse + 1;
          setCurrentVerse(nextVerse);
          if (onVerseChange) {
            onVerseChange(nextVerse);
          }
          
          // Continue playing if the previous verse was playing
          if (isPlaying) {
            setTimeout(() => playCurrentVerse(), 500);
          }
        }
      };
      
      // Use this for word boundary events to track current reading position
      utteranceRef.current.onboundary = (event) => {
        if (event.name === 'word' && onHighlight && verses[currentVerse]) {
          // Calculate the position in the overall text
          let position = event.charIndex;
          
          // Add lengths of previous verses
          for (let i = 0; i < currentVerse; i++) {
            if (verses[i]) {
              position += verses[i].length + 1; // +1 for space between verses
            }
          }
          
          if (onHighlight) {
            onHighlight(position);
          }
        }
      };
      
      utteranceRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        if (onPlayStateChange) {
          onPlayStateChange(false);
        }
      };
    }
  }, [currentVerse, verses, isPlaying, onVerseChange, onHighlight, onPlayStateChange]);

  // Play current verse
  const playCurrentVerse = () => {
    if (!speechSynthRef.current || !verses[currentVerse]) return;
    
    // Cancel any ongoing speech
    if (speechSynthRef.current.speaking) {
      speechSynthRef.current.cancel();
    }
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(verses[currentVerse]);
    
    // Set properties
    utterance.rate = rate;
    utterance.volume = isMuted ? 0 : volume;
    
    // Store reference and speak
    utteranceRef.current = utterance;
    speechSynthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  // Pause/resume playback
  const togglePlayback = () => {
    if (!speechSynthRef.current) return;
    
    if (isPlaying) {
      speechSynthRef.current.pause();
      setIsPlaying(false);
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
    } else {
      if (speechSynthRef.current.paused) {
        speechSynthRef.current.resume();
      } else {
        playCurrentVerse();
      }
      setIsPlaying(true);
      if (onPlayStateChange) {
        onPlayStateChange(true);
      }
    }
  };

  // Stop playback
  const stopPlayback = () => {
    if (!speechSynthRef.current) return;
    
    speechSynthRef.current.cancel();
    setIsPlaying(false);
  };

  // Go to previous verse
  const goToPrevVerse = () => {
    if (currentVerse > 0) {
      stopPlayback();
      const prevVerse = currentVerse - 1;
      setCurrentVerse(prevVerse);
      if (onVerseChange) {
        onVerseChange(prevVerse);
      }
      if (isPlaying) {
        setTimeout(() => playCurrentVerse(), 100);
      }
    }
  };

  // Go to next verse
  const goToNextVerse = () => {
    if (currentVerse < verses.length - 1) {
      stopPlayback();
      const nextVerse = currentVerse + 1;
      setCurrentVerse(nextVerse);
      if (onVerseChange) {
        onVerseChange(nextVerse);
      }
      if (isPlaying) {
        setTimeout(() => playCurrentVerse(), 100);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (utteranceRef.current && speechSynthRef.current?.speaking) {
      // Cancel and restart with new volume
      stopPlayback();
      setTimeout(() => playCurrentVerse(), 100);
    }
  };

  return (
    <div className="bg-card border rounded-md p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Read Aloud</h3>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={toggleMute} 
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Playback controls */}
      <div className="flex justify-between items-center mb-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToPrevVerse}
          disabled={currentVerse <= 0}
          aria-label="Previous verse"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="sm"
          className="h-10 w-10 p-0 rounded-full"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={goToNextVerse}
          disabled={currentVerse >= verses.length - 1}
          aria-label="Next verse"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Speed control */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Speed</span>
          <span className="text-xs font-medium">{rate.toFixed(1)}x</span>
        </div>
        <Slider
          value={[rate]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={([newRate]) => {
            setRate(newRate);
            if (utteranceRef.current && speechSynthRef.current?.speaking) {
              // Cancel and restart with new rate
              stopPlayback();
              setTimeout(() => playCurrentVerse(), 100);
            }
          }}
        />
      </div>
      
      {/* Volume control */}
      {!isMuted && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Volume</span>
            <span className="text-xs font-medium">{Math.round(volume * 100)}%</span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([newVolume]) => {
              setVolume(newVolume);
              if (utteranceRef.current && speechSynthRef.current?.speaking) {
                // Cancel and restart with new volume
                stopPlayback();
                setTimeout(() => playCurrentVerse(), 100);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}