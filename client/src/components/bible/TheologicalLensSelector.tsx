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
            <TabsTrigger value="standard" className="text-xs md:text-sm relative group">
              <span>Standard</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-black text-white text-xs rounded py-1 px-2 w-48">
                  <p>{lensInfo.standard}</p>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="catholic" className="text-xs md:text-sm relative group">
              <span>Catholic</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-black text-white text-xs rounded py-1 px-2 w-48">
                  <p>{lensInfo.catholic}</p>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="evangelical" className="text-xs md:text-sm relative group">
              <span>Evangelical</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-black text-white text-xs rounded py-1 px-2 w-48">
                  <p>{lensInfo.evangelical}</p>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="jewish" className="text-xs md:text-sm relative group">
              <span>Jewish</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-black text-white text-xs rounded py-1 px-2 w-48">
                  <p>{lensInfo.jewish}</p>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="atheist" className="text-xs md:text-sm relative group">
              <span>Secular</span>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-black text-white text-xs rounded py-1 px-2 w-48">
                  <p>{lensInfo.atheist}</p>
                </div>
              </div>
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