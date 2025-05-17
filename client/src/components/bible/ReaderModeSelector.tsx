import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export type ReaderMode = 
  | "standard" 
  | "genz" 
  | "kids" 
  | "devotional" 
  | "scholarly";

interface ReaderModeSelectorProps {
  selectedMode: ReaderMode;
  onSelectMode: (mode: ReaderMode) => void;
}

const modeInfo = {
  standard: {
    description: "Original translation with traditional language",
    example: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
  },
  genz: {
    description: "Casual, relatable language for younger readers",
    example: "God literally loved everyone so much that he sent his one and only Son so that anyone who believes in him won't die but will have life that lasts forever. No cap."
  },
  kids: {
    description: "Simplified vocabulary and concepts for children",
    example: "God loves you very much! He gave his Son Jesus so that if you believe in him, you will live with God forever in heaven."
  },
  devotional: {
    description: "Reflective language that encourages spiritual application",
    example: "In God's infinite love, He offered His only Son as the ultimate gift—for you. This sacrificial love invites your belief, transforming death's certainty into eternal life's promise."
  },
  scholarly: {
    description: "Formal language closely following original text structure",
    example: "For in this manner did God demonstrate benevolence toward the cosmos: He gave His only begotten Son, in order that all believing in Him should not perish but possess eternal life."
  }
};

export default function ReaderModeSelector({ 
  selectedMode, 
  onSelectMode
}: ReaderModeSelectorProps) {
  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Reader Mode:</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Switch between different reading styles to experience the text in a way that resonates with you.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Tabs 
        value={selectedMode} 
        onValueChange={(value) => onSelectMode(value as ReaderMode)}
        className="w-full md:w-auto"
      >
        <TabsList className="grid w-full grid-cols-5 md:w-auto">
          <TabsTrigger value="standard" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Standard</TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3">
                  <p className="font-medium text-sm mb-1 text-primary">{modeInfo.standard.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-accent/10 rounded-md border border-border">
                    <p className="italic">"{modeInfo.standard.example}"</p>
                    <p className="text-[10px] mt-1 text-right text-muted-foreground">John 3:16</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="genz" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Gen Z</TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3">
                  <p className="font-medium text-sm mb-1 text-primary">{modeInfo.genz.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-accent/10 rounded-md border border-border">
                    <p className="italic">"{modeInfo.genz.example}"</p>
                    <p className="text-[10px] mt-1 text-right text-muted-foreground">John 3:16</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="kids" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Kids</TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3">
                  <p className="font-medium text-sm mb-1 text-primary">{modeInfo.kids.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-accent/10 rounded-md border border-border">
                    <p className="italic">"{modeInfo.kids.example}"</p>
                    <p className="text-[10px] mt-1 text-right text-muted-foreground">John 3:16</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="devotional" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Devotional</TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3">
                  <p className="font-medium text-sm mb-1 text-primary">{modeInfo.devotional.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-accent/10 rounded-md border border-border">
                    <p className="italic">"{modeInfo.devotional.example}"</p>
                    <p className="text-[10px] mt-1 text-right text-muted-foreground">John 3:16</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="scholarly" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Scholarly</TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3">
                  <p className="font-medium text-sm mb-1 text-primary">{modeInfo.scholarly.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-accent/10 rounded-md border border-border">
                    <p className="italic">"{modeInfo.scholarly.example}"</p>
                    <p className="text-[10px] mt-1 text-right text-muted-foreground">John 3:16</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}