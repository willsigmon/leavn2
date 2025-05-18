import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export interface ReaderPreferences {
  fontSize: string;
  fontFamily: string;
  lineSpacing: string;
  theme: string;
  isOpenDyslexicEnabled: boolean;
  readingPosition: Record<string, number>;
}

export const defaultPreferences: ReaderPreferences = {
  fontSize: 'medium',
  fontFamily: 'serif',
  lineSpacing: 'normal',
  theme: 'light',
  isOpenDyslexicEnabled: false,
  readingPosition: {},
};

interface ReaderSettingsProps {
  preferences: ReaderPreferences;
  onPreferencesChange: (preferences: Partial<ReaderPreferences>) => void;
}

export function ReaderSettings({ preferences, onPreferencesChange }: ReaderSettingsProps) {
  const [open, setOpen] = useState(false);

  const handleFontSizeChange = (value: string) => {
    onPreferencesChange({ fontSize: value });
  };

  const handleFontFamilyChange = (value: string) => {
    onPreferencesChange({ fontFamily: value });
  };

  const handleLineSpacingChange = (value: string) => {
    onPreferencesChange({ lineSpacing: value });
  };

  const handleThemeChange = (value: string) => {
    onPreferencesChange({ theme: value });
  };

  const handleOpenDyslexicToggle = (checked: boolean) => {
    onPreferencesChange({ isOpenDyslexicEnabled: checked });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Reader Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reader Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="text" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Text Settings */}
          <TabsContent value="text" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <RadioGroup 
                value={preferences.fontSize} 
                onValueChange={handleFontSizeChange}
                className="flex justify-between"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="size-small" />
                  <Label htmlFor="size-small" className="text-xs">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="size-medium" />
                  <Label htmlFor="size-medium" className="text-sm">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="size-large" />
                  <Label htmlFor="size-large" className="text-base">Large</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="x-large" id="size-x-large" />
                  <Label htmlFor="size-x-large" className="text-lg">X-Large</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <RadioGroup 
                value={preferences.fontFamily} 
                onValueChange={handleFontFamilyChange}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serif" id="font-serif" />
                  <Label htmlFor="font-serif" className="font-serif">Serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sans-serif" id="font-sans" />
                  <Label htmlFor="font-sans" className="font-sans">Sans-serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monospace" id="font-mono" />
                  <Label htmlFor="font-mono" className="font-mono">Monospace</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Line Spacing</Label>
              <RadioGroup 
                value={preferences.lineSpacing} 
                onValueChange={handleLineSpacingChange}
                className="flex justify-between"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tight" id="spacing-tight" />
                  <Label htmlFor="spacing-tight" className="leading-tight">Tight</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="spacing-normal" />
                  <Label htmlFor="spacing-normal" className="leading-normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relaxed" id="spacing-relaxed" />
                  <Label htmlFor="spacing-relaxed" className="leading-relaxed">Relaxed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loose" id="spacing-loose" />
                  <Label htmlFor="spacing-loose" className="leading-loose">Loose</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="open-dyslexic" 
                checked={preferences.isOpenDyslexicEnabled}
                onCheckedChange={handleOpenDyslexicToggle}
              />
              <Label htmlFor="open-dyslexic" className="font-medium">
                Open Dyslexic Font
              </Label>
            </div>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup 
                value={preferences.theme} 
                onValueChange={handleThemeChange}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sepia" id="theme-sepia" />
                  <Label htmlFor="theme-sepia">Sepia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfort-light" id="theme-comfort-light" />
                  <Label htmlFor="theme-comfort-light">Comfort Light</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}