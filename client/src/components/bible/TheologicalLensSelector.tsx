import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export type TheologicalLens = 
  | "standard" 
  | "catholic" 
  | "evangelical" 
  | "jewish" 
  | "atheist";

interface TheologicalLensSelectorProps {
  selectedLens: TheologicalLens;
  onSelectLens: (lens: TheologicalLens) => void;
  compareMode?: boolean;
  onToggleCompareMode?: () => void;
}

const lensInfo = {
  standard: "Balanced scholarly perspective that draws from various traditions",
  catholic: "Interprets through Catholic tradition and Church teaching",
  evangelical: "Emphasizes personal faith and Biblical authority",
  jewish: "Views text through Jewish tradition and rabbinic teaching",
  atheist: "Secular, historical-critical perspective without religious assumptions"
};

export default function TheologicalLensSelector({ 
  selectedLens, 
  onSelectLens,
  compareMode = false,
  onToggleCompareMode
}: TheologicalLensSelectorProps) {
  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Theological Lens:</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Switch between different theological perspectives to gain a richer understanding 
                of the text across traditions.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        <Tabs 
          value={selectedLens} 
          onValueChange={(value) => onSelectLens(value as TheologicalLens)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="standard" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Standard</TooltipTrigger>
                  <TooltipContent><p>{lensInfo.standard}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="catholic" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Catholic</TooltipTrigger>
                  <TooltipContent><p>{lensInfo.catholic}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="evangelical" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Evangelical</TooltipTrigger>
                  <TooltipContent><p>{lensInfo.evangelical}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="jewish" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Jewish</TooltipTrigger>
                  <TooltipContent><p>{lensInfo.jewish}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="atheist" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Secular</TooltipTrigger>
                  <TooltipContent><p>{lensInfo.atheist}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {onToggleCompareMode && (
          <Button 
            variant={compareMode ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleCompareMode}
            className="text-xs md:text-sm"
          >
            Compare Lenses
          </Button>
        )}
      </div>
    </div>
  );
}