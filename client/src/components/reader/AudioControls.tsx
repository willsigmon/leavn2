import React, { useState, useEffect } from 'react';
import { Play, Pause, StopCircle, Volume2, Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import speechSynthesis from '@/lib/speechSynthesis';

interface AudioControlsProps {
  text: string;
  onHighlight?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export function AudioControls({ text, onHighlight, onPlayStateChange, className }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(80);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [isMuted, setIsMuted] = useState(false);
  const voiceCategories = speechSynthesis.getAvailableVoiceCategories();
  
  // Reset play state when text changes
  useEffect(() => {
    handleStop();
  }, [text]);
  
  // Set up callbacks for word highlighting
  useEffect(() => {
    speechSynthesis.setOnBoundaryCallback((index) => {
      if (onHighlight) {
        onHighlight(index);
      }
    });
    
    speechSynthesis.setOnEndCallback(() => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
    });
  }, [onHighlight, onPlayStateChange]);
  
  const handlePlayPause = () => {
    const isNowPlaying = speechSynthesis.togglePlayPause(text, selectedVoice);
    setIsPlaying(isNowPlaying);
    setIsPaused(!isNowPlaying && speechSynthesis.isCurrentlyPaused());
    
    if (onPlayStateChange) {
      onPlayStateChange(isNowPlaying);
    }
  };
  
  const handleStop = () => {
    speechSynthesis.stop();
    setIsPlaying(false);
    setIsPaused(false);
    
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
  };
  
  const handleRateChange = (value: number[]) => {
    setRate(value[0]);
    // If currently playing, restart with new rate
    if (isPlaying) {
      speechSynthesis.stop();
      speechSynthesis.speak(text, selectedVoice, value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
    // If currently playing, update the volume (not supported in all browsers)
    if (isPlaying && speechSynthesis['utterance']) {
      try {
        // @ts-ignore - Not all browsers support this property
        speechSynthesis['utterance'].volume = value[0] / 100;
      } catch (e) {
        // Ignore if not supported
      }
    }
  };
  
  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
    // If currently playing, restart with new voice
    if (isPlaying) {
      speechSynthesis.stop();
      speechSynthesis.speak(text, value, rate);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // If currently playing, update the volume
    if (isPlaying && speechSynthesis['utterance']) {
      try {
        // @ts-ignore - Not all browsers support this property
        speechSynthesis['utterance'].volume = !isMuted ? 0 : volume / 100;
      } catch (e) {
        // Ignore if not supported
      }
    }
  };
  
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
          Audio Controls
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePlayPause}
            title={isPlaying && !isPaused ? "Pause" : "Play"}
          >
            {isPlaying && !isPaused ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            title="Stop"
          >
            <StopCircle className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 50 ? (
              <Volume className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-stone-600 dark:text-stone-400">
              Voice
            </label>
          </div>
          <Select
            value={selectedVoice}
            onValueChange={handleVoiceChange}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voiceCategories.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-stone-600 dark:text-stone-400">
              Speed
            </label>
            <span className="text-xs text-stone-500 dark:text-stone-500">
              {rate.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[rate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={handleRateChange}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-stone-600 dark:text-stone-400">
              Volume
            </label>
            <span className="text-xs text-stone-500 dark:text-stone-500">
              {volume}%
            </span>
          </div>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={5}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AudioControls;