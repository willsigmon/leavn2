import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Type, AlignLeft, AlignCenter, AlignJustify } from 'lucide-react';

export type FontFamily = 'serif' | 'sans' | 'mono' | 'dyslexic';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type LineSpacing = 'tight' | 'normal' | 'relaxed' | 'loose';
export type TextAlignment = 'left' | 'center' | 'justify';
export type MarginSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface TypographyPreferences {
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  textAlign: TextAlignment;
  margins: MarginSize;
  theme: 'light' | 'dark' | 'sepia' | 'solarized';
}

interface TypographyDialogProps {
  preferences: Partial<TypographyPreferences>;
  onChange: (prefs: Partial<TypographyPreferences>) => void;
  children?: React.ReactNode;
}

export function TypographyDialog({ preferences, onChange, children }: TypographyDialogProps) {
  const {
    fontFamily = 'serif',
    fontSize = 'base',
    lineSpacing = 'normal',
    textAlign = 'left',
    margins = 'md',
    theme = 'light'
  } = preferences;
  
  const handleFontChange = (value: string) => {
    onChange({ fontFamily: value as FontFamily });
  };
  
  const handleFontSizeChange = (value: number[]) => {
    const sizes: FontSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'];
    onChange({ fontSize: sizes[value[0]] });
  };
  
  const handleLineSpacingChange = (value: number[]) => {
    const spacings: LineSpacing[] = ['tight', 'normal', 'relaxed', 'loose'];
    onChange({ lineSpacing: spacings[value[0]] });
  };
  
  const handleTextAlignChange = (value: string) => {
    onChange({ textAlign: value as TextAlignment });
  };
  
  const handleMarginsChange = (value: number[]) => {
    const marginSizes: MarginSize[] = ['none', 'sm', 'md', 'lg', 'xl'];
    onChange({ margins: marginSizes[value[0]] });
  };
  
  const handleThemeChange = (value: string) => {
    onChange({ theme: value as 'light' | 'dark' | 'sepia' | 'solarized' });
  };
  
  // Convert settings to slider values
  const getFontSizeValue = () => {
    const sizes: FontSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'];
    return sizes.indexOf(fontSize);
  };
  
  const getLineSpacingValue = () => {
    const spacings: LineSpacing[] = ['tight', 'normal', 'relaxed', 'loose'];
    return spacings.indexOf(lineSpacing);
  };
  
  const getMarginsValue = () => {
    const marginSizes: MarginSize[] = ['none', 'sm', 'md', 'lg', 'xl'];
    return marginSizes.indexOf(margins);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Typography settings">
            <Type className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reading Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="text">Typography</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Font</Label>
              <RadioGroup
                value={fontFamily}
                onValueChange={handleFontChange}
                className="grid grid-cols-2 gap-2"
              >
                <div>
                  <RadioGroupItem 
                    value="serif" 
                    id="serif" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="serif"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="font-serif mb-1 text-lg">Serif</span>
                    <span className="text-xs text-muted-foreground">Traditional</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="sans" 
                    id="sans" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="sans"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="font-sans mb-1 text-lg">Sans</span>
                    <span className="text-xs text-muted-foreground">Modern</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="mono" 
                    id="mono" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="mono"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="font-mono mb-1 text-lg">Mono</span>
                    <span className="text-xs text-muted-foreground">Fixed</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="dyslexic" 
                    id="dyslexic" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="dyslexic"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="font-sans mb-1 text-lg italic">Dyslexic</span>
                    <span className="text-xs text-muted-foreground">Accessible</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Text Size</Label>
                <span className="text-xs text-muted-foreground">
                  {fontSize === 'xs' ? 'Extra Small' : 
                   fontSize === 'sm' ? 'Small' :
                   fontSize === 'base' ? 'Medium' :
                   fontSize === 'lg' ? 'Large' :
                   fontSize === 'xl' ? 'Extra Large' : 'XXL'}
                </span>
              </div>
              <Slider
                value={[getFontSizeValue()]}
                max={5}
                step={1}
                onValueChange={handleFontSizeChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Line Spacing</Label>
                <span className="text-xs text-muted-foreground">
                  {lineSpacing === 'tight' ? 'Tight' : 
                   lineSpacing === 'normal' ? 'Normal' :
                   lineSpacing === 'relaxed' ? 'Relaxed' : 'Loose'}
                </span>
              </div>
              <Slider
                value={[getLineSpacingValue()]}
                max={3}
                step={1}
                onValueChange={handleLineSpacingChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <RadioGroup
                value={textAlign}
                onValueChange={handleTextAlignChange}
                className="flex gap-2"
              >
                <div>
                  <RadioGroupItem 
                    value="left" 
                    id="left" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="left"
                    className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="center" 
                    id="center" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="center"
                    className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="justify" 
                    id="justify" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="justify"
                    className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Margins</Label>
                <span className="text-xs text-muted-foreground">
                  {margins === 'none' ? 'None' : 
                   margins === 'sm' ? 'Small' :
                   margins === 'md' ? 'Medium' :
                   margins === 'lg' ? 'Large' : 'Extra Large'}
                </span>
              </div>
              <Slider
                value={[getMarginsValue()]}
                max={4}
                step={1}
                onValueChange={handleMarginsChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <RadioGroup
                value={theme}
                onValueChange={handleThemeChange}
                className="grid grid-cols-2 gap-2"
              >
                <div>
                  <RadioGroupItem 
                    value="light" 
                    id="light" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-black mb-1 text-lg">Light</span>
                    <span className="text-xs text-gray-500">Day reading</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="dark" 
                    id="dark" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-stone-900 p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-white mb-1 text-lg">Dark</span>
                    <span className="text-xs text-gray-400">Night reading</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="sepia" 
                    id="sepia" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="sepia"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-amber-50 p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-amber-900 mb-1 text-lg">Sepia</span>
                    <span className="text-xs text-amber-800">Warm reading</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="solarized" 
                    id="solarized" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="solarized"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-[#fdf6e3] p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-[#073642] mb-1 text-lg">Solarized</span>
                    <span className="text-xs text-[#657b83]">Reduced blue light</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}