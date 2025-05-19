import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useReadingPlan } from '../hooks/useReadingPlanContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarHeader,
  CalendarHeading,
  CalendarMonthView,
  CalendarNextButton,
  CalendarPrevButton,
  CalendarWeek,
} from '@/components/ui/calendar';
import DayDetail from '@/components/ReadingPlans/DayDetail';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  CheckCircle, 
  Clock, 
  BookmarkIcon, 
  BarChart4,
  Trophy,
  Flame,
  Target,
  ArrowLeft
} from 'lucide-react';

const ReadingPlanDetail = () => {
  const { planId } = useParams();
  const { 
    getPlanById, 
    isLoading, 
    error, 
    markDayComplete, 
    unmarkDayComplete, 
    isDayCompleted,
    getDayCompletionDate,
    calculateStreak,
    calculateCompletion
  } = useReadingPlan();

  const [selectedDay, setSelectedDay] = useState(1);
  const [activePlan, setActivePlan] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    completionPercentage: 0,
  });

  useEffect(() => {
    if (planId) {
      const plan = getPlanById(planId);
      setActivePlan(plan);
      
      // Calculate streak data
      if (plan) {
        setStreakData({
          currentStreak: calculateStreak(planId),
          completionPercentage: calculateCompletion(planId)
        });
      }
    }
  }, [planId, getPlanById, calculateStreak, calculateCompletion]);

  const handleDayComplete = (dayNumber) => {
    if (isDayCompleted(planId, dayNumber)) {
      unmarkDayComplete(planId, dayNumber);
    } else {
      markDayComplete(planId, dayNumber);
    }
    
    // Update streak data
    setStreakData({
      currentStreak: calculateStreak(planId),
      completionPercentage: calculateCompletion(planId)
    });
  };

  const handleDaySelect = (dayNumber) => {
    setSelectedDay(dayNumber);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Loading reading plan...</p>
        </div>
      </div>
    );
  }

  if (error || !activePlan) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center h-64 justify-center gap-4">
          <p className="text-red-500">{error || `Reading plan "${planId}" not found`}</p>
          <Button variant="outline" asChild>
            <a href="/reading-plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reading Plans
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const getDayCompletionStatus = (dayNumber) => {
    const isCompleted = isDayCompleted(planId, dayNumber);
    const completionDate = getDayCompletionDate(planId, dayNumber);
    
    return {
      isCompleted,
      completionDate
    };
  };

  // Calculate day to render based on selected day
  const dayToRender = activePlan?.days?.find(day => day.day === selectedDay) || null;
  const dayCompletionStatus = getDayCompletionStatus(selectedDay);

  // Generate calendar data
  const calendarData = activePlan?.days?.reduce((acc, day) => {
    const status = getDayCompletionStatus(day.day);
    if (status.isCompleted && status.completionDate) {
      const date = format(parseISO(status.completionDate), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(day.day);
    }
    return acc;
  }, {});

  // Generate statistics data
  const generateStatisticsData = () => {
    if (!activePlan) return null;
    
    const completedDays = activePlan?.days?.filter(day => isDayCompleted(planId, day.day)) || [];
    const totalDays = activePlan?.days?.length || 0;
    const remainingDays = totalDays - completedDays.length;
    
    // Calculate completed references
    const completedReferences = completedDays.reduce((total, day) => {
      return total + (day.passages ? day.passages.length : 0);
    }, 0);
    
    // Calculate total references
    const totalReferences = activePlan?.days?.reduce((total, day) => {
      return total + (day.passages ? day.passages.length : 0);
    }, 0) || 0;
    
    return {
      totalDays,
      completedDays: completedDays.length,
      remainingDays,
      completedReferences,
      totalReferences,
      currentStreak: streakData.currentStreak,
      completionPercentage: streakData.completionPercentage
    };
  };

  const statsData = generateStatisticsData();

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      {/* Back button and header */}
      <div className="mb-4">
        <Button variant="ghost" className="mb-2 -ml-2" asChild>
          <a href="/reading-plans">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Reading Plans
          </a>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{activePlan.title}</h1>
            <p className="text-muted-foreground mt-1">{activePlan.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <Progress value={streakData.completionPercentage} className="w-40 h-2" />
              <span className="text-sm font-medium">{streakData.completionPercentage}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm">{streakData.currentStreak} day streak</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="days">
        <TabsList className="w-full">
          <TabsTrigger value="days" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Reading Plan
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex-1">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            <BarChart4 className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>
        
        {/* Days Tab */}
        <TabsContent value="days" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Days list */}
            <div className="md:col-span-1">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Reading Days</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {activePlan.days?.map((day) => {
                    const { isCompleted } = getDayCompletionStatus(day.day);
                    return (
                      <Button
                        key={day.day}
                        variant={selectedDay === day.day ? "default" : "outline"}
                        className={`w-full justify-between ${
                          isCompleted ? "border-green-200 dark:border-green-900" : ""
                        }`}
                        onClick={() => handleDaySelect(day.day)}
                      >
                        <div className="flex items-center">
                          <span>Day {day.day}</span>
                          {day.title && <span className="ml-2 text-xs text-muted-foreground truncate max-w-[100px]">- {day.title}</span>}
                        </div>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Selected day */}
            <div className="md:col-span-2">
              {dayToRender ? (
                <DayDetail
                  day={dayToRender}
                  dayNumber={selectedDay}
                  onComplete={() => handleDayComplete(selectedDay)}
                  isCompleted={dayCompletionStatus.isCompleted}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p>Day {selectedDay} not found in this reading plan.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reading Progress Calendar</CardTitle>
              <CardDescription>
                Track your daily reading progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                month={calendarDate}
                onMonthChange={setCalendarDate}
                className="rounded-md border"
              >
                <CalendarHeader>
                  <CalendarPrevButton />
                  <CalendarHeading />
                  <CalendarNextButton />
                </CalendarHeader>
                <CalendarGrid>
                  <CalendarWeek />
                  <CalendarMonthView>
                    {(date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const hasCompletion = calendarData && calendarData[dateStr];
                      
                      return (
                        <CalendarCell 
                          date={date}
                          className={hasCompletion ? "relative bg-green-50 dark:bg-green-950" : ""}
                        >
                          {date.getDate()}
                          {hasCompletion && (
                            <div className="absolute bottom-1 right-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            </div>
                          )}
                        </CalendarCell>
                      );
                    }}
                  </CalendarMonthView>
                </CalendarGrid>
              </Calendar>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Recent Completions</h3>
                <div className="space-y-2">
                  {Object.entries(calendarData || {})
                    .sort((a, b) => differenceInDays(parseISO(b[0]), parseISO(a[0])))
                    .slice(0, 5)
                    .map(([date, days]) => (
                      <div key={date} className="flex justify-between items-center p-2 border rounded-md">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{format(parseISO(date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                            {days.length} {days.length === 1 ? 'day' : 'days'} completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reading Statistics</CardTitle>
              <CardDescription>
                Track your progress through this reading plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Completion Stats */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-500" />
                      <CardTitle className="text-lg">Completion</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Overall Progress</span>
                          <span className="text-sm font-medium">{statsData.completionPercentage}%</span>
                        </div>
                        <Progress value={statsData.completionPercentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Days Completed</span>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold">{statsData.completedDays}</span>
                            <span className="text-sm text-muted-foreground ml-1">/ {statsData.totalDays}</span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">Passages Read</span>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold">{statsData.completedReferences}</span>
                            <span className="text-sm text-muted-foreground ml-1">/ {statsData.totalReferences}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Streak Stats */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Flame className="h-5 w-5 mr-2 text-orange-500" />
                      <CardTitle className="text-lg">Reading Streak</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-5xl font-bold text-center mb-2">{statsData.currentStreak}</div>
                      <div className="text-muted-foreground text-center">Day{statsData.currentStreak !== 1 ? 's' : ''} in a row</div>
                      
                      {statsData.currentStreak > 0 ? (
                        <Badge className="mt-4 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300">
                          <Flame className="h-3.5 w-3.5 mr-1" />
                          Keep it going!
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mt-4">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Start a streak today
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Remaining Days */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Remaining Days</h3>
                <Progress value={statsData.completionPercentage} className="h-2 mb-4" />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{statsData.completedDays} completed</span>
                  <span>{statsData.remainingDays} remaining</span>
                </div>
              </div>
              
              {/* Reading Habits */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="reading-habits">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <BookmarkIcon className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Reading Habits</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="py-2">
                      <p className="text-sm text-muted-foreground mb-3">Based on your current progress, you're likely to complete this plan in:</p>
                      
                      {statsData.completedDays > 0 ? (
                        <div className="flex items-center justify-center py-4">
                          <Badge className="text-lg py-1.5 px-4 bg-[#d8e5d2] text-[#2c4c3b] dark:bg-[#3a6349] dark:text-white">
                            {Math.ceil(statsData.totalDays / (statsData.completedDays / 7) * 7)} days
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-center text-sm text-muted-foreground italic">
                          Complete some days to see your estimated completion time
                        </p>
                      )}
                      
                      <Separator className="my-4" />
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">Most Active Days</h4>
                        <div className="grid grid-cols-7 gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                            // This would typically be calculated from actual reading data
                            const activityLevel = Math.floor(Math.random() * 3); // 0-2 for demo
                            return (
                              <div key={i} className="flex flex-col items-center">
                                <div className="text-xs text-muted-foreground mb-1">{day}</div>
                                <div 
                                  className={`w-full h-6 rounded-sm ${
                                    activityLevel === 0 ? 'bg-muted' : 
                                    activityLevel === 1 ? 'bg-[#d8e5d2]' : 'bg-[#2c4c3b]'
                                  }`}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadingPlanDetail;