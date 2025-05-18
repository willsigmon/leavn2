import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// List of available theological lenses
const lenses = [
  { id: 'protestant', label: 'Protestant', description: 'Evangelical/Protestant perspective focusing on God\'s sovereignty and grace' },
  { id: 'catholic', label: 'Catholic', description: 'Roman Catholic viewpoint emphasizing tradition and sacraments' },
  { id: 'orthodox', label: 'Orthodox', description: 'Eastern Orthodox interpretation with emphasis on mysticism' },
  { id: 'jewish', label: 'Jewish', description: 'Traditional Jewish interpretation including Rabbinic commentary' },
  { id: 'academic', label: 'Academic', description: 'Historical-critical scholarship approach' },
  { id: 'genz', label: 'Gen-Z', description: 'Contemporary perspective for younger readers' },
];

interface LensButtonsProps {
  selected: string;
  onSelect: (lens: string) => void;
}

export function LensButtons({ selected, onSelect }: LensButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <TooltipProvider>
        {lenses.map((lens) => (
          <Tooltip key={lens.id}>
            <TooltipTrigger asChild>
              <Button
                variant={selected === lens.id ? "default" : "outline"}
                size="sm"
                className={selected === lens.id 
                  ? "bg-[#2c4c3b] hover:bg-[#223c2e] text-white" 
                  : "hover:bg-[#e8efe5] dark:hover:bg-[#2c4c3b]/30"
                }
                onClick={() => onSelect(lens.id)}
              >
                {lens.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs text-sm">{lens.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

export default LensButtons;