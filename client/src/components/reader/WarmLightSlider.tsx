import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sun } from 'lucide-react';

interface WarmLightSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function WarmLightSlider({ value, onChange }: WarmLightSliderProps) {
  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="warm-light" className="text-sm font-medium">
          ComfortLight
        </Label>
        <span className="text-xs text-muted-foreground">{Math.round(value * 100)}%</span>
      </div>
      <div className="flex items-center gap-4">
        <Sun className="h-4 w-4 text-yellow-500" />
        <Slider
          id="warm-light"
          min={0}
          max={1}
          step={0.05}
          value={[value]}
          onValueChange={handleValueChange}
          className="flex-1"
        />
        <Sun className="h-5 w-5 text-amber-600" />
      </div>
      <p className="text-xs text-muted-foreground mt-1">Adjust the warmth of the display to reduce blue light</p>
    </div>
  );
}

export default WarmLightSlider;