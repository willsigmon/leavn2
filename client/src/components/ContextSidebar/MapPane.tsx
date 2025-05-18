import React from 'react';
import { cn } from '@/lib/utils';

interface MapPaneProps {
  className?: string;
  location?: string;
}

export function MapPane({ className, location = 'Israel, Middle East' }: MapPaneProps) {
  return (
    <div className={cn("h-[240px] bg-stone-100 dark:bg-stone-800 rounded-md overflow-hidden relative", className)}>
      {/* This is a placeholder for the Leaflet map that would be implemented later */}
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/1720_Chatelain_Map_of_Israel%2C_Palestine%2C_or_the_Holy_Land_-_Geographicus_-_Tabula-chatelain-1720.jpg/1920px-1720_Chatelain_Map_of_Israel%2C_Palestine%2C_or_the_Holy_Land_-_Geographicus_-_Tabula-chatelain-1720.jpg')] bg-center bg-cover opacity-70"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 dark:bg-stone-900/80">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-medium text-stone-800 dark:text-stone-200">Historical Map</h4>
            <p className="text-[0.65rem] text-stone-600 dark:text-stone-400">{location}</p>
          </div>
          <div className="text-xs">
            <button className="px-2 py-1 bg-stone-200 dark:bg-stone-700 rounded-l-md text-[0.65rem]">Ancient</button>
            <button className="px-2 py-1 bg-white dark:bg-stone-800 rounded-r-md text-[0.65rem]">Modern</button>
          </div>
        </div>
      </div>
      
      {/* Placeholder text shown in development only */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-stone-900/80 px-3 py-2 rounded-md text-xs">
          Leaflet map will be integrated here
        </div>
      </div>
    </div>
  );
}