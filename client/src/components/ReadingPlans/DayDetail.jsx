import React from 'react';
import { useReadingPlan } from '../../hooks/useReadingPlanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Lightbulb, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

const DayDetail = ({ day, dayNumber, onComplete, isCompleted }) => {
  const [_, navigate] = useLocation();
  
  const handleReadPassage = (passage) => {
    if (passage.toLowerCase() === 'this reading plan is under development') return;
    
    // Extract book, chapter, verse from the passage
    const parts = passage.split(' ');
    const book = parts[0].toLowerCase();
    const reference = parts[1].split(':');
    const chapter = reference[0];
    
    navigate(`/reader/${book}/${chapter}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center">
          {isCompleted && <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />}
          Day {dayNumber}: {day.title}
        </h2>
        
        {!isCompleted && (
          <Button 
            onClick={onComplete}
            className="bg-[#2c4c3b] hover:bg-[#3a6349] text-white"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        )}
      </div>
      
      {/* Scripture Passages */}
      <Card className="border-l-4 border-l-[#2c4c3b]">
        <CardHeader className="pb-2">
          <div className="flex items-start">
            <BookOpen className="mt-1 mr-2 h-5 w-5 text-[#2c4c3b] dark:text-[#a5c2a5]" />
            <div>
              <CardTitle className="text-lg">Read These Passages</CardTitle>
              <p className="text-sm text-muted-foreground">Scripture readings for today</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {day.passages.map((passage, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="w-full justify-between text-left hover:bg-[#f0f4ed] hover:text-[#2c4c3b] dark:hover:bg-[#2c4c3b]/20 dark:hover:text-[#a5c2a5] border"
                onClick={() => handleReadPassage(passage)}
              >
                <span>{passage}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Historical Context */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start">
            <Lightbulb className="mt-1 mr-2 h-5 w-5 text-amber-500" />
            <div>
              <CardTitle className="text-lg">Historical Context</CardTitle>
              <p className="text-sm text-muted-foreground">Background information to understand today's passages</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>{day.contextualNotes}</p>
        </CardContent>
      </Card>
      
      {/* Reflection Questions */}
      {day.reflectionQuestions && day.reflectionQuestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="h-5 w-5 mt-1 mr-2 flex items-center justify-center text-blue-500 font-bold">?</div>
              <div>
                <CardTitle className="text-lg">Reflection Questions</CardTitle>
                <p className="text-sm text-muted-foreground">Questions to deepen your understanding</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {day.reflectionQuestions.map((question, index) => (
                <li key={index} className="text-muted-foreground">{question}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Theological Concepts */}
      {day.theologicalConcepts && day.theologicalConcepts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start">
              <div className="h-5 w-5 mt-1 mr-2 flex items-center justify-center text-purple-500">✨</div>
              <div>
                <CardTitle className="text-lg">Key Concepts</CardTitle>
                <p className="text-sm text-muted-foreground">Important themes in this passage</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {day.theologicalConcepts.map((concept, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DayDetail;