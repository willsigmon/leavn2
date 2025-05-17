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
  standard: {
    description: "Balanced scholarly perspective that draws from various traditions",
    example: "Contextually balanced interpretation with historical & literary aspects"
  },
  catholic: {
    description: "Interprets through Catholic tradition and Church teaching",
    example: "Emphasizes tradition, sacraments, and connection to Church teachings"
  },
  evangelical: {
    description: "Emphasizes personal faith and Biblical authority",
    example: "Focuses on grace through faith and direct application to daily life"
  },
  jewish: {
    description: "Views text through Jewish tradition and rabbinic teaching",
    example: "Explores Hebrew meanings and connections to Torah traditions"
  },
  atheist: {
    description: "Secular, historical-critical perspective without religious assumptions",
    example: "Analyzes text as literature within its historical and cultural context"
  }
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
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 cursor-help">
                <Info className="h-4 w-4 text-gray-500" />
              </span>
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
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <p className="font-medium text-sm mb-1 text-primary">{lensInfo.standard.description}</p>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 mt-2">
                      {lensInfo.standard.example}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="catholic" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Catholic</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <p className="font-medium text-sm mb-1 text-primary">{lensInfo.catholic.description}</p>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 mt-2">
                      {lensInfo.catholic.example}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="evangelical" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Evangelical</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <p className="font-medium text-sm mb-1 text-primary">{lensInfo.evangelical.description}</p>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 mt-2">
                      {lensInfo.evangelical.example}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="jewish" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Jewish</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <p className="font-medium text-sm mb-1 text-primary">{lensInfo.jewish.description}</p>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 mt-2">
                      {lensInfo.jewish.example}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger value="atheist" className="text-xs md:text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full h-full">Secular</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <p className="font-medium text-sm mb-1 text-primary">{lensInfo.atheist.description}</p>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 mt-2">
                      {lensInfo.atheist.example}
                    </p>
                  </TooltipContent>
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