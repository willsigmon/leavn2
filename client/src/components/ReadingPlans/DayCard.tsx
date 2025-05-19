import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, Book, CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { ReadingPlanDay } from '@/types/readingPlan';

interface DayCardProps {
  day: ReadingPlanDay;
  dayNumber: number;
  isCompleted: boolean;
  onComplete: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, dayNumber, isCompleted, onComplete }) => {
  const [_, navigate] = useLocation();

  const handleReadPassage = (passage: string) => {
    if (passage.toLowerCase() === 'this reading plan is under development') return;
    
    // Extract book, chapter, verse from the passage
    const parts = passage.split(' ');
    const book = parts[0].toLowerCase();
    const reference = parts[1].split(':');
    const chapter = reference[0];
    
    navigate(`/reader/${book}/${chapter}`);
  };

  return (
    <Card className={`mb-4 border-l-4 ${
      isCompleted ? 'border-l-green-500' : 'border-l-[#2c4c3b]'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {isCompleted ? (
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            ) : (
              <Circle className="mr-2 h-5 w-5 text-[#2c4c3b]" />
            )}
            <span>Day {dayNumber}: {day.title}</span>
          </CardTitle>
          
          {!isCompleted && (
            <Button 
              size="sm"
              onClick={onComplete}
              className="bg-[#2c4c3b] hover:bg-[#3a6349] text-white"
            >
              Mark Complete
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Scripture Passages */}
          <div>
            <h3 className="text-md font-medium mb-2 flex items-center">
              <Book className="h-4 w-4 mr-1.5 text-[#2c4c3b]" />
              Scripture Passages
            </h3>
            <div className="space-y-2">
              {day.passages.map((passage, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm"
                  className="w-full justify-between text-left hover:bg-[#f0f4ed] hover:text-[#2c4c3b] dark:hover:bg-[#2c4c3b]/20 dark:hover:text-[#a5c2a5] border"
                  onClick={() => handleReadPassage(passage)}
                >
                  <span>{passage}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Accordions for additional content */}
          <Accordion type="single" collapsible className="w-full border rounded-md">
            {/* Contextual Notes */}
            <AccordionItem value="notes">
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                <div className="flex items-center text-sm font-medium">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                  Contextual Notes
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <p className="text-sm text-muted-foreground">{day.contextualNotes}</p>
              </AccordionContent>
            </AccordionItem>
            
            {/* Reflection Questions */}
            {day.reflectionQuestions && day.reflectionQuestions.length > 0 && (
              <AccordionItem value="questions">
                <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                  <div className="flex items-center text-sm font-medium">
                    <span className="h-4 w-4 mr-2 flex items-center justify-center text-blue-500">?</span>
                    Reflection Questions
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <ul className="list-disc pl-5 space-y-1.5">
                    {day.reflectionQuestions.map((question, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{question}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {/* Theological Concepts */}
            {day.theologicalConcepts && day.theologicalConcepts.length > 0 && (
              <AccordionItem value="concepts">
                <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                  <div className="flex items-center text-sm font-medium">
                    <span className="h-4 w-4 mr-2 flex items-center justify-center text-purple-500">✨</span>
                    Key Concepts
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {day.theologicalConcepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayCard;