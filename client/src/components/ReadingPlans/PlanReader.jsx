import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useReadingPlan } from '../../hooks/useReadingPlanContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from 'lucide-react';
import ContextualInsights from './ContextualInsights';
import { getBibleChapter } from '../../lib/bibleService';

const PlanReader = () => {
  const { planId, dayNumber } = useParams();
  const [_, navigate] = useLocation();
  const { 
    getPlanById, 
    markDayComplete, 
    isDayCompleted,
    calculateCompletion 
  } = useReadingPlan();
  
  const [activePlan, setActivePlan] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [passages, setPassages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the day number as an integer
  const currentDayNum = parseInt(dayNumber, 10);
  
  useEffect(() => {
    if (planId) {
      const plan = getPlanById(planId);
      setActivePlan(plan);
      
      if (plan) {
        const day = plan.days.find(d => d.day === currentDayNum);
        setCurrentDay(day);
      }
      
      setIsLoading(false);
    }
  }, [planId, currentDayNum, getPlanById]);
  
  // Fetch Bible content when current day changes
  useEffect(() => {
    const fetchBibleContent = async () => {
      if (!currentDay?.passages) return;
      
      setIsLoading(true);
      
      try {
        const passageContent = [];
        
        for (const reference of currentDay.passages) {
          // Parse the reference (e.g., "Genesis 1:1-10")
          const [bookChapter, verses] = reference.split(':');
          const [book, chapter] = bookChapter.split(' ');
          
          // Fetch the whole chapter
          const chapterData = await getBibleChapter(book, chapter);
          
          if (chapterData) {
            // If specific verses are mentioned, filter them
            if (verses) {
              let verseRange = [];
              
              // Handle verse ranges and individual verses
              if (verses.includes('-')) {
                const [start, end] = verses.split('-').map(v => parseInt(v, 10));
                verseRange = chapterData.verses.filter(
                  v => v.number >= start && v.number <= end
                );
              } else {
                const verseNum = parseInt(verses, 10);
                verseRange = chapterData.verses.filter(v => v.number === verseNum);
              }
              
              passageContent.push({
                reference,
                book,
                chapter: parseInt(chapter, 10),
                verses: verseRange,
                fullReference: `${book} ${chapter}:${verses}`
              });
            } else {
              // If no verses specified, include the whole chapter
              passageContent.push({
                reference,
                book,
                chapter: parseInt(chapter, 10),
                verses: chapterData.verses,
                fullReference: `${book} ${chapter}`
              });
            }
          }
        }
        
        setPassages(passageContent);
      } catch (err) {
        console.error('Error fetching Bible content:', err);
        setError('Failed to load Bible passages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBibleContent();
  }, [currentDay]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2c4c3b]"></div>
          <p>Loading reading plan content...</p>
        </div>
      </div>
    );
  }
  
  if (error || !activePlan || !currentDay) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || `Could not find the requested reading plan day. Please return to the reading plans page.`}
        </AlertDescription>
        <Button variant="outline" className="mt-2" onClick={() => navigate('/reading-plans')}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Reading Plans
        </Button>
      </Alert>
    );
  }
  
  const hasPrevious = currentDayNum > 1;
  const hasNext = currentDayNum < activePlan.days.length;
  const dayCompleted = isDayCompleted(planId, currentDayNum);
  
  const navigateToDay = (dayNum) => {
    navigate(`/reading-plans/${planId}/${dayNum}`);
  };
  
  const handleMarkComplete = () => {
    markDayComplete(planId, currentDayNum);
    if (hasNext) {
      navigateToDay(currentDayNum + 1);
    } else {
      // Navigate to the plan overview when completing the last day
      navigate(`/reading-plans/${planId}`);
    }
  };
  
  const completionPercentage = calculateCompletion(planId);
  
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <Button 
            variant="ghost" 
            className="-ml-2" 
            onClick={() => navigate(`/reading-plans/${planId}`)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Plan
          </Button>
          
          <Badge 
            variant={dayCompleted ? "default" : "outline"}
            className={dayCompleted ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300" : ""}
          >
            {dayCompleted ? (
              <><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Completed</>
            ) : (
              <><Clock className="mr-1 h-3.5 w-3.5" /> In Progress</>
            )}
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold">{activePlan.title}</h1>
        <div className="flex items-baseline mt-1 space-x-2">
          <h2 className="text-xl">Day {currentDayNum}: {currentDay.title}</h2>
          <p className="text-sm text-muted-foreground">
            ({completionPercentage}% complete)
          </p>
        </div>
      </div>
      
      {/* Passages Navigation */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-[#2c4c3b]" />
            <CardTitle>Scripture Passages</CardTitle>
          </div>
          <CardDescription>
            Read through these passages as part of today's reading plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {passages.map((passage, index) => (
              <div key={index}>
                <h3 className="font-medium text-lg mb-2">
                  {passage.fullReference}
                </h3>
                <div className="space-y-2">
                  {passage.verses.map((verse) => (
                    <div key={verse.number} className="flex">
                      <span className="text-sm font-medium text-muted-foreground mr-2">
                        {verse.number}
                      </span>
                      <p>{verse.text}</p>
                    </div>
                  ))}
                </div>
                {index < passages.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Contextual Insights */}
      <ContextualInsights
        historicalContext={currentDay.contextualNotes}
        theologicalConcepts={currentDay.theologicalConcepts || []}
        reflectionQuestions={currentDay.reflectionQuestions || []}
        crossReferences={currentDay.crossReferences || []}
      />
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => navigateToDay(currentDayNum - 1)}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Day
        </Button>
        
        <Button 
          onClick={handleMarkComplete}
          disabled={dayCompleted && !hasNext}
          className="bg-[#2c4c3b] hover:bg-[#1a3329] text-white"
        >
          {dayCompleted ? (
            hasNext ? "Continue to Next Day" : "Plan Completed!"
          ) : (
            "Mark as Complete & Continue"
          )}
          {hasNext && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigateToDay(currentDayNum + 1)}
          disabled={!hasNext}
        >
          Next Day <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlanReader;