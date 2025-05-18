import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BibleReader from "@/pages/bible-reader";
import UniversalBibleReader from "@/pages/universal-bible-reader";
import EnhancedBibleReader from "@/pages/enhanced-bible-reader";
import NewBibleReader from "@/pages/BibleReader";
import NewReader from "@/pages/new-reader";
import ReadingPlans from "@/pages/reading-plans";
import ReadingPlanDetail from "@/pages/reading-plan-detail";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import { NavBar } from "./components/NavBar";
import Footer from "./components/layout/Footer";
import { lazy, Suspense } from "react";

// Lazily load legal and resource pages
const BibleTranslationsPage = lazy(() => import("./pages/resources/bible-translations"));
const PrivacyPolicyPage = lazy(() => import("./pages/legal/privacy-policy"));
const TermsOfServicePage = lazy(() => import("./pages/legal/terms-of-service"));

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/reader/:book/:chapter" component={BibleReader} />
          <Route path="/reader" component={BibleReader} />
          <Route path="/universal-reader/:book/:chapter" component={UniversalBibleReader} />
          <Route path="/universal-reader" component={UniversalBibleReader} />
          <Route path="/enhanced-reader/:book/:chapter" component={EnhancedBibleReader} />
          <Route path="/enhanced-reader" component={EnhancedBibleReader} />
          <Route path="/new-reader/:book/:chapter" component={NewReader} />
          <Route path="/new-reader" component={NewReader} />
          <Route path="/reading-plans" component={ReadingPlans} />
          <Route path="/reading-plan/:id" component={ReadingPlanDetail} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          
          {/* Lazily loaded pages */}
          <Route path="/resources/bible-translations">
            <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
              <BibleTranslationsPage />
            </Suspense>
          </Route>
          
          <Route path="/legal/privacy-policy">
            <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
              <PrivacyPolicyPage />
            </Suspense>
          </Route>
          
          <Route path="/legal/terms-of-service">
            <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
              <TermsOfServicePage />
            </Suspense>
          </Route>
          
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
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;