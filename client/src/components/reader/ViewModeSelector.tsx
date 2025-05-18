import React from 'react';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Palette,
  MessageSquareQuote,
  Type,
  Sparkles
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type ViewMode = 'original' | 'genz' | 'novelize' | 'kids' | 'scholarly';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  allowedModes?: ViewMode[];
  isLoading?: boolean;
}

export function ViewModeSelector({
  currentMode,
  onModeChange,
  allowedModes = ['original', 'genz', 'novelize', 'kids', 'scholarly'],
  isLoading = false
}: ViewModeSelectorProps) {
  // Mode descriptions for tooltips
  const modeDescriptions = {
    original: 'Original Bible text',
    genz: 'Modern language for today\'s young adults',
    novelize: 'Narrative prose inspired by "The Chosen"',
    kids: 'Simplified language for children',
    scholarly: 'Academic and theological perspective'
  };
  
  // Icons for each mode
  const modeIcons = {
    original: <BookOpen className="h-4 w-4" />,
    genz: <MessageSquareQuote className="h-4 w-4" />,
    novelize: <Sparkles className="h-4 w-4" />,
    kids: <Palette className="h-4 w-4" />,
    scholarly: <Type className="h-4 w-4" />
  };
  
  // Display names for each mode
  const modeNames = {
    original: 'Original',
    genz: 'Gen-Z',
    novelize: 'Narrative',
    kids: 'Kids',
    scholarly: 'Scholarly'
  };
  
  return (
    <div className="flex flex-col space-y-1 p-1.5 bg-muted/40 rounded-lg">
      <TooltipProvider>
        {allowedModes.map((mode) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={currentMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange(mode)}
                disabled={isLoading}
                className={`justify-start ${
                  currentMode === mode ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <span className="mr-2">{modeIcons[mode]}</span>
                {modeNames[mode]}
                {isLoading && currentMode === mode && (
                  <span className="ml-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{modeDescriptions[mode]}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}