/**
 * Type definitions for reading plans with rich contextual elements
 */

/**
 * Represents a single day in a reading plan
 */
export interface ReadingPlanDay {
  day: number;
  title: string;
  passages: string[]; // Scripture references (e.g., "Genesis 1:1-31")
  contextualNotes?: string;
  historicalContext?: string;
  theologicalConcepts?: string[];
  applicationPoints?: string[];
  reflectionQuestions?: string[];
  crossReferences?: string[];
}

/**
 * Represents a complete reading plan
 */
export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration: number; // Days in plan
  category: string; // e.g., "Old Testament", "New Testament", "Topical"
  tags: string[];
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  days: ReadingPlanDay[];
}

/**
 * User progress for a specific reading plan
 */
export interface ReadingPlanProgress {
  planId: string;
  startDate?: string;
  completedDays: Record<number, string>; // Day number -> completion date
  lastReadDate?: string;
  streak?: number;
}

/**
 * Represents all user progress across reading plans
 */
export interface UserProgress {
  [planId: string]: {
    startDate?: string;
    completedDays: Record<number, string>;
    lastReadDate?: string;
  };
}

/**
 * Contextual content shown in the sidebar
 */
export interface ContextualContent {
  type: 'historical' | 'theological' | 'application' | 'reflection' | 'references';
  title: string;
  content: string | string[];
}

/**
 * Verse content with annotations for rich display
 */
export interface AnnotatedVerse {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  notes?: string[];
  highlights?: string; // Color code
  bookmarked?: boolean;
  tags?: string[];
}