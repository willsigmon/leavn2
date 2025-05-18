import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sun } from 'lucide-react';

interface WarmLightSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function WarmLightSlider({ value, onChange }: WarmLightSliderProps) {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  // Calculate the color based on the value (0-100)
  // At 0: neutral, At 100: warm amber glow
  const getWarmColor = (value: number) => {
    // Base color is a warm amber (#FFBA7B at maximum)
    const red = 255;
    const green = Math.round(186 * (value / 100));
    const blue = Math.round(123 * (value / 100));
    return `rgb(${red}, ${green}, ${blue})`;
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">ComfortLight</Label>
        <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
          {value}%
        </span>
      </div>
      
      <div className="flex items-center space-x-3 pt-1">
        <Sun className="h-4 w-4 text-stone-500" />
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={5}
          onValueChange={handleChange}
          className="flex-1"
        />
        <Sun 
          className="h-4 w-4" 
          style={{ color: getWarmColor(100) }} 
        />
      </div>
      
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
        Reduce blue light for more comfortable evening reading
      </p>
    </div>
  );
}

export default WarmLightSlider;