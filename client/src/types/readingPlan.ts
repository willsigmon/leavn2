export interface ReadingPlanDay {
  id: string;
  title: string;
  passages: string[];
  contextualNotes: string;
  reflectionQuestions: string[];
  theologicalConcepts: string[];
  historicalContext: string;
  crossReferences: string[];
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  category: string;
  tags: string[];
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  days?: ReadingPlanDay[];
  coverImage?: string;
  completionTracking?: {
    startDate?: string;
    currentDay?: number;
    completedDays?: string[];
  };
}

export interface ReadingPlanProgress {
  planId: string;
  userId: string;
  startDate: string;
  currentDay: number;
  completedDays: string[];
  lastUpdated: string;
}