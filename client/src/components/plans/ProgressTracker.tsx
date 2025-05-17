import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface ReadingPlanEntry {
  day: number;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number | null;
}

interface ProgressTrackerProps {
  planId: string;
  planTitle: string;
  totalDays: number;
  currentDay: number;
  todaysReading: ReadingPlanEntry;
  completedDays: number[];
}

export default function ProgressTracker({
  planId,
  planTitle,
  totalDays,
  currentDay,
  todaysReading,
  completedDays,
}: ProgressTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(completedDays.includes(currentDay));
  const progressPercentage = Math.round((completedDays.length / totalDays) * 100);
  
  const handleMarkComplete = () => {
    // In a real implementation, this would call an API to mark the day as complete
    setIsCompleted(true);
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Card className="w-full border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>{planTitle}</span>
          <Link href={`/reading-plan/${planId}`}>
            <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1">
              View Plan <ChevronRight size={14} />
            </Button>
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Day {currentDay} of {totalDays}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> Your progress
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-2">Today's Reading:</h4>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="font-medium">
              {capitalizeFirstLetter(todaysReading.book)} {todaysReading.chapter}
              {todaysReading.startVerse ? `:${todaysReading.startVerse}${todaysReading.endVerse ? `-${todaysReading.endVerse}` : ''}` : ''}
            </p>
            <div className="flex justify-between items-center mt-2">
              <Link href={`/bible/${todaysReading.book}/${todaysReading.chapter}`}>
                <Button size="sm" variant="outline" className="text-xs">Read Now</Button>
              </Link>
              
              {isCompleted ? (
                <span className="flex items-center text-green-600 text-sm">
                  <Check size={16} className="mr-1" /> Completed
                </span>
              ) : (
                <Button size="sm" variant="ghost" className="text-xs" onClick={handleMarkComplete}>
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}