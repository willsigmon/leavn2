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
  standard: "Original translation with traditional language",
  genz: "Casual, relatable language for younger readers",
  kids: "Simplified vocabulary and concepts for children",
  devotional: "Reflective language that encourages spiritual application",
  scholarly: "Formal language closely following original text structure"
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
                <TooltipContent><p>{modeInfo.standard}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="genz" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Gen Z</TooltipTrigger>
                <TooltipContent><p>{modeInfo.genz}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="kids" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Kids</TooltipTrigger>
                <TooltipContent><p>{modeInfo.kids}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="devotional" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Devotional</TooltipTrigger>
                <TooltipContent><p>{modeInfo.devotional}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="scholarly" className="text-xs md:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">Scholarly</TooltipTrigger>
                <TooltipContent><p>{modeInfo.scholarly}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}