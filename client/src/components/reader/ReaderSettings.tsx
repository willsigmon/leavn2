import React, { useState, useEffect } from 'react';
import { useReaderPreferences, ReaderPreferences } from '@/hooks/useReaderPreferences';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Sun, 
  Moon, 
  BookOpen, 
  Paintbrush, 
  AlignLeft, 
  ChevronDown, 
  ChevronUp,
  Globe,
  Palette
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Font choices with display names and actual CSS values
const fontOptions = [
  { id: 'serif', name: 'Serif', value: 'Georgia, serif' },
  { id: 'sans-serif', name: 'Sans Serif', value: 'system-ui, sans-serif' },
  { id: 'dyslexic', name: 'Open Dyslexic', value: '"OpenDyslexic", sans-serif' },
  { id: 'monospace', name: 'Monospace', value: 'monospace' }
];

// Line spacing options
const spacingOptions = [
  { id: 'tight', name: 'Tight', value: '1.3' },
  { id: 'normal', name: 'Normal', value: '1.6' },
  { id: 'relaxed', name: 'Relaxed', value: '2' }
];

// Theme options
const themeOptions = [
  { id: 'light', name: 'Light', icon: <Sun className="h-4 w-4" /> },
  { id: 'dark', name: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { id: 'sepia', name: 'Sepia', icon: <Palette className="h-4 w-4" /> }
];

// Font size data (min, max, default values)
const fontSizeRange = {
  min: 14,
  max: 24,
  default: 18
};

interface ReaderSettingsProps {
  onClose: () => void;
}

export function ReaderSettings({ onClose }: ReaderSettingsProps) {
  const { preferences, isLoading, savePreferences } = useReaderPreferences();

  // Local state for UI interaction
  const [fontSize, setFontSize] = useState<number>(fontSizeRange.default);
  const [fontFamily, setFontFamily] = useState<string>('serif');
  const [lineSpacing, setLineSpacing] = useState<string>('normal');
  const [theme, setTheme] = useState<string>('light');
  const [isOpenDyslexicEnabled, setIsOpenDyslexicEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('typography');

  // Update local state when preferences are loaded
  useEffect(() => {
    // Set font size (convert string values like 'small', 'medium' to actual numbers)
    if (preferences.fontSize === 'small') setFontSize(fontSizeRange.min);
    else if (preferences.fontSize === 'medium') setFontSize(fontSizeRange.default);
    else if (preferences.fontSize === 'large') setFontSize(fontSizeRange.default + 3);
    else if (preferences.fontSize === 'x-large') setFontSize(fontSizeRange.max);

    setFontFamily(preferences.fontFamily);
    setLineSpacing(preferences.lineSpacing);
    setTheme(preferences.theme);
    setIsOpenDyslexicEnabled(preferences.isOpenDyslexicEnabled);
  }, [preferences]);

  // Apply settings to document body for preview
  useEffect(() => {
    // Find actual CSS values from our option objects
    const fontFamilyValue = fontOptions.find(f => f.id === fontFamily)?.value || fontOptions[0].value;
    const lineSpacingValue = spacingOptions.find(s => s.id === lineSpacing)?.value || spacingOptions[1].value;

    // Apply to document body (or ideally a reader container if it exists)
    document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--reader-font-family', fontFamilyValue);
    document.documentElement.style.setProperty('--reader-line-spacing', lineSpacingValue);

    // Handle theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('sepia');
    } else if (theme === 'sepia') {
      document.documentElement.classList.add('sepia');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('dark', 'sepia');
    }

    // Handle OpenDyslexic font
    if (isOpenDyslexicEnabled) {
      document.documentElement.style.setProperty('--reader-font-family', '"OpenDyslexic", sans-serif');
    }

    // Cleanup function
    return () => {
      // We might not want to reset these when component unmounts
      // as user likely wants to keep their settings
    };
  }, [fontSize, fontFamily, lineSpacing, theme, isOpenDyslexicEnabled]);

  // Handle save preferences
  const handleSavePreferences = () => {
    // Convert numeric font size to textual categories for storage
    let fontSizeCategory = 'medium';
    if (fontSize <= fontSizeRange.min + 1) fontSizeCategory = 'small';
    else if (fontSize >= fontSizeRange.max - 1) fontSizeCategory = 'x-large';
    else if (fontSize > fontSizeRange.default) fontSizeCategory = 'large';

    const newPreferences = {
      fontSize: fontSizeCategory,
      fontFamily,
      lineSpacing,
      theme,
      isOpenDyslexicEnabled
    };

    savePreferences(newPreferences);
    onClose();
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading preferences...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-background border rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reader Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" /> Text
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" /> Display
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-4">
          <div>
            <Label className="block mb-2">Font Size</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">A</span>
              <Slider
                value={[fontSize]}
                min={fontSizeRange.min}
                max={fontSizeRange.max}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
                className="flex-1"
              />
              <span className="text-lg">A</span>
            </div>
          </div>

          <div>
            <Label className="block mb-2">Font Style</Label>
            <RadioGroup value={fontFamily} onValueChange={setFontFamily} className="flex flex-col space-y-2">
              {fontOptions.map((font) => (
                <div key={font.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={font.id} id={`font-${font.id}`} />
                  <Label htmlFor={`font-${font.id}`} style={{ fontFamily: font.value }}>
                    {font.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="block mb-2">Line Spacing</Label>
            <RadioGroup value={lineSpacing} onValueChange={setLineSpacing} className="flex flex-col space-y-2">
              {spacingOptions.map((spacing) => (
                <div key={spacing.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={spacing.id} id={`spacing-${spacing.id}`} />
                  <Label htmlFor={`spacing-${spacing.id}`}>
                    {spacing.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <div>
            <Label className="block mb-2">Theme</Label>
            <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-2">
              {themeOptions.map((themeOption) => (
                <div key={themeOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={themeOption.id} id={`theme-${themeOption.id}`} />
                  <Label htmlFor={`theme-${themeOption.id}`} className="flex items-center gap-2">
                    {themeOption.icon}
                    {themeOption.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="open-dyslexic-toggle">Open Dyslexic Font</Label>
              <span className="text-sm text-muted-foreground">
                Use OpenDyslexic font for improved readability
              </span>
            </div>
            <Switch
              id="open-dyslexic-toggle"
              checked={isOpenDyslexicEnabled}
              onCheckedChange={setIsOpenDyslexicEnabled}
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-md">
            <p className="text-sm">
              Your reading preferences and progress are automatically synced across all your devices 
              when you're signed in.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSavePreferences}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}