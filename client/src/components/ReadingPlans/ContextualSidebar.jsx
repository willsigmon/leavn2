import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Book, 
  History, 
  Map, 
  Calendar, 
  Lightbulb, 
  MessageCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ContextualSidebar = ({ day, onNavigateToVerse }) => {
  const [activeTab, setActiveTab] = useState('context');
  
  // Determine which tabs should be available based on content
  const tabs = [
    { 
      id: 'context', 
      label: 'Historical', 
      icon: <History className="h-4 w-4 mr-2" />,
      content: day.historicalContext 
    },
    { 
      id: 'theological', 
      label: 'Theological', 
      icon: <Lightbulb className="h-4 w-4 mr-2" />,
      content: day.theologicalConcepts 
    },
    { 
      id: 'application', 
      label: 'Application', 
      icon: <Sparkles className="h-4 w-4 mr-2" />,
      content: day.applicationPoints 
    },
    { 
      id: 'reflection', 
      label: 'Reflection', 
      icon: <MessageCircle className="h-4 w-4 mr-2" />,
      content: day.reflectionQuestions 
    },
    { 
      id: 'references', 
      label: 'References', 
      icon: <BookMarked className="h-4 w-4 mr-2" />,
      content: day.crossReferences 
    }
  ].filter(tab => tab.content && (Array.isArray(tab.content) ? tab.content.length > 0 : true));
  
  // If no tabs have content, show a message
  if (tabs.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-950 rounded-lg border p-6 text-center">
        <Book className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          No additional context available for this passage.
        </p>
      </div>
    );
  }
  
  // Handle navigation to specific verse reference
  const handleReferenceClick = (reference) => {
    if (onNavigateToVerse) {
      onNavigateToVerse(reference);
    }
  };
  
  return (
    <div className="glass rounded-2xl shadow-lg h-full overflow-hidden flex flex-col">
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#2c4c3b] dark:text-green-400 mb-1">
          Contextual Insights
        </h3>
        <p className="text-sm text-muted-foreground">
          Explore historical and theological context for this passage
        </p>
      </div>
      
      <Tabs 
        defaultValue={tabs[0].id} 
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="glass mx-4 rounded-xl grid w-auto justify-center p-1 mb-2" 
          style={{ gridTemplateColumns: `repeat(${Math.min(tabs.length, 5)}, 1fr)` }}
        >
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className={`flex items-center text-xs sm:text-sm transition-transform ${
                activeTab === tab.id 
                  ? "ring-1 ring-white/20 scale-105" 
                  : "hover:scale-105"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            className="flex-1 p-4 overflow-y-auto"
          >
            {tab.id === 'context' && (
              <div className="prose dark:prose-invert max-w-none text-sm">
                <h4 className="text-sm font-medium">Historical Context</h4>
                <p>{day.historicalContext}</p>
                
                {day.culturalNotes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium">Cultural Notes</h4>
                    <p>{day.culturalNotes}</p>
                  </div>
                )}
              </div>
            )}
            
            {tab.id === 'theological' && (
              <div>
                <h4 className="text-sm font-medium mb-3">Theological Concepts</h4>
                <div className="grid grid-cols-1 gap-2">
                  {day.theologicalConcepts?.map((concept, index) => (
                    <div 
                      key={index}
                      className="flex items-start p-3 glass rounded-xl hover:scale-[1.01] transition-all duration-200 cursor-default"
                    >
                      <Lightbulb className="h-4 w-4 text-[#2c4c3b] dark:text-green-300 mt-0.5 mr-2.5 flex-shrink-0" />
                      <span className="text-sm">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {tab.id === 'application' && (
              <div>
                <h4 className="text-sm font-medium mb-3">Application Points</h4>
                <div className="space-y-3">
                  {day.applicationPoints?.map((point, index) => (
                    <div key={index} className="flex gap-3 p-3 glass rounded-xl hover:scale-[1.01] transition-all duration-200">
                      <div className="h-6 w-6 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-xs font-medium flex-shrink-0 border border-white/10">
                        {index + 1}
                      </div>
                      <p className="text-sm">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {tab.id === 'reflection' && (
              <div>
                <h4 className="text-sm font-medium mb-3">Reflection Questions</h4>
                <div className="space-y-6">
                  {day.reflectionQuestions?.map((question, index) => (
                    <div key={index} className="glass rounded-xl p-4 space-y-4 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-xs font-medium flex-shrink-0 border border-white/10">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium">
                          {question}
                        </p>
                      </div>
                      <div>
                        <textarea 
                          placeholder="Your thoughts..."
                          className="w-full p-3 text-sm glass rounded-xl border-none focus:ring-1 focus:ring-white/30 focus:outline-none resize-none min-h-[80px] placeholder-white/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {tab.id === 'references' && (
              <div>
                <h4 className="text-sm font-medium mb-3">Cross References</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {day.crossReferences?.map((reference, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      size="sm"
                      className="glass justify-start font-normal text-left hover:scale-[1.02] transition-transform duration-200"
                      onClick={() => handleReferenceClick(reference)}
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-2 text-[#2c4c3b] dark:text-green-300" />
                      {reference}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContextualSidebar;