import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Reader from "@/pages/reader/index";
import ReadingPlans from "@/pages/reading-plans";
import ReadingPlanDetail from "@/pages/reading-plan-detail";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Explorer from "@/pages/explorer";
import Landing from "./pages/landing";
import LandingOptimized from "./pages/LandingOptimized";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useAuth";
import { ReadingPlanProvider } from "./hooks/useReadingPlanContext";
import { NavBar } from "./components/NavBar";
import Footer from "./components/layout/Footer";
import { lazy, Suspense, ReactNode } from "react";

// Lazily load legal and resource pages
const BibleTranslationsPage = lazy(() => import("./pages/resources/bible-translations"));
const PrivacyPolicyPage = lazy(() => import("./pages/legal/privacy-policy"));
const TermsOfServicePage = lazy(() => import("./pages/legal/terms-of-service"));

// App Layout component for pages that need navbar and footer
const AppLayout = ({ children }: { children: ReactNode }) => (
  <>
    <NavBar />
    <main className="flex-1">{children}</main>
    <Footer />
  </>
);

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Switch>
        {/* Optimized Landing page - no navbar */}
        <Route path="/" component={LandingOptimized} />
        
        {/* Original Landing page for comparison */}
        <Route path="/landing-original" component={Landing} />
        
        {/* Main app entry point */}
        <Route path="/app">
          <AppLayout>
            <Home />
          </AppLayout>
        </Route>
        
        {/* Reader routes */}
        <Route path="/reader">
          <AppLayout>
            <Reader />
          </AppLayout>
        </Route>
        
        <Route path="/reader/:book">
          <AppLayout>
            <Reader />
          </AppLayout>
        </Route>
        
        <Route path="/reader/:book/:chapter">
          <AppLayout>
            <Reader />
          </AppLayout>
        </Route>
        
        {/* Reading plans */}
        <Route path="/reading-plans">
          <AppLayout>
            <ReadingPlans />
          </AppLayout>
        </Route>
        
        <Route path="/reading-plans/:planId">
          <AppLayout>
            <ReadingPlanDetail />
          </AppLayout>
        </Route>
        
        <Route path="/reading-plans/:planId/:dayId">
          <AppLayout>
            <ReadingPlanDetail />
          </AppLayout>
        </Route>
        
        {/* Account and settings */}
        <Route path="/login">
          <AppLayout>
            <Login />
          </AppLayout>
        </Route>
        
        <Route path="/profile">
          <AppLayout>
            <Profile />
          </AppLayout>
        </Route>
        
        <Route path="/settings">
          <AppLayout>
            <Settings />
          </AppLayout>
        </Route>
        
        {/* Exploration */}
        <Route path="/explorer">
          <AppLayout>
            <Explorer />
          </AppLayout>
        </Route>
        
        <Route path="/concept-explorer">
          <AppLayout>
            <Explorer />
          </AppLayout>
        </Route>
        
        {/* Lazily loaded pages */}
        <Route path="/resources/bible-translations">
          <AppLayout>
            <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
              <BibleTranslationsPage />
            </Suspense>
          </AppLayout>
        </Route>
        
        <Route path="/legal/privacy-policy">
          <AppLayout>
            <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
              <PrivacyPolicyPage />
            </Suspense>
          </AppLayout>
        </Route>
        
        <Route path="/legal/terms-of-service">
          <AppLayout>
            <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
              <TermsOfServicePage />
            </Suspense>
          </AppLayout>
        </Route>
        
        {/* Fallback route */}
        <Route>
          <AppLayout>
            <NotFound />
          </AppLayout>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ReadingPlanProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ReadingPlanProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;