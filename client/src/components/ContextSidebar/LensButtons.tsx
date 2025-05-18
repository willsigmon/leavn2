import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LensButtonsProps {
  selected: string;
  onSelect: (lens: string) => void;
}

export function LensButtons({ selected, onSelect }: LensButtonsProps) {
  const lenses = [
    { 
      id: 'protestant', 
      name: 'Protestant', 
      description: 'Traditional Protestant theological perspective emphasizing Scripture alone, faith alone, and grace alone',
      color: 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50'
    },
    { 
      id: 'catholic', 
      name: 'Catholic', 
      description: 'Roman Catholic perspective emphasizing Church tradition, sacraments, and authority alongside Scripture',
      color: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50'
    },
    { 
      id: 'orthodox', 
      name: 'Orthodox', 
      description: 'Eastern Orthodox view emphasizing mystical understanding, liturgical tradition, and the Church Fathers',
      color: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50'
    },
    { 
      id: 'jewish', 
      name: 'Jewish', 
      description: 'Jewish perspective from rabbinic tradition and Hebrew Scripture interpretation',
      color: 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50'
    },
    { 
      id: 'genz', 
      name: 'Gen-Z', 
      description: 'Modern interpretation for younger generations using contemporary language and cultural references',
      color: 'bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-900/50'
    },
    { 
      id: 'kids', 
      name: 'Kids', 
      description: 'Simplified explanations for children with clear moral lessons and engaging illustrations',
      color: 'bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-900/50'
    },
    { 
      id: 'academic', 
      name: 'Academic', 
      description: 'Historical-critical analysis from biblical scholarship including textual and archaeological findings',
      color: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700/70'
    }
  ];
  
  return (
    <div className="grid grid-cols-2 gap-2">
      <TooltipProvider>
        {lenses.map((lens) => (
          <Tooltip key={lens.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect(lens.id)}
                className={`justify-start px-2 py-1 h-auto ${lens.color} ${
                  selected === lens.id 
                    ? 'ring-2 ring-[#2c4c3b] dark:ring-[#8baa96] ring-offset-2 dark:ring-offset-stone-950' 
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className="text-xs font-medium">{lens.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[200px]">
              <p className="text-xs">{lens.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

export default LensButtons;