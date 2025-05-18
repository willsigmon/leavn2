import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LensButtonsProps {
  selected: string;
  onSelect: (value: string) => void;
}

export function LensButtons({ selected, onSelect }: LensButtonsProps) {
  return (
    <div className="space-y-2">
      <ToggleGroup 
        type="single" 
        value={selected} 
        onValueChange={(value) => value && onSelect(value)}
        className="flex flex-col space-y-1.5 w-full"
      >
        <ToggleGroupItem 
          value="protestant" 
          className="justify-start w-full px-3 py-2 h-auto text-left border border-stone-200 data-[state=on]:border-[#2c4c3b] dark:border-stone-700 dark:data-[state=on]:border-[#5a8c72]"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">Protestant</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Reformation theology</span>
          </div>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="catholic" 
          className="justify-start w-full px-3 py-2 h-auto text-left border border-stone-200 data-[state=on]:border-[#2c4c3b] dark:border-stone-700 dark:data-[state=on]:border-[#5a8c72]"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">Catholic</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Traditional teaching</span>
          </div>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="orthodox" 
          className="justify-start w-full px-3 py-2 h-auto text-left border border-stone-200 data-[state=on]:border-[#2c4c3b] dark:border-stone-700 dark:data-[state=on]:border-[#5a8c72]"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">Orthodox</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Eastern perspective</span>
          </div>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="jewish" 
          className="justify-start w-full px-3 py-2 h-auto text-left border border-stone-200 data-[state=on]:border-[#2c4c3b] dark:border-stone-700 dark:data-[state=on]:border-[#5a8c72]"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">Jewish</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Historical context</span>
          </div>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="academic" 
          className="justify-start w-full px-3 py-2 h-auto text-left border border-stone-200 data-[state=on]:border-[#2c4c3b] dark:border-stone-700 dark:data-[state=on]:border-[#5a8c72]"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">Academic</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Scholarly analysis</span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}