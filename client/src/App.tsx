import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './lib/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Home from './pages/home';
import BibleReader from './pages/bible-reader';
import ReadingPlans from './pages/reading-plans';
import ReadingPlanDetail from './pages/reading-plan-detail';
import Login from './pages/login';
import Profile from './pages/profile';
import Settings from './pages/settings';
import NotFound from './pages/not-found';
import { NavBar } from './components/NavBar';

// Lazy-loaded components
const BibleTranslationsPage = React.lazy(() => import('./pages/resources/bible-translations'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/legal/privacy-policy'));
const TermsOfServicePage = React.lazy(() => import('./pages/legal/terms-of-service'));

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          {/* Bible Reader Routes - All consolidated under /reader */}
          <Route path="/reader/:book?/:chapter?/:verse?" component={BibleReader} />

          {/* Legacy routes that redirect to the main reader */}
          <Route path="/bible/:book?/:chapter?/:verse?">
            {(params) => {
              const { book = 'Genesis', chapter = '1', verse } = params;
              const path = verse ? `/reader/${book}/${chapter}/${verse}` : `/reader/${book}/${chapter}`;
              return <Redirect to={path} />;
            }}
          </Route>
          <Route path="/enhanced-reader/:book?/:chapter?">
            {(params) => {
              const { book = 'Genesis', chapter = '1' } = params;
              return <Redirect to={`/reader/${book}/${chapter}`} />;
            }}
          </Route>
          <Route path="/new-reader/:book?/:chapter?">
            {(params) => {
              const { book = 'Genesis', chapter = '1' } = params;
              return <Redirect to={`/reader/${book}/${chapter}`} />;
            }}
          </Route>
          <Route path="/universal-reader/:book?/:chapter?">
            {(params) => {
              const { book = 'Genesis', chapter = '1' } = params;
              return <Redirect to={`/reader/${book}/${chapter}`} />;
            }}
          </Route>
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
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}