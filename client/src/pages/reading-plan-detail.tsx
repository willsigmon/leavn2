import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronLeft, Calendar, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useMobile } from "@/hooks/use-mobile";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile } = useMobile();
  const [, params] = useRoute<{ id: string }>("/reading-plan/:id");
  const planId = params?.id;

  const { data: plan, isLoading, error } = useQuery<ReadingPlan>({
    queryKey: ["/api/reading-plans", planId],
    enabled: !!planId,
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className={`container mx-auto py-6 px-4 ${isMobile ? "mt-16" : "mt-8"}`}>
        <div className="flex flex-col space-y-6">
          <Link href="/reading-plans">
            <Button variant="ghost" className="w-fit flex items-center gap-2 mb-4">
              <ChevronLeft size={16} />
              Back to Reading Plans
            </Button>
          </Link>
          
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-64 w-full rounded-lg mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load reading plan. Please try again later.
              </AlertDescription>
            </Alert>
          ) : plan ? (
            <>
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {plan.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {plan.description}
                </p>
                
                <div className="rounded-lg overflow-hidden mb-8">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="text-primary" />
                  <span className="font-medium">{plan.days} days</span>
                </div>
                
                <Separator className="my-6" />
                
                <h2 className="text-2xl font-semibold mb-4">Reading Schedule</h2>
                
                <div className="space-y-4">
                  {Array.isArray(plan.entries) ? plan.entries.map((entry) => (
                    <Card key={entry.day} className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Day {entry.day}</CardTitle>
                        <CardDescription>
                          {capitalizeFirstLetter(entry.book)} {entry.chapter}
                          {entry.startVerse ? `: ${entry.startVerse}${entry.endVerse ? `-${entry.endVerse}` : ''}` : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/bible/${entry.book}/${entry.chapter}`}>
                          <Button variant="outline" className="flex items-center gap-2 border-input hover:bg-accent hover:text-accent-foreground">
                            <BookOpen size={16} />
                            Read Passage
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )) : (
                    <Alert>
                      <AlertTitle>No Entries</AlertTitle>
                      <AlertDescription>
                        This reading plan doesn't have any entries yet.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Alert>
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                Reading plan not found. Please return to the reading plans page and try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  );
}