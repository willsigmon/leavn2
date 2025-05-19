import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ReadingPlan, ReadingPlanProgress } from '../types/readingPlan';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, CalendarDays, Users, Clock } from 'lucide-react';
import DayCard from '../components/plans/DayCard';
import { useAuth } from '@/hooks/useAuth';

const ReadingPlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'remaining' | 'completed'>('all');
  
  // Fetch the reading plan
  const { data: plan, isLoading: isPlanLoading } = useQuery({
    queryKey: [`/api/reading-plans/${planId}`],
    enabled: !!planId,
  });
  
  // Fetch user progress if authenticated
  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: [`/api/reading-plans/progress/${planId}`],
    enabled: !!planId && isAuthenticated,
  });
  
  // Check if a day is completed
  const isDayCompleted = (dayId: string): boolean => {
    if (!userProgress || !userProgress.completedDays) return false;
    return userProgress.completedDays.includes(dayId);
  };
  
  // Get filtered days based on the active tab
  const getFilteredDays = () => {
    if (!plan || !plan.days) return [];
    
    switch (activeFilterTab) {
      case 'remaining':
        return plan.days.filter(day => !isDayCompleted(day.id));
      case 'completed':
        return plan.days.filter(day => isDayCompleted(day.id));
      case 'all':
      default:
        return plan.days;
    }
  };
  
  // Handle starting the plan
  const handleStartPlan = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`/api/reading-plans/${planId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Refetch the progress after starting
        window.location.reload();
      } else {
        console.error('Failed to start reading plan');
      }
    } catch (error) {
      console.error('Error starting reading plan:', error);
    }
  };
  
  // Handle day click
  const handleDayClick = (dayId: string) => {
    navigate(`/plan-reader/${planId}/${dayId}`);
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!userProgress || !plan) return 0;
    return Math.round((userProgress.completedDays.length / plan.days.length) * 100);
  };
  
  if (isPlanLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Reading Plan Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The reading plan you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reading Plans
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/plans')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reading Plans
        </Button>
      </div>
      
      {/* Plan header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Cover image (if available) */}
        {plan.coverImage && (
          <div className="md:w-1/3 lg:w-1/4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800">
              <img 
                src={plan.coverImage} 
                alt={plan.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
        
        {/* Plan info */}
        <div className={plan.coverImage ? "md:w-2/3 lg:w-3/4" : "w-full"}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            {plan.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-[#2c4c3b] text-white">
              {plan.category}
            </Badge>
            {plan.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="bg-stone-50 dark:bg-stone-800"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {plan.description}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 text-[#2c4c3b] dark:text-green-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {plan.duration} Days
              </span>
            </div>
            
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-[#2c4c3b] dark:text-green-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {plan.days.reduce((total, day) => total + day.passages.length, 0)} Passages
              </span>
            </div>
          </div>
          
          {/* Progress if user has started the plan */}
          {userProgress && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-50">Your Progress</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userProgress.completedDays.length} of {plan.days.length} days completed
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2 bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4">
                {userProgress.completedDays.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You haven't started reading this plan yet.
                  </p>
                ) : userProgress.completedDays.length === plan.days.length ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded p-2 text-sm text-green-800 dark:text-green-200 flex items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-800 mr-2">✓</span>
                    You've completed this reading plan!
                  </div>
                ) : (
                  <Button
                    onClick={() => navigate(`/plan-reader/${planId}/${userProgress.currentDay}`)}
                    className="bg-[#2c4c3b] hover:bg-[#1e3c2b] text-white"
                  >
                    Continue Reading
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Start button for new users */}
          {!userProgress && (
            <Button 
              onClick={handleStartPlan}
              className="bg-[#2c4c3b] hover:bg-[#1e3c2b] text-white"
            >
              Start This Plan
            </Button>
          )}
        </div>
      </div>
      
      {/* Days section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Reading Schedule
          </h2>
          
          {/* Filter tabs */}
          <div className="flex space-x-2">
            <Button 
              variant={activeFilterTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilterTab('all')}
              className={activeFilterTab === 'all' ? 'bg-[#2c4c3b] hover:bg-[#1e3c2b]' : ''}
            >
              All
            </Button>
            <Button 
              variant={activeFilterTab === 'remaining' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilterTab('remaining')}
              className={activeFilterTab === 'remaining' ? 'bg-[#2c4c3b] hover:bg-[#1e3c2b]' : ''}
            >
              Remaining
            </Button>
            <Button 
              variant={activeFilterTab === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilterTab('completed')}
              className={activeFilterTab === 'completed' ? 'bg-[#2c4c3b] hover:bg-[#1e3c2b]' : ''}
            >
              Completed
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredDays().map((day, index) => (
            <DayCard
              key={day.id}
              day={day}
              dayNumber={index + 1}
              isCompleted={isDayCompleted(day.id)}
              onClick={() => handleDayClick(day.id)}
            />
          ))}
        </div>
        
        {getFilteredDays().length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-1">
              No days found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeFilterTab === 'remaining' ? 
                "You've completed all days in this reading plan!" : 
                activeFilterTab === 'completed' ? 
                "You haven't completed any days yet." : 
                "This reading plan doesn't have any days."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingPlanDetail;