import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Initial state
const initialState = {
  plans: [],
  userProgress: {},
  activePlanId: null,
  activeDayId: null,
  isLoading: true,
  error: null
};

// Actions
const ACTIONS = {
  SET_PLANS: 'SET_PLANS',
  SET_USER_PROGRESS: 'SET_USER_PROGRESS',
  SET_ACTIVE_PLAN: 'SET_ACTIVE_PLAN',
  SET_ACTIVE_DAY: 'SET_ACTIVE_DAY',
  MARK_DAY_COMPLETED: 'MARK_DAY_COMPLETED',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PLANS:
      return { ...state, plans: action.payload, isLoading: false };
    
    case ACTIONS.SET_USER_PROGRESS:
      return { 
        ...state, 
        userProgress: {
          ...state.userProgress,
          [action.payload.planId]: action.payload
        },
        isLoading: false
      };
    
    case ACTIONS.SET_ACTIVE_PLAN:
      return { ...state, activePlanId: action.payload, isLoading: false };
    
    case ACTIONS.SET_ACTIVE_DAY:
      return { ...state, activeDayId: action.payload, isLoading: false };
    
    case ACTIONS.MARK_DAY_COMPLETED:
      const planId = action.payload.planId;
      const dayId = action.payload.dayId;
      
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          [planId]: {
            ...state.userProgress[planId],
            completedDays: [
              ...state.userProgress[planId]?.completedDays || [],
              dayId
            ]
          }
        }
      };
    
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    default:
      return state;
  }
}

// Create context
const ReadingPlanContext = createContext();

// Provider component
export const ReadingPlanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Fetch all reading plans
  const { data: plans, isLoading: isPlansLoading, error: plansError } = useQuery({
    queryKey: ['/api/reading-plans'],
  });
  
  // Update state when plans are loaded
  useEffect(() => {
    if (plans) {
      dispatch({ type: ACTIONS.SET_PLANS, payload: plans });
    }
    
    if (plansError) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: plansError.message });
    }
  }, [plans, plansError]);
  
  // Set active plan
  const setActivePlan = (planId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_PLAN, payload: planId });
  };
  
  // Set active day
  const setActiveDay = (dayId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_DAY, payload: dayId });
  };
  
  // Fetch plan progress if authenticated
  const fetchPlanProgress = async (planId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const response = await fetch(`/api/reading-plans/progress/${planId}`);
      
      if (response.ok) {
        const progressData = await response.json();
        dispatch({ 
          type: ACTIONS.SET_USER_PROGRESS, 
          payload: { planId, ...progressData }
        });
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch progress' });
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };
  
  // Mark a day as completed
  const markDayCompleted = async (planId, dayId) => {
    try {
      const response = await fetch(`/api/reading-plans/${planId}/days/${dayId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        dispatch({ 
          type: ACTIONS.MARK_DAY_COMPLETED, 
          payload: { planId, dayId }
        });
        // Refetch plan progress to get the updated data including nextDayId
        fetchPlanProgress(planId);
        return true;
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to mark day as complete' });
        return false;
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      return false;
    }
  };
  
  // Get active plan
  const getActivePlan = () => {
    if (!state.activePlanId) return null;
    return state.plans.find(plan => plan.id === state.activePlanId);
  };
  
  // Get active day
  const getActiveDay = () => {
    if (!state.activePlanId || !state.activeDayId) return null;
    
    const plan = getActivePlan();
    if (!plan) return null;
    
    return plan.days.find(day => day.id === state.activeDayId);
  };
  
  // Get plan progress
  const getPlanProgress = (planId) => {
    return state.userProgress[planId || state.activePlanId];
  };
  
  // Check if a day is completed
  const isDayCompleted = (planId, dayId) => {
    const progress = getPlanProgress(planId);
    if (!progress || !progress.completedDays) return false;
    return progress.completedDays.includes(dayId);
  };
  
  // Calculate plan completion percentage
  const getPlanCompletionPercentage = (planId) => {
    const targetPlanId = planId || state.activePlanId;
    const progress = getPlanProgress(targetPlanId);
    const plan = state.plans.find(p => p.id === targetPlanId);
    
    if (!progress || !plan) return 0;
    return Math.round((progress.completedDays.length / plan.days.length) * 100);
  };
  
  return (
    <ReadingPlanContext.Provider
      value={{
        ...state,
        setActivePlan,
        setActiveDay,
        fetchPlanProgress,
        markDayCompleted,
        getActivePlan,
        getActiveDay,
        getPlanProgress,
        isDayCompleted,
        getPlanCompletionPercentage,
      }}
    >
      {children}
    </ReadingPlanContext.Provider>
  );
};

// Custom hook to use the reading plan context
export const useReadingPlanContext = () => {
  const context = useContext(ReadingPlanContext);
  if (context === undefined) {
    throw new Error('useReadingPlanContext must be used within a ReadingPlanProvider');
  }
  return context;
};

// Export the same hook under the name that other components are already using
export const useReadingPlan = useReadingPlanContext;