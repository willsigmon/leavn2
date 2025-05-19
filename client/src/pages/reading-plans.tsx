import React from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ReadingPlan } from '@/types/readingPlan';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Calendar, 
  Clock, 
  ScanSearch, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  FilterX,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function ReadingPlans() {
  const [_, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const { data: readingPlans, isLoading } = useQuery<ReadingPlan[]>({
    queryKey: ['/api/reading-plans'],
    retry: false,
  });

  const filteredPlans = React.useMemo(() => {
    if (!readingPlans) return [];

    let filtered = readingPlans;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query) || 
        plan.description.toLowerCase().includes(query) ||
        plan.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [readingPlans, selectedCategory, searchQuery]);

  const categories = React.useMemo(() => {
    if (!readingPlans) return [];
    const categorySet = new Set(readingPlans.map(plan => plan.category));
    return Array.from(categorySet);
  }, [readingPlans]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container max-w-6xl py-12 px-4">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Reading Plans</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Structured biblical studies to guide your spiritual journey through selected books and themes.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <ScanSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title, description or tag..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white">
            All Plans
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-[#d8e5d2] data-[state=active]:text-[#2c4c3b] dark:data-[state=active]:bg-[#3a6349] dark:data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border overflow-hidden">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map(plan => (
                <Card key={plan.id} className="border overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#345841]/40 dark:bg-[#2c4c3b]/60">
                      <Sparkles className="h-12 w-12 text-white/70" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-[#2c4c3b] dark:text-[#a5c2a5]">{plan.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration} days</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {plan.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-[#f0f4ed] hover:bg-[#e8efe5] text-[#2c4c3b] dark:bg-[#2c4c3b]/30 dark:text-[#a5c2a5] dark:hover:bg-[#2c4c3b]/40">
                          {tag}
                        </Badge>
                      ))}
                      {plan.tags.length > 3 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          +{plan.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-[#2c4c3b] hover:bg-[#3a6349] text-white"
                      onClick={() => navigate(`/reading-plans/${plan.id}`)}
                    >
                      View Plan
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Book className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No reading plans found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.` 
                  : `No reading plans available in this category.`}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create your own plan - only visible when logged in */}
      {isAuthenticated && (
        <div className="mt-16 p-6 border rounded-lg bg-muted/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Create Your Own Reading Plan</h3>
              <p className="text-muted-foreground">Design a custom Bible reading plan tailored to your specific interests and goals.</p>
            </div>
            <Button className="bg-[#2c4c3b] hover:bg-[#3a6349] text-white">
              Create Custom Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}