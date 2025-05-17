import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function ReadingPlans() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile } = useMobile();

  const { data: readingPlans, isLoading, error } = useQuery<ReadingPlan[]>({
    queryKey: ["/api/reading-plans"],
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className={`container mx-auto py-6 px-4 ${isMobile ? "mt-16" : "mt-8"}`}>
        <div className="flex flex-col space-y-6">
          <section>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Reading Plans
            </h1>
            <p className="text-muted-foreground mb-6">
              Follow structured approaches to reading the Bible with our curated reading plans.
            </p>
            
            <Separator className="my-6" />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>Failed to load reading plans. Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingPlans?.map((plan) => (
                  <Card key={plan.id} className="overflow-hidden flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={plan.image} 
                        alt={plan.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">{plan.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{plan.days}</span> days
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/reading-plan/${plan.id}`}>
                        <Button className="w-full">View Plan</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}