import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { UserPreferences } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

// Define types for reader preferences
export interface ReaderPreferences {
  fontSize: string;
  fontFamily: string;
  lineSpacing: string;
  theme: string;
  isOpenDyslexicEnabled: boolean;
  readingPosition?: any;
}

// Default preferences if user has none saved
const defaultPreferences: ReaderPreferences = {
  fontSize: 'medium',
  fontFamily: 'serif',
  lineSpacing: 'normal',
  theme: 'light',
  isOpenDyslexicEnabled: false,
  readingPosition: {}
};

export function useReaderPreferences() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['/api/preferences'],
    enabled: isAuthenticated,
  });

  // Get merged preferences (defaults + user settings)
  const getPreferences = (): ReaderPreferences => {
    if (!preferences) {
      return defaultPreferences;
    }
    
    // Cast preferences as any to avoid TypeScript property access errors
    const prefs = preferences as any;
    
    return {
      fontSize: prefs.fontSize || defaultPreferences.fontSize,
      fontFamily: prefs.fontFamily || defaultPreferences.fontFamily,
      lineSpacing: prefs.lineSpacing || defaultPreferences.lineSpacing,
      theme: prefs.theme || defaultPreferences.theme,
      isOpenDyslexicEnabled: prefs.isOpenDyslexicEnabled || defaultPreferences.isOpenDyslexicEnabled,
      readingPosition: prefs.readingPosition || defaultPreferences.readingPosition
    };
  };

  // Convert fontSize string value to actual pixel size
  const getFontSizeInPixels = (): number => {
    const prefs = getPreferences();
    switch (prefs.fontSize) {
      case 'small': return 16;
      case 'medium': return 18;
      case 'large': return 20;
      case 'x-large': return 22;
      default: return 18;
    }
  };

  // Convert lineSpacing string value to actual line height value
  const getLineHeightValue = (): string => {
    const prefs = getPreferences();
    switch (prefs.lineSpacing) {
      case 'tight': return '1.3';
      case 'normal': return '1.6';
      case 'relaxed': return '2';
      default: return '1.6';
    }
  };

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: (newPreferences: Partial<ReaderPreferences>) => {
      return fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences),
        credentials: 'include'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
    }
  });

  // Save reading position for current book and chapter
  const saveReadingPosition = async (book: string, chapter: number, scrollPosition: number) => {
    if (!isAuthenticated) return;
    
    const currentReadingPosition = getPreferences().readingPosition || {};
    const position = {
      readingPosition: {
        ...currentReadingPosition,
        [`${book.toLowerCase()}_${chapter}`]: scrollPosition
      }
    };
    
    return savePreferencesMutation.mutate(position);
  };

  // Get saved reading position for book and chapter
  const getReadingPosition = (book: string, chapter: number): number => {
    const prefs = getPreferences();
    const position = prefs.readingPosition?.[`${book.toLowerCase()}_${chapter}`];
    return position || 0;
  };

  return {
    preferences: getPreferences(),
    isLoading,
    savePreferences: (prefs: Partial<ReaderPreferences>) => savePreferencesMutation.mutate(prefs),
    saveReadingPosition,
    getReadingPosition,
    getFontSizeInPixels,
    getLineHeightValue
  };
}