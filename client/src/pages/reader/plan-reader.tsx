import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight, Bookmark, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

/**
 * Reading Plan Reader Component
 * Displays a reading plan with daily readings and contextual insights
 */
export default function PlanReader() {
  const { planId, day: dayParam } = useParams<{ planId: string; day: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('reading');

  // Fetch reading plan data
  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: [`/api/reading-plans/${planId}`],
    enabled: !!planId,
  });

  // Fetch the context data for the current reading
  const { data: contextData, isLoading: contextLoading } = useQuery({
    queryKey: [`/api/reading-plans/${planId}/context/${activeDay}`],
    enabled: !!planId && !!activeDay,
  });

  // Set active day from URL parameter or default to 1
  useEffect(() => {
    if (dayParam) {
      const parsedDay = parseInt(dayParam);
      if (!isNaN(parsedDay)) {
        setActiveDay(parsedDay);
      }
    }
  }, [dayParam]);

  // Update URL when active day changes
  useEffect(() => {
    if (planId && activeDay) {
      navigate(`/reading-plans/${planId}/${activeDay}`, { replace: true });
    }
  }, [planId, activeDay, navigate]);

  // Navigate to previous day
  const goToPreviousDay = () => {
    if (activeDay > 1) {
      setActiveDay(activeDay - 1);
    }
  };

  // Navigate to next day
  const goToNextDay = () => {
    if (planData && activeDay < planData.days.length) {
      setActiveDay(activeDay + 1);
    }
  };

  // Get current day data
  const currentDay = planData?.days?.[activeDay - 1];

  // Loading state
  if (planLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-32 w-full mb-4 rounded-lg" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <header className="border-b glass shadow-sm">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h1 className="text-2xl font-bold text-[#2c4c3b] dark:text-[#a5c2a5]">
                {planData?.title}
              </h1>
              <p className="text-stone-600 dark:text-stone-400">
                {planData?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousDay}
                disabled={activeDay <= 1}
                className="glass hover:scale-105 transition-transform"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Day {activeDay} of {planData?.days?.length || '-'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextDay}
                disabled={!planData || activeDay >= planData.days.length}
                className="glass hover:scale-105 transition-transform"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Day {activeDay}: {currentDay?.title}
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            {currentDay?.description}
          </p>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="glass mb-6">
            <TabsTrigger value="reading">Daily Reading</TabsTrigger>
            <TabsTrigger value="narrativeMode">Narrative Mode</TabsTrigger>
            <TabsTrigger value="insights">Contextual Insights</TabsTrigger>
          </TabsList>

          {/* Daily Reading Tab */}
          <TabsContent value="reading">
            <div className="glass rounded-xl overflow-hidden">
              <div className="p-6 md:p-8 reader-paper">
                {currentDay?.readings?.map((reading, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-medium mb-2 text-[#2c4c3b] dark:text-[#a5c2a5]">
                      {reading.reference}
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {reading.verses?.map((verse, i) => (
                        <p key={i} className="mb-3 last:mb-0 relative group">
                          <span className="font-semibold text-[#2c4c3b] dark:text-[#a5c2a5] mr-2">
                            {verse.number}
                          </span>
                          {verse.text}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Narrative Mode Tab */}
          <TabsContent value="narrativeMode">
            <div className="glass rounded-xl overflow-hidden">
              <div className="p-6 md:p-8 reader-paper">
                {contextLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
                      Narrative Retelling
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="italic">
                        {contextData?.narrativeMode || 
                          "Today's passage transformed into an immersive narrative story..."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contextual Insights Tab */}
          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Historical Context */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-3 text-[#2c4c3b] dark:text-[#a5c2a5]">
                    Historical Context
                  </h3>
                  {contextLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        {contextData?.historical?.content || 
                          "Historical background information about the reading..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Themes */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-3 text-[#2c4c3b] dark:text-[#a5c2a5]">
                    Key Themes
                  </h3>
                  {contextLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {contextData?.themes?.map((theme, index) => (
                        <Badge 
                          key={index}
                          className="bg-[#e8efe5] hover:bg-[#d8e5d2] text-[#2c4c3b] dark:bg-[#2c4c3b]/30 dark:text-[#a5c2a5] dark:hover:bg-[#2c4c3b]/40"
                        >
                          {theme}
                        </Badge>
                      )) || (
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          Major themes present in today's reading...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Did You Know */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-3 text-[#2c4c3b] dark:text-[#a5c2a5]">
                    Did You Know?
                  </h3>
                  {contextLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        {contextData?.didYouKnow || 
                          "Interesting facts about the people, places, or events in this passage..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-3 text-[#2c4c3b] dark:text-[#a5c2a5]">
                    Modern Application
                  </h3>
                  {contextLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        {contextData?.application || 
                          "How today's reading applies to modern life and faith..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Reflection Questions */}
        <div className="mt-8">
          <div className="glass rounded-xl overflow-hidden p-6">
            <h3 className="text-lg font-medium mb-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
              Reflection Questions
            </h3>
            {contextLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <ul className="space-y-3 list-disc pl-5">
                {contextData?.reflectionQuestions?.map((question, index) => (
                  <li key={index} className="text-stone-800 dark:text-stone-200">
                    {question}
                  </li>
                )) || (
                  <>
                    <li className="text-stone-800 dark:text-stone-200">
                      What stood out to you in today's reading?
                    </li>
                    <li className="text-stone-800 dark:text-stone-200">
                      How does this passage change how you think about God?
                    </li>
                    <li className="text-stone-800 dark:text-stone-200">
                      What might God be asking you to do in response to this passage?
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}