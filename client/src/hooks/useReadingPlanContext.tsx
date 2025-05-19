import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ReadingPlan, ReadingPlanDay } from '@/types/readingPlan';

interface ReadingPlanProgress {
  completedDays: string[];
  startDate?: string;
  lastUpdated?: string;
}

interface ReadingPlanState {
  plans: ReadingPlan[];
  activePlan: ReadingPlan | null;
  currentDay: ReadingPlanDay | null;
  loading: boolean;
  error: string | null;
  userProgress: Record<string, ReadingPlanProgress>;
}

type ReadingPlanAction =
  | { type: 'LOAD_PLANS'; payload: ReadingPlan[] }
  | { type: 'LOAD_PLANS_START' }
  | { type: 'LOAD_PLANS_ERROR'; payload: string }
  | { type: 'SET_ACTIVE_PLAN'; payload: ReadingPlan }
  | { type: 'SET_CURRENT_DAY'; payload: ReadingPlanDay }
  | { type: 'MARK_DAY_COMPLETE'; payload: { planId: string; dayId: string } }
  | { type: 'LOAD_USER_PROGRESS'; payload: Record<string, ReadingPlanProgress> }
  | { type: 'START_PLAN'; payload: { planId: string } };

interface ReadingPlanContextType {
  state: ReadingPlanState;
  dispatch: React.Dispatch<ReadingPlanAction>;
}

const ReadingPlanContext = createContext<ReadingPlanContextType | undefined>(undefined);

const initialState: ReadingPlanState = {
  plans: [],
  activePlan: null,
  currentDay: null,
  loading: false,
  error: null,
  userProgress: {},
};

function readingPlanReducer(state: ReadingPlanState, action: ReadingPlanAction): ReadingPlanState {
  switch (action.type) {
    case 'LOAD_PLANS_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_PLANS':
      return { ...state, plans: action.payload, loading: false };
    case 'LOAD_PLANS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_ACTIVE_PLAN':
      return { ...state, activePlan: action.payload };
    case 'SET_CURRENT_DAY':
      return { ...state, currentDay: action.payload };
    case 'MARK_DAY_COMPLETE': {
      const { planId, dayId } = action.payload;
      const now = new Date().toISOString();
      
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          [planId]: {
            ...state.userProgress[planId],
            completedDays: [
              ...(state.userProgress[planId]?.completedDays || []),
              dayId
            ],
            lastUpdated: now
          }
        }
      };
    }
    case 'START_PLAN': {
      const { planId: startPlanId } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          [startPlanId]: {
            completedDays: [],
            startDate: today,
            lastUpdated: new Date().toISOString()
          }
        }
      };
    }
    case 'LOAD_USER_PROGRESS':
      return {
        ...state,
        userProgress: action.payload
      };
    default:
      return state;
  }
}

export function ReadingPlanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(readingPlanReducer, initialState);
  
  // Load plans from API
  useEffect(() => {
    async function loadPlans() {
      try {
        dispatch({ type: 'LOAD_PLANS_START' });
        const response = await fetch('/api/reading-plans');
        const data = await response.json();
        dispatch({ type: 'LOAD_PLANS', payload: data });
      } catch (error) {
        console.error('Failed to load reading plans:', error);
        dispatch({ 
          type: 'LOAD_PLANS_ERROR', 
          payload: 'Failed to load reading plans. Please try again later.' 
        });
      }
    }
    
    loadPlans();
    
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('readingPlanProgress');
    if (savedProgress) {
      try {
        dispatch({ 
          type: 'LOAD_USER_PROGRESS', 
          payload: JSON.parse(savedProgress) 
        });
      } catch (e) {
        console.error('Error parsing saved reading plan progress', e);
        localStorage.removeItem('readingPlanProgress');
      }
    }
  }, []);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      'readingPlanProgress', 
      JSON.stringify(state.userProgress)
    );
  }, [state.userProgress]);
  
  // Sync with server when online (could be optimized with a queue system for offline changes)
  useEffect(() => {
    async function syncProgress() {
      if (Object.keys(state.userProgress).length === 0) return;
      
      // Only sync if we're online
      if (!navigator.onLine) return;
      
      try {
        // For each plan with progress, sync to server
        Object.entries(state.userProgress).forEach(async ([planId, progress]) => {
          await fetch(`/api/reading-plans/${planId}/progress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              planId,
              completedDays: progress.completedDays,
              action: 'update'
            })
          });
        });
      } catch (error) {
        console.error('Failed to sync reading plan progress:', error);
      }
    }
    
    syncProgress();
  }, [state.userProgress]);
  
  return (
    <ReadingPlanContext.Provider value={{ state, dispatch }}>
      {children}
    </ReadingPlanContext.Provider>
  );
}

export function useReadingPlan() {
  const context = useContext(ReadingPlanContext);
  if (context === undefined) {
    throw new Error('useReadingPlan must be used within a ReadingPlanProvider');
  }
  return context;
}