import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useReaderStore } from '@/lib/readerStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type } from 'lucide-react';

export function TypographyControls() {
  const { 
    fontFamily, 
    fontSize, 
    lineSpacing, 
    textAlignment, 
    marginSize,
    setTypographySettings
  } = useReaderStore();

  const fontSizes = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'base', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
    { value: '2xl', label: 'Huge' },
  ];

  const lineSpacings = [
    { value: 'tight', label: 'Tight' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'loose', label: 'Loose' },
  ];

  const fontFamilies = [
    { value: 'serif', label: 'Serif' },
    { value: 'sans', label: 'Sans-serif' },
    { value: 'mono', label: 'Monospace' },
  ];

  const textAlignments = [
    { value: 'left', label: 'Left' },
    { value: 'justify', label: 'Justify' },
    { value: 'center', label: 'Center' },
  ];

  const marginSizes = [
    { value: 'xs', label: 'Very Narrow' },
    { value: 'sm', label: 'Narrow' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Wide' },
    { value: 'xl', label: 'Very Wide' },
  ];

  // Get font size index for slider
  const fontSizeIndex = fontSizes.findIndex(f => f.value === fontSize);
  const fontSizeValue = fontSizeIndex !== -1 ? [fontSizeIndex] : [2]; // Default to 'base'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-9 w-9 rounded-full bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700"
          aria-label="Adjust typography settings"
        >
          <Type className="h-4 w-4 text-[#2c4c3b] dark:text-[#94b49f]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 rounded-xl p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg"
        align="end"
      >
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">Reading Experience</h3>
          
          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size" className="text-xs text-stone-600 dark:text-stone-400">Font Size</Label>
              <span className="text-xs font-medium text-[#2c4c3b] dark:text-[#94b49f]">
                {fontSizes[fontSizeValue[0]].label}
              </span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={fontSizeValue}
              max={fontSizes.length - 1}
              step={1}
              onValueChange={(value) => {
                setTypographySettings({ fontSize: fontSizes[value[0]].value });
              }}
              aria-label="Font Size"
            >
              <Slider.Track className="bg-stone-200 dark:bg-stone-700 relative grow rounded-full h-1">
                <Slider.Range className="absolute bg-[#2c4c3b] dark:bg-[#94b49f] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb 
                className="block w-4 h-4 bg-white dark:bg-stone-900 shadow-md rounded-full border border-stone-200 dark:border-stone-700"
                aria-label="Font size"
              />
            </Slider.Root>
          </div>
          
          {/* Font Family */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font-family" className="text-xs text-stone-600 dark:text-stone-400">
                Font Type
              </Label>
              <Select
                value={fontFamily}
                onValueChange={(value) => setTypographySettings({ fontFamily: value })}
              >
                <SelectTrigger 
                  id="font-family"
                  className="w-full h-9 border-stone-200 dark:border-stone-700 focus:ring-[#2c4c3b] dark:focus:ring-[#94b49f]"
                >
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  {fontFamilies.map(font => (
                    <SelectItem 
                      key={font.value} 
                      value={font.value}
                      className={`${font.value === 'serif' ? 'font-serif' : font.value === 'sans' ? 'font-sans' : 'font-mono'}`}
                    >
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Line Spacing */}
            <div className="space-y-2">
              <Label htmlFor="line-spacing" className="text-xs text-stone-600 dark:text-stone-400">
                Line Spacing
              </Label>
              <Select
                value={lineSpacing}
                onValueChange={(value) => setTypographySettings({ lineSpacing: value })}
              >
                <SelectTrigger 
                  id="line-spacing"
                  className="w-full h-9 border-stone-200 dark:border-stone-700 focus:ring-[#2c4c3b] dark:focus:ring-[#94b49f]"
                >
                  <SelectValue placeholder="Select spacing" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  {lineSpacings.map(spacing => (
                    <SelectItem key={spacing.value} value={spacing.value}>
                      {spacing.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Text Alignment and Margins */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text-alignment" className="text-xs text-stone-600 dark:text-stone-400">
                Text Alignment
              </Label>
              <Select
                value={textAlignment}
                onValueChange={(value) => setTypographySettings({ textAlignment: value })}
              >
                <SelectTrigger 
                  id="text-alignment"
                  className="w-full h-9 border-stone-200 dark:border-stone-700 focus:ring-[#2c4c3b] dark:focus:ring-[#94b49f]"
                >
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  {textAlignments.map(alignment => (
                    <SelectItem key={alignment.value} value={alignment.value}>
                      {alignment.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="margin-size" className="text-xs text-stone-600 dark:text-stone-400">
                Margins
              </Label>
              <Select
                value={marginSize}
                onValueChange={(value) => setTypographySettings({ marginSize: value })}
              >
                <SelectTrigger 
                  id="margin-size"
                  className="w-full h-9 border-stone-200 dark:border-stone-700 focus:ring-[#2c4c3b] dark:focus:ring-[#94b49f]"
                >
                  <SelectValue placeholder="Select margins" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                  {marginSizes.map(margin => (
                    <SelectItem key={margin.value} value={margin.value}>
                      {margin.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TypographyControls;