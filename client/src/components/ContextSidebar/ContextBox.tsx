import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LensButtons from './LensButtons';
import { RelatedContent } from './RelatedContent';
import { SimpleAudioControls } from '../reader/SimpleAudioControls';

interface ContextBoxProps {
  onTranslationChange?: (translation: string) => void;
  onLensChange?: (lens: string) => void;
  onAudioOptionChange?: (voiceType: string) => void;
  currentVerseRef?: string | null;
  currentBookChapter?: string;
}

export function ContextBox({ onTranslationChange, onLensChange, onAudioOptionChange, currentVerseRef, currentBookChapter }: ContextBoxProps) {
  const [activeTab, setActiveTab] = useState('translations');
  const [selectedLens, setSelectedLens] = useState('protestant');
  const [selectedTranslation, setSelectedTranslation] = useState('web');
  
  const handleTranslationChange = (value: string) => {
    setSelectedTranslation(value);
    onTranslationChange?.(value);
  };
  
  const handleLensChange = (value: string) => {
    setSelectedLens(value);
    onLensChange?.(value);
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-800 dark:text-stone-200">Bible Companion</h2>
      </div>
      
      <div className="w-full">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="translations">Translations</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="translations" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Select Translation
              </label>
              <Select
                value={selectedTranslation}
                onValueChange={handleTranslationChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select translation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">World English Bible</SelectItem>
                  <SelectItem value="kjv">King James Version</SelectItem>
                  <SelectItem value="niv">New International Version</SelectItem>
                  <SelectItem value="esv">English Standard Version</SelectItem>
                  <SelectItem value="nlt">New Living Translation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pt-4">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Audio Options
              </label>
              <Select defaultValue="default" onValueChange={value => onAudioOptionChange?.(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Audio options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default narrator</SelectItem>
                  <SelectItem value="male-us">Male voice (US)</SelectItem>
                  <SelectItem value="female-us">Female voice (US)</SelectItem>
                  <SelectItem value="male-uk">Male voice (UK)</SelectItem>
                  <SelectItem value="female-uk">Female voice (UK)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[0.65rem] text-stone-500 dark:text-stone-500">
                Select voice type for read-aloud
              </p>
            </div>
            
            <div className="pt-4">
              <SimpleAudioControls 
                text="This is a sample text to test the audio feature. The actual Bible text will be read when you select a passage."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
                Theological Perspectives
              </label>
              <LensButtons selected={selectedLens} onSelect={handleLensChange} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add the related content section below the tabs */}
      {(currentVerseRef || currentBookChapter) && (
        <div className="mt-6 border-t border-stone-200 dark:border-stone-700 pt-4">
          <RelatedContent 
            verseReference={currentVerseRef ? currentVerseRef : undefined} 
            bookChapter={currentBookChapter} 
          />
        </div>
      )}
    </div>
  );
}