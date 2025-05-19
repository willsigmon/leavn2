/**
 * Types for reading plan features
 */

export interface ReadingPlanDay {
  id: string;
  title: string;
  passages: string[];
  summary?: string;
  historicalContext?: string;
  theologicalConcepts?: string[];
  reflectionQuestions?: string[];
  keyVerses?: string[];
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // Number of days
  category: string;
  tags: string[];
  coverImage?: string;
  days: ReadingPlanDay[];
}

export interface ReadingPlanProgress {
  planId: string;
  userId: string;
  completedDays: string[]; // Array of day IDs that have been completed
  currentDay: string; // ID of the current day
  startDate: Date;
  lastReadDate?: Date;
}

export interface ReadingPlanStats {
  totalPlans: number;
  completedPlans: number;
  currentPlans: number;
  daysRead: number;
  passagesRead: number;
  streakDays: number;
  favoriteCategory?: string;
}