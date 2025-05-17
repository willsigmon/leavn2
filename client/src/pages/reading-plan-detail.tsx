import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Check, Clock, BookOpen, Bookmark, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface ReadingPlanEntry {
  day: number;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number | null;
}

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  days: number;
  image: string;
  entries: ReadingPlanEntry[];
}

export default function ReadingPlanDetail() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  const [currentDay, setCurrentDay] = useState(1);

  // Fetch the reading plan details
  const { data: readingPlan, isLoading, error } = useQuery<ReadingPlan>({
    queryKey: [`/api/reading-plans/${params.id}`],
    enabled: isAuthenticated && !!params.id,
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleDayClick = (day: number) => {
    setCurrentDay(day);
  };
  
  const navigateToVerse = (entry: ReadingPlanEntry) => {
    navigate(`/bible/${entry.book}/${entry.chapter}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/reading-plans')}
            className="p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Plans
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load reading plan. Please try again later.</p>
          </div>
        ) : readingPlan ? (
          <>
            {/* Plan Header */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-primary mb-2">{readingPlan.title}</h1>
                <p className="text-muted-foreground mb-4">{readingPlan.description}</p>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <span>{readingPlan.days} Days</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span>~10 minutes daily</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    <span>Multiple Books</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your Progress</span>
                    <span className="font-medium">{Math.round((currentDay / readingPlan.days) * 100)}%</span>
                  </div>
                  <Progress value={(currentDay / readingPlan.days) * 100} className="h-2" />
                </div>
                
                <Button className="w-full md:w-auto" onClick={() => navigateToVerse(readingPlan.entries[currentDay - 1])}>
                  Continue Day {currentDay}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="md:w-1/3">
                <div className="rounded-lg overflow-hidden h-48">
                  <img 
                    src={readingPlan.image} 
                    alt={readingPlan.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Plan days listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {readingPlan.entries.map((entry) => (
                <Card 
                  key={entry.day} 
                  className={`cursor-pointer transition-colors ${
                    entry.day === currentDay ? 'border-primary bg-primary/5' : ''
                  } ${entry.day < currentDay ? 'bg-muted/30' : ''}`}
                  onClick={() => handleDayClick(entry.day)}
                >
                  <CardHeader className="py-4 px-5">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Day {entry.day}</CardTitle>
                      {entry.day < currentDay && (
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      {entry.book} {entry.chapter}
                      {entry.startVerse && entry.startVerse > 1 ? 
                        `:${entry.startVerse}-${entry.endVerse || 'end'}` 
                        : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 px-5">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Approximately {entry.endVerse ? (entry.endVerse - entry.startVerse + 1) : 'all'} verses
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToVerse(entry);
                        }}
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p>No reading plan found.</p>
          </div>
        )}
      </div>
    </div>
  );
}