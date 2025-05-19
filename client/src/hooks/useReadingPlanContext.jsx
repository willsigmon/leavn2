import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchReadingPlans } from '../lib/api';

// Create a context for Reading Plan data
const ReadingPlanContext = createContext();

// Initial state
const initialState = {
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
  SET_USER_PROGRESS: 'SET_USER_PROGRESS',
};

// Reducer function
function readingPlanReducer(state, action) {
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
      const updatedProgress = {
        ...state.userProgress,
        [planId]: {
          ...state.userProgress[planId] || {},
          completedDays: {
            ...state.userProgress[planId]?.completedDays || {},
            [dayNumber]: completedAt || new Date().toISOString(),
          },
        },
      };
      
      // Save to localStorage
      localStorage.setItem('readingPlanProgress', JSON.stringify(updatedProgress));
      
      return {
        ...state,
        userProgress: updatedProgress,
      };
    }
    case actionTypes.UNMARK_DAY_COMPLETE: {
      const { planId, dayNumber } = action.payload;
      const updatedCompletedDays = { ...state.userProgress[planId]?.completedDays || {} };
      delete updatedCompletedDays[dayNumber];
      
      const updatedProgress = {
        ...state.userProgress,
        [planId]: {
          ...state.userProgress[planId] || {},
          completedDays: updatedCompletedDays,
        },
      };
      
      // Save to localStorage
      localStorage.setItem('readingPlanProgress', JSON.stringify(updatedProgress));
      
      return {
        ...state,
        userProgress: updatedProgress,
      };
    }
    case actionTypes.SET_USER_PROGRESS:
      return {
        ...state,
        userProgress: action.payload,
      };
    default:
      return state;
  }
}

// Provider component
export function ReadingPlanProvider({ children }) {
  const [state, dispatch] = useReducer(readingPlanReducer, initialState);

  // Load reading plans data
  useEffect(() => {
    const loadPlans = async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        const plansData = await fetchReadingPlans();
        dispatch({ type: actionTypes.SET_PLANS, payload: plansData });
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

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('readingPlanProgress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        dispatch({ type: actionTypes.SET_USER_PROGRESS, payload: parsedProgress });
      } catch (error) {
        console.error('Error parsing saved reading plan progress:', error);
      }
    }
  }, []);

  // Helper functions
  const markDayComplete = (planId, dayNumber, completedAt = null) => {
    dispatch({
      type: actionTypes.MARK_DAY_COMPLETE,
      payload: { planId, dayNumber, completedAt },
    });
  };

  const unmarkDayComplete = (planId, dayNumber) => {
    dispatch({
      type: actionTypes.UNMARK_DAY_COMPLETE,
      payload: { planId, dayNumber },
    });
  };

  // Calculate streak for a specific plan
  const calculateStreak = (planId) => {
    const now = new Date();
    const completedDays = state.userProgress[planId]?.completedDays || {};
    const completedDates = Object.values(completedDays)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b - a); // Sort descending (newest first)
    
    if (completedDates.length === 0) return 0;
    
    let streak = 1;
    let lastDate = completedDates[0];
    
    // Check if the most recent date is today or yesterday
    const isRecent = (
      lastDate.toDateString() === now.toDateString() || 
      lastDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()
    );
    
    if (!isRecent) return 0;
    
    // Count consecutive days
    for (let i = 1; i < completedDates.length; i++) {
      const currentDate = completedDates[i];
      const dayDifference = Math.round((lastDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (dayDifference === 1) {
        streak++;
        lastDate = currentDate;
      } else if (dayDifference === 0) {
        // Same day, continue checking
        lastDate = currentDate;
      } else {
        // Break in the streak
        break;
      }
    }
    
    return streak;
  };

  // Calculate completion percentage for a plan
  const calculateCompletion = (planId) => {
    const plan = state.plans.find(p => p.id === planId);
    if (!plan) return 0;
    
    const totalDays = plan.days.length;
    const completedDays = Object.keys(state.userProgress[planId]?.completedDays || {}).length;
    
    return Math.round((completedDays / totalDays) * 100);
  };

  // Get plan by ID
  const getPlanById = (planId) => {
    return state.plans.find(plan => plan.id === planId);
  };

  // Check if a day is completed
  const isDayCompleted = (planId, dayNumber) => {
    return !!state.userProgress[planId]?.completedDays?.[dayNumber];
  };

  // Get completion date for a day
  const getDayCompletionDate = (planId, dayNumber) => {
    return state.userProgress[planId]?.completedDays?.[dayNumber] || null;
  };

  const value = {
    plans: state.plans,
    isLoading: state.isLoading,
    error: state.error,
    userProgress: state.userProgress,
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
}

// Custom hook to use the Reading Plan context
export function useReadingPlan() {
  const context = useContext(ReadingPlanContext);
  if (context === undefined) {
    throw new Error('useReadingPlan must be used within a ReadingPlanProvider');
  }
  return context;
}