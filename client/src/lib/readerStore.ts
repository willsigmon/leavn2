import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for reader settings
export type FontFamily = 'serif' | 'sans' | 'mono';
export type ThemeMode = 'light' | 'dark' | 'warm';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type LineSpacing = 'tight' | 'normal' | 'relaxed' | 'loose';
export type TextAlignment = 'left' | 'justify' | 'center';
export type MarginSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ReadingGoal = { minutes: number; streak: number; lastRead: string | null };

interface BookmarkPosition {
  id: string;
  bookId: string;
  book: string;
  chapter: number;
  verse: number;
  position: number;
  timestamp: string;
  label?: string;
}

interface Highlight {
  id: string;
  bookId: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
  note?: string;
  timestamp: string;
}

interface ReaderStore {
  // Typography settings
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  textAlignment: TextAlignment;
  marginSize: MarginSize;
  
  // Theme settings
  theme: ThemeMode;
  warmthLevel: number; // 0-100 for amber overlay intensity
  
  // Reading position
  currentBook: string;
  currentChapter: number;
  currentVerse: number;
  scrollPosition: number;
  
  // Features
  bookmarks: BookmarkPosition[];
  highlights: Highlight[];
  readingGoal: ReadingGoal | null;
  splitViewEnabled: boolean;
  flashcardsEnabled: boolean;
  
  // Actions
  setTypographySettings: (settings: {
    fontFamily?: FontFamily;
    fontSize?: FontSize;
    lineSpacing?: LineSpacing;
    textAlignment?: TextAlignment;
    marginSize?: MarginSize;
  }) => void;
  setTheme: (theme: ThemeMode) => void;
  setWarmthLevel: (level: number) => void;
  setCurrentPosition: (position: { book: string; chapter: number; verse: number; scrollPosition?: number }) => void;
  addBookmark: (bookmark: Omit<BookmarkPosition, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  addHighlight: (highlight: Omit<Highlight, 'id' | 'timestamp'>) => void;
  updateHighlight: (id: string, updates: Partial<Omit<Highlight, 'id'>>) => void;
  removeHighlight: (id: string) => void;
  toggleSplitView: () => void;
  toggleFlashcards: () => void;
  updateReadingGoal: (goal: Partial<ReadingGoal>) => void;
  recordReadingSession: (minutes: number) => void;
}

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set) => ({
      // Default settings
      fontFamily: 'serif',
      fontSize: 'base',
      lineSpacing: 'normal',
      textAlignment: 'left',
      marginSize: 'md',
      
      // Theme
      theme: 'light',
      warmthLevel: 0,
      
      // Position
      currentBook: 'Genesis',
      currentChapter: 1,
      currentVerse: 1,
      scrollPosition: 0,
      
      // Features
      bookmarks: [],
      highlights: [],
      readingGoal: null,
      splitViewEnabled: false,
      flashcardsEnabled: false,
      
      // Actions
      setTypographySettings: (settings) => set((state) => ({ ...state, ...settings })),
      
      setTheme: (theme) => set({ theme }),
      
      setWarmthLevel: (warmthLevel) => set({ warmthLevel }),
      
      setCurrentPosition: ({ book, chapter, verse, scrollPosition }) => 
        set((state) => ({ 
          ...state, 
          currentBook: book, 
          currentChapter: chapter, 
          currentVerse: verse,
          scrollPosition: scrollPosition !== undefined ? scrollPosition : state.scrollPosition
        })),
      
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [
          ...state.bookmarks,
          {
            ...bookmark,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
          }
        ]
      })),
      
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== id)
      })),
      
      addHighlight: (highlight) => set((state) => ({
        highlights: [
          ...state.highlights,
          {
            ...highlight,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
          }
        ]
      })),
      
      updateHighlight: (id, updates) => set((state) => ({
        highlights: state.highlights.map(highlight => 
          highlight.id === id ? { ...highlight, ...updates } : highlight
        )
      })),
      
      removeHighlight: (id) => set((state) => ({
        highlights: state.highlights.filter(highlight => highlight.id !== id)
      })),
      
      toggleSplitView: () => set((state) => ({ 
        splitViewEnabled: !state.splitViewEnabled 
      })),
      
      toggleFlashcards: () => set((state) => ({ 
        flashcardsEnabled: !state.flashcardsEnabled 
      })),
      
      updateReadingGoal: (goal) => set((state) => {
        if (!state.readingGoal) {
          return {
            readingGoal: {
              minutes: goal.minutes ?? 0,
              streak: goal.streak ?? 0,
              lastRead: goal.lastRead ?? null
            }
          };
        }
        
        return {
          readingGoal: {
            ...state.readingGoal,
            ...goal
          }
        };
      }),
      
      recordReadingSession: (minutes) => set((state) => {
        if (!state.readingGoal) return state;
        
        const today = new Date().toISOString().split('T')[0];
        const lastReadDate = state.readingGoal.lastRead ? 
          new Date(state.readingGoal.lastRead).toISOString().split('T')[0] : null;
        
        // If last read was more than 7 days ago, reset streak
        const resetStreak = !lastReadDate || 
          (new Date(today).getTime() - new Date(lastReadDate).getTime() > 7 * 24 * 60 * 60 * 1000);
        
        // If last read was yesterday or today, maintain/increment streak
        const incrementStreak = lastReadDate && 
          (today === lastReadDate || 
           new Date(today).getTime() - new Date(lastReadDate).getTime() <= 24 * 60 * 60 * 1000);
        
        return {
          readingGoal: {
            ...state.readingGoal,
            lastRead: today,
            streak: resetStreak ? 1 : (incrementStreak ? state.readingGoal.streak + 1 : state.readingGoal.streak)
          }
        };
      })
    }),
    {
      name: 'leavn-reader-store',
    }
  )
);