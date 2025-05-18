import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LensButtonsProps {
  onSelect?: (lens: string) => void;
  selected?: string;
}

export function LensButtons({ onSelect, selected = 'protestant' }: LensButtonsProps) {
  const lenses = [
    { id: 'protestant', label: 'Protestant' },
    { id: 'catholic', label: 'Catholic' },
    { id: 'orthodox', label: 'Orthodox' },
    { id: 'jewish', label: 'Jewish' },
    { id: 'genz', label: 'Gen Z' },
    { id: 'novelize', label: 'Novelize' },
    { id: 'academic', label: 'Academic' },
    { id: 'kids', label: 'Kids' }
  ];
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {lenses.map((lens) => (
        <Button
          key={lens.id}
          variant="outline"
          size="sm"
          className={cn(
            "h-9 text-xs font-medium justify-start px-3",
            selected === lens.id && "bg-[#e8efe5] text-[#2c4c3b] border-[#2c4c3b] dark:bg-[#2c4c3b]/20 dark:text-[#94b49f] dark:border-[#94b49f]"
          )}
          onClick={() => onSelect?.(lens.id)}
        >
          {lens.label}
        </Button>
      ))}
    </div>
  );
}