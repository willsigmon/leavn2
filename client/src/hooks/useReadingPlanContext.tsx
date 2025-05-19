import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchReadingPlans } from '../lib/api';
import { ReadingPlan, UserProgress } from '../types/readingPlan';

// Define types for our context
type ReadingPlanState = {
  plans: ReadingPlan[];
  userProgress: UserProgress;
  isLoading: boolean;
  error: string | null;
};

type ReadingPlanContextType = ReadingPlanState & {
  markDayComplete: (planId: string, dayNumber: number, completedAt?: string) => void;
  unmarkDayComplete: (planId: string, dayNumber: number) => void;
  calculateStreak: (planId: string) => number;
  calculateCompletion: (planId: string) => number;
  getPlanById: (planId: string) => ReadingPlan | undefined;
  isDayCompleted: (planId: string, dayNumber: number) => boolean;
  getDayCompletionDate: (planId: string, dayNumber: number) => string | null;
};

// Create a context for Reading Plan data
const ReadingPlanContext = createContext<ReadingPlanContextType | undefined>(undefined);

// Initial state
const initialState: ReadingPlanState = {
  plans: [],
  userProgress: {},
  isLoading: true,
  error: null,
};

// Action types
const actionTypes = {
  SET_PLANS: 'SET_PLANS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  MARK_DAY_COMPLETE: 'MARK_DAY_COMPLETE',
  UNMARK_DAY_COMPLETE: 'UNMARK_DAY_COMPLETE',
};

// Reducer function
const reducer = (state: ReadingPlanState, action: any): ReadingPlanState => {
  switch (action.type) {
    case actionTypes.SET_PLANS:
      return {
        ...state,
        plans: action.payload,
        isLoading: false,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case actionTypes.MARK_DAY_COMPLETE: {
      const { planId, dayNumber, completedAt } = action.payload;
      const date = completedAt || new Date().toISOString();
      
      // Create a new userProgress object with the updated plan
      const updatedProgress = {
        ...state.userProgress,
        [planId]: {
          ...state.userProgress[planId] || {},
          startDate: state.userProgress[planId]?.startDate || date,
          lastReadDate: date,
          completedDays: {
            ...state.userProgress[planId]?.completedDays || {},
            [dayNumber]: date,
          },
        },
      };
      
      return {
        ...state,
        userProgress: updatedProgress,
      };
    }
    case actionTypes.UNMARK_DAY_COMPLETE: {
      const { planId, dayNumber } = action.payload;
      
      // If plan progress doesn't exist, return current state
      if (!state.userProgress[planId]) {
        return state;
      }
      
      // Create a new completedDays object without the specified day
      const { [dayNumber]: removed, ...remainingDays } = state.userProgress[planId].completedDays || {};
      
      // Create a new userProgress object with the updated plan
      const updatedProgress = {
        ...state.userProgress,
        [planId]: {
          ...state.userProgress[planId],
          completedDays: remainingDays,
        },
      };
      
      return {
        ...state,
        userProgress: updatedProgress,
      };
    }
    default:
      return state;
  }
};

// Provider component
export const ReadingPlanProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Load reading plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const plans = await fetchReadingPlans();
        dispatch({ type: actionTypes.SET_PLANS, payload: plans });
      } catch (error) {
        console.error('Error loading reading plans:', error);
        dispatch({ 
          type: actionTypes.SET_ERROR, 
          payload: 'Failed to load reading plans. Please try again later.' 
        });
      }
    };
    
    loadPlans();
  }, []);
  
  // Load user progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('readingPlanProgress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        // Update state with saved progress
        dispatch({
          type: actionTypes.SET_PLANS,
          payload: state.plans.map(plan => ({
            ...plan,
            userProgress: parsedProgress[plan.id],
          })),
        });
        // Also set the userProgress state
        state.userProgress = parsedProgress;
      }
    } catch (error) {
      console.error('Error loading reading plan progress:', error);
    }
  }, []);
  
  // Save user progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(state.userProgress).length > 0) {
      localStorage.setItem('readingPlanProgress', JSON.stringify(state.userProgress));
    }
  }, [state.userProgress]);
  
  // Helper function to mark a day as complete
  const markDayComplete = (planId: string, dayNumber: number, completedAt?: string) => {
    dispatch({
      type: actionTypes.MARK_DAY_COMPLETE,
      payload: { planId, dayNumber, completedAt },
    });
  };
  
  // Helper function to unmark a day as complete
  const unmarkDayComplete = (planId: string, dayNumber: number) => {
    dispatch({
      type: actionTypes.UNMARK_DAY_COMPLETE,
      payload: { planId, dayNumber },
    });
  };
  
  // Helper function to calculate current streak for a plan
  const calculateStreak = (planId: string) => {
    const planProgress = state.userProgress[planId];
    if (!planProgress || !planProgress.completedDays || Object.keys(planProgress.completedDays).length === 0) {
      return 0;
    }
    
    // Get the plan to know how many days it has
    const plan = state.plans.find(p => p.id === planId);
    if (!plan) return 0;
    
    // Calculate days since last completed day
    const lastReadDate = planProgress.lastReadDate;
    if (!lastReadDate) return 0;
    
    const today = new Date();
    const lastRead = new Date(lastReadDate);
    
    // If last read date is not today or yesterday, streak is broken
    const daysDifference = Math.floor((today.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 1) return 0;
    
    // Count consecutive days completed
    let streak = 0;
    const completedDayNumbers = Object.keys(planProgress.completedDays)
      .map(day => parseInt(day, 10))
      .sort((a, b) => a - b);
    
    // Count consecutive days from start
    for (let i = 1; i <= plan.days.length; i++) {
      if (completedDayNumbers.includes(i)) {
        streak++;
      } else {
        break; // Break on first uncompleted day
      }
    }
    
    return streak;
  };
  
  // Helper function to calculate completion percentage for a plan
  const calculateCompletion = (planId: string) => {
    const planProgress = state.userProgress[planId];
    if (!planProgress || !planProgress.completedDays) {
      return 0;
    }
    
    const plan = state.plans.find(p => p.id === planId);
    if (!plan) return 0;
    
    const completedDays = Object.keys(planProgress.completedDays).length;
    const totalDays = plan.days.length;
    
    return Math.round((completedDays / totalDays) * 100);
  };
  
  // Helper function to get a plan by ID
  const getPlanById = (planId: string) => {
    return state.plans.find(plan => plan.id === planId);
  };
  
  // Helper function to check if a day is completed
  const isDayCompleted = (planId: string, dayNumber: number) => {
    return Boolean(
      state.userProgress[planId]?.completedDays && 
      state.userProgress[planId]?.completedDays[dayNumber]
    );
  };
  
  // Helper function to get the completion date for a day
  const getDayCompletionDate = (planId: string, dayNumber: number) => {
    if (!state.userProgress[planId]?.completedDays) return null;
    return state.userProgress[planId].completedDays[dayNumber] || null;
  };
  
  // Value object with state and actions
  const value = {
    ...state,
    markDayComplete,
    unmarkDayComplete,
    calculateStreak,
    calculateCompletion,
    getPlanById,
    isDayCompleted,
    getDayCompletionDate,
  };
  
  return (
    <ReadingPlanContext.Provider value={value}>
      {children}
    </ReadingPlanContext.Provider>
  );
};

// Custom hook to use the Reading Plan context
export const useReadingPlan = () => {
  const context = useContext(ReadingPlanContext);
  if (context === undefined) {
    throw new Error('useReadingPlan must be used within a ReadingPlanProvider');
  }
  return context;
};