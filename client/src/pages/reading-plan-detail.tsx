import React, { useEffect } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ReadingPlan, 
  ReadingPlanDay, 
  ReadingPlanProgress 
} from '@/types/readingPlan';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Circle,
  Clock, 
  AlertTriangle,
  BookOpen,
  Lightbulb,
  ListChecks,
  HistoryIcon,
  Target,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useReadingPlan } from '@/hooks/useReadingPlanContext';
import DayCard from '@/components/ReadingPlans/DayCard';
import DayDetail from '@/components/ReadingPlans/DayDetail';

export default function ReadingPlanDetail() {
  const [match, params] = useRoute('/reading-plans/:id');
  const [_, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedDayId, setSelectedDayId] = React.useState<string | null>(null);
  const { state, dispatch } = useReadingPlan();
  const { plans, activePlan, userProgress, loading: contextLoading } = state;

  // Use both the context and query to ensure we have the data
  const { data: planFromApi, isLoading: isLoadingFromApi, error } = useQuery<ReadingPlan>({
    queryKey: ['/api/reading-plans', params?.id],
    enabled: !!params?.id && !activePlan,
  });

  // Set the active plan from either context or API response
  useEffect(() => {
    if (!params?.id) return;
    
    // If plan is in context state, use it
    const planFromContext = plans.find(p => p.id === params.id);
    
    if (planFromContext) {
      dispatch({ type: 'SET_ACTIVE_PLAN', payload: planFromContext });
    } else if (planFromApi) {
      dispatch({ type: 'SET_ACTIVE_PLAN', payload: planFromApi });
    }
  }, [params?.id, plans, planFromApi, dispatch]);

  // Select the first day or current/last day if there's progress
  useEffect(() => {
    if (activePlan?.days && activePlan.days.length > 0 && !selectedDayId) {
      // Get progress for this plan
      const progress = userProgress[params?.id || ''];
      
      // Select first day or current day if progress exists
      if (progress && progress.completedDays.length > 0) {
        const lastCompletedDayId = progress.completedDays[progress.completedDays.length - 1];
        const lastCompletedIndex = activePlan.days.findIndex(d => d.id === lastCompletedDayId);
        
        // If there's a next day after the last completed, select it
        if (lastCompletedIndex < activePlan.days.length - 1) {
          const nextDay = activePlan.days[lastCompletedIndex + 1];
          setSelectedDayId(nextDay.id);
        } else {
          // Otherwise select the last completed day
          setSelectedDayId(lastCompletedDayId);
        }
      } else {
        // No progress yet, select first day
        setSelectedDayId(activePlan.days[0].id);
      }
    }
  }, [activePlan, params?.id, userProgress, selectedDayId]);

  const selectedDay = React.useMemo(() => {
    if (!activePlan?.days || !selectedDayId) return null;
    return activePlan.days.find(day => day.id === selectedDayId) || null;
  }, [activePlan, selectedDayId]);

  const handleMarkAsCompleted = () => {
    if (!selectedDayId || !params?.id || !isAuthenticated) return;
    
    dispatch({
      type: 'MARK_DAY_COMPLETE',
      payload: { planId: params.id, dayId: selectedDayId }
    });
    
    toast({
      title: "Day marked as completed",
      description: "Your progress has been updated. Great job!",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const isDayCompleted = (dayId: string) => {
    if (!params?.id || !userProgress[params.id]) return false;
    return userProgress[params.id].completedDays.includes(dayId);
  };
  
  // Combined loading state from both context and API
  const isLoading = contextLoading || isLoadingFromApi;

  if (!match) {
    return (
      <div className="container max-w-6xl py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Reading Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the reading plan you're looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/reading-plans')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reading Plans
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-8 w-full mb-4" />
          </div>

          <div className="md:col-span-2">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !activePlan) {
    return (
      <div className="container max-w-6xl py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Reading Plan</h1>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading this reading plan. Please try again later.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/reading-plans')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reading Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/reading-plans')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reading Plans
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan Info Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-8">
            {/* Plan Header */}
            <div>
              <Badge variant="outline" className={`mb-2 ${getDifficultyColor(activePlan.difficulty)}`}>
                {activePlan.difficulty.charAt(0).toUpperCase() + activePlan.difficulty.slice(1)}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#2c4c3b] dark:text-[#a5c2a5]">{activePlan.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>{activePlan.days.length} days</span>
              </div>
              <p className="text-foreground mb-4">{activePlan.description}</p>

              <div className="flex flex-wrap gap-2">
                {activePlan.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-[#f0f4ed] hover:bg-[#e8efe5] text-[#2c4c3b] dark:bg-[#2c4c3b]/30 dark:text-[#a5c2a5] dark:hover:bg-[#2c4c3b]/40">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Plan Days Navigation */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Plan Days</h2>
              <div className="space-y-2">
                {activePlan.days?.map((day, index) => (
                  <Button
                    key={day.id}
                    variant={selectedDayId === day.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedDayId === day.id 
                        ? "bg-[#2c4c3b] hover:bg-[#3a6349] text-white" 
                        : isDayCompleted(day.id)
                        ? "border-[#3a6349] text-[#2c4c3b] dark:text-[#a5c2a5]"
                        : ""
                    }`}
                    onClick={() => setSelectedDayId(day.id)}
                  >
                    {isDayCompleted(day.id) ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-[#3a6349]" />
                    ) : (
                      <Circle className="h-4 w-4 mr-2" />
                    )}
                    <span>Day {index + 1}: {day.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Progress section - only visible when logged in */}
            {isAuthenticated && (
              <div className="border rounded-lg p-4 bg-muted/40">
                <h2 className="font-semibold text-lg mb-2">Your Progress</h2>
                
                {params?.id && userProgress[params.id] ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Started on {new Date(userProgress[params.id].startDate || '').toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-[#3a6349] h-2.5 rounded-full" 
                        style={{ width: `${(userProgress[params.id].completedDays.length / activePlan.days.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>{userProgress[params.id].completedDays.length} of {activePlan.days.length} days completed</span>
                      <span>{Math.round((userProgress[params.id].completedDays.length / activePlan.days.length) * 100)}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>Start this reading plan to track your progress.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Daily Content */}
        <div className="md:col-span-2">
          {selectedDay ? (
            <div className="space-y-6">
              <DayDetail 
                day={selectedDay} 
                dayNumber={activePlan.days?.findIndex(d => d.id === selectedDay.id) + 1 || 0}
                isCompleted={isDayCompleted(selectedDay.id)}
                onComplete={handleMarkAsCompleted}
              />

              {/* Tabs for different content types */}
              <Tabs defaultValue="context" className="w-full">
                <TabsList className="bg-muted grid grid-cols-6 mb-4">
                  <TabsTrigger 
                    value="context" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Context
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reflection" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Reflection
                  </TabsTrigger>
                  <TabsTrigger 
                    value="concepts" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Concepts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="references" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    References
                  </TabsTrigger>
                  <TabsTrigger 
                    value="days" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    All Days
                  </TabsTrigger>
                  <TabsTrigger 
                    value="stats" 
                    className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
                  >
                    Stats
                  </TabsTrigger>
                </TabsList>
                
                {/* Context Tab */}
                <TabsContent value="context" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Lightbulb className="mt-1 mr-2 h-5 w-5 text-amber-500" />
                        <CardTitle className="text-lg">Contextual Notes</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert prose-green max-w-none">
                      <p>{selectedDay.contextualNotes}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <HistoryIcon className="mt-1 mr-2 h-5 w-5 text-blue-500" />
                        <CardTitle className="text-lg">Historical Context</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert prose-green max-w-none">
                      <p>{selectedDay.historicalContext}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Reflection Tab */}
                <TabsContent value="reflection" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Target className="mt-1 mr-2 h-5 w-5 text-purple-500" />
                        <CardTitle className="text-lg">Reflection Questions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedDay.reflectionQuestions.map((question, index) => (
                          <li key={index} className="rounded-md border p-3 bg-muted/50">
                            <p className="text-foreground">{question}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    {isAuthenticated && (
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Save My Reflections
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>
                
                {/* Concepts Tab */}
                <TabsContent value="concepts" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Sparkles className="mt-1 mr-2 h-5 w-5 text-indigo-500" />
                        <CardTitle className="text-lg">Theological Concepts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedDay.theologicalConcepts.map((concept, index) => (
                          <Badge key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* References Tab */}
                <TabsContent value="days" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Calendar className="mt-1 mr-2 h-5 w-5 text-blue-500" />
                        <div>
                          <CardTitle className="text-lg">All Plan Days</CardTitle>
                          <p className="text-sm text-muted-foreground">Complete overview of this reading plan</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        {activePlan.days?.map((day, index) => (
                          <DayCard 
                            key={day.id}
                            day={day} 
                            dayNumber={index + 1}
                            isCompleted={
                              params?.id && userProgress[params.id] 
                                ? userProgress[params.id].completedDays.includes(day.id) 
                                : false
                            }
                            onComplete={() => {
                              if (!params?.id || !isAuthenticated) return;
                              
                              dispatch({
                                type: 'MARK_DAY_COMPLETE',
                                payload: { planId: params.id, dayId: day.id }
                              });
                              
                              toast({
                                title: "Day marked as completed",
                                description: "Your progress has been updated. Great job!",
                              });
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="stats" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <Target className="mt-1 mr-2 h-5 w-5 text-purple-500" />
                        <div>
                          <CardTitle className="text-lg">Your Progress</CardTitle>
                          <p className="text-sm text-muted-foreground">Statistics about your reading journey</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(!params?.id || !userProgress[params.id]) && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                          <h3 className="text-lg font-medium mb-2">You haven't started this plan yet</h3>
                          <p className="text-muted-foreground mb-4">Track your progress by marking days as complete.</p>
                          <Button 
                            onClick={() => {
                              if (!params?.id || !isAuthenticated) return;
                              
                              dispatch({
                                type: 'START_PLAN',
                                payload: { planId: params.id }
                              });
                              
                              toast({
                                title: "Plan started",
                                description: "You're all set to begin this reading plan!",
                              });
                            }}
                            className="bg-[#2c4c3b] hover:bg-[#3a6349] text-white"
                          >
                            Start This Plan
                          </Button>
                        </div>
                      )}
                      
                      {params?.id && userProgress[params.id] && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-center">
                                  <span className="text-3xl font-bold">
                                    {Math.round((userProgress[params.id].completedDays.length / activePlan.days.length) * 100)}%
                                  </span>
                                  <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-center">
                                  <span className="text-3xl font-bold">{userProgress[params.id].completedDays.length}</span>
                                  <p className="text-sm text-muted-foreground">Days Completed</p>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-center">
                                  <span className="text-3xl font-bold">
                                    {activePlan.days.length - userProgress[params.id].completedDays.length}
                                  </span>
                                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Timeline */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-md">Reading Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                                {activePlan.days.map((day, index) => {
                                  const isCompleted = userProgress[params.id].completedDays.includes(day.id);
                                  return (
                                    <div 
                                      key={day.id}
                                      className={`
                                        flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
                                        ${isCompleted 
                                          ? 'bg-green-500 text-white' 
                                          : 'bg-muted text-muted-foreground'}
                                      `}
                                      title={`Day ${index + 1}: ${day.title}`}
                                      onClick={() => setSelectedDayId(day.id)}
                                    >
                                      {index + 1}
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Reading Streaks */}
                          <Card className="mt-4">
                            <CardHeader>
                              <CardTitle className="text-md">Reading Streaks</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="text-2xl font-bold text-green-500">
                                    {userProgress[params.id].completedDays.length}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Current Streak</div>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="text-2xl font-bold text-blue-500">
                                    {new Date(userProgress[params.id].startDate || '').toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Date Started</div>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="text-2xl font-bold text-purple-500">
                                    {userProgress[params.id].lastUpdated ? 
                                      new Date(userProgress[params.id].lastUpdated).toLocaleDateString() : 
                                      'Not yet'}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Last Reading</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="references" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start">
                        <ListChecks className="mt-1 mr-2 h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">Cross References</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedDay.crossReferences.map((reference, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            className="justify-between"
                            onClick={() => {
                              // Extract book, chapter, verse from the reference
                              const parts = reference.split(' ');
                              const book = parts[0].toLowerCase();
                              const reference = parts[1].split(':');
                              const chapter = reference[0];
                              
                              navigate(`/reader/${book}/${chapter}`);
                            }}
                          >
                            <span>{reference}</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No day selected</h3>
              <p className="text-muted-foreground mb-6">
                Please select a day from the list to view its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}