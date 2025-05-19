import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadingPlan, ReadingPlanProgress } from '../../types/readingPlan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Book, Calendar, Filter, Search } from 'lucide-react';
import DayCard from './DayCard';

interface PlanListProps {
  plans: ReadingPlan[];
  userProgress?: ReadingPlanProgress[];
}

const PlanList: React.FC<PlanListProps> = ({ plans, userProgress = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  
  // Get all unique categories from plans
  const categories = [...new Set(plans.map(plan => plan.category))];
  
  // Filtered plans based on search and category
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = searchTerm === '' || 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || plan.category === selectedCategory;
    
    const matchesTab = currentTab === 'all' || 
      (currentTab === 'active' && isActivePlan(plan.id)) ||
      (currentTab === 'completed' && isCompletedPlan(plan.id));
    
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  // Helper functions to determine plan status
  const isActivePlan = (planId: string): boolean => {
    const progress = userProgress.find(p => p.planId === planId);
    return !!progress && progress.completedDays.length > 0 && 
      progress.completedDays.length < plans.find(p => p.id === planId)?.days.length!;
  };
  
  const isCompletedPlan = (planId: string): boolean => {
    const progress = userProgress.find(p => p.planId === planId);
    const plan = plans.find(p => p.id === planId);
    return !!progress && !!plan && progress.completedDays.length === plan.days.length;
  };
  
  const getPlanProgress = (planId: string): number => {
    const progress = userProgress.find(p => p.planId === planId);
    const plan = plans.find(p => p.id === planId);
    
    if (!progress || !plan) return 0;
    return Math.round((progress.completedDays.length / plan.days.length) * 100);
  };
  
  const handlePlanClick = (planId: string) => {
    navigate(`/plans/${planId}`);
  };
  
  const getCurrentDay = (planId: string): string | undefined => {
    const progress = userProgress.find(p => p.planId === planId);
    return progress?.currentDay;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Reading Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore structured reading journeys through Scripture
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search plans..."
              className="pl-9 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            className="relative"
            onClick={() => setSelectedCategory(null)}
          >
            <Filter className="h-4 w-4" />
            {selectedCategory && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#2c4c3b] rounded-full" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedCategory === category ? 'bg-[#2c4c3b] hover:bg-[#1e3c2b]' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setSelectedCategory(prev => prev === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Tabs for All/Active/Completed */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="completed">Completed Plans</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Plans grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <Card 
              key={plan.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-stone-200 dark:border-stone-700"
              onClick={() => handlePlanClick(plan.id)}
            >
              {/* Cover image */}
              {plan.coverImage && (
                <div className="aspect-[2/1] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img 
                    src={plan.coverImage} 
                    alt={plan.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {plan.title}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <Badge className="bg-[#2c4c3b] text-white hover:bg-[#1e3c2b]">
                    {plan.duration} Days
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plan.tags.slice(0, 3).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="text-xs bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {plan.tags.length > 3 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                    >
                      +{plan.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                {/* Progress bar */}
                {userProgress.some(p => p.planId === plan.id) && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {isCompletedPlan(plan.id) ? 'Completed' : 'In Progress'}
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {getPlanProgress(plan.id)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-[#2c4c3b] h-1.5 rounded-full" 
                        style={{ width: `${getPlanProgress(plan.id)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Call to action */}
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#2c4c3b]/30 text-[#2c4c3b] hover:bg-[#2c4c3b]/10 
                             dark:border-[#2c4c3b]/50 dark:text-green-400 dark:hover:bg-[#2c4c3b]/20"
                  >
                    {userProgress.some(p => p.planId === plan.id) ? 'Continue Plan' : 'Start Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Book className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No plans found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanList;