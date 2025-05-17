import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BibleReader from "@/pages/bible-reader";
import ReadingPlans from "@/pages/reading-plans";
import ReadingPlanDetail from "@/pages/reading-plan-detail";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import { NavBar } from "./components/NavBar";
import Footer from "./components/layout/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/bible/:book/:chapter" component={BibleReader} />
          <Route path="/reading-plans" component={ReadingPlans} />
          <Route path="/reading-plan/:id" component={ReadingPlanDetail} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/resources/bible-translations" component={() => import('./pages/resources/bible-translations').then(module => module.default)} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
