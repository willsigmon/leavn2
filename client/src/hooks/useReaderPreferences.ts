import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ReaderPreferences, defaultPreferences } from '@/components/reader/ReaderSettings';
import { useAuth } from '@/hooks/useAuth';

export function useReaderPreferences() {
  const { isAuthenticated } = useAuth();
  const [hasAppliedDefaultPreferences, setHasAppliedDefaultPreferences] = useState(false);

  // Get preferences from API
  const { data: preferences } = useQuery({
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
      case 'small': return 14;
      case 'medium': return 18;
      case 'large': return 22;
      case 'x-large': return 26;
      default: return 18;
    }
  };

  // Convert lineSpacing string value to CSS line-height
  const getLineHeightValue = (): string => {
    const prefs = getPreferences();
    switch (prefs.lineSpacing) {
      case 'tight': return '1.3';
      case 'normal': return '1.6';
      case 'relaxed': return '1.8';
      case 'loose': return '2.2';
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
    
    const currentPrefs = getPreferences();
    const newReadingPosition = {
      ...currentPrefs.readingPosition,
      [`${book}-${chapter}`]: scrollPosition
    };
    
    await savePreferencesMutation.mutateAsync({
      readingPosition: newReadingPosition
    });
  };

  // Get reading position for current book and chapter
  const getReadingPosition = (book: string, chapter: number): number => {
    const prefs = getPreferences();
    return prefs.readingPosition[`${book}-${chapter}`] || 0;
  };

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<ReaderPreferences>) => {
    // If not authenticated, just store in localStorage
    if (!isAuthenticated) {
      const currentPrefs = getPreferences();
      const updatedPrefs = { ...currentPrefs, ...newPreferences };
      localStorage.setItem('readerPreferences', JSON.stringify(updatedPrefs));
      return;
    }

    // Otherwise save to database
    await savePreferencesMutation.mutateAsync(newPreferences);
  };

  // Apply CSS variables based on preferences
  const applyPreferences = (prefs: ReaderPreferences) => {
    // Set font size
    document.documentElement.style.setProperty(
      '--reader-font-size', 
      `${getFontSizeInPixels()}px`
    );
    
    // Set font family
    let fontFamily = prefs.fontFamily;
    if (prefs.isOpenDyslexicEnabled) {
      fontFamily = 'OpenDyslexic, sans-serif';
    } else if (prefs.fontFamily === 'serif') {
      fontFamily = '"Palatino Linotype", Georgia, serif';
    } else if (prefs.fontFamily === 'sans-serif') {
      fontFamily = 'Inter, system-ui, sans-serif';
    } else if (prefs.fontFamily === 'monospace') {
      fontFamily = 'monospace';
    }
    document.documentElement.style.setProperty('--reader-font-family', fontFamily);
    
    // Set line height
    document.documentElement.style.setProperty('--reader-line-height', getLineHeightValue());
    
    // Set theme
    const rootElement = document.documentElement;
    rootElement.classList.remove('theme-light', 'theme-dark', 'theme-sepia', 'theme-comfort-light');
    rootElement.classList.add(`theme-${prefs.theme}`);
  };

  // Apply preferences whenever they change
  useEffect(() => {
    // Try to load preferences from localStorage if not authenticated
    if (!isAuthenticated && !hasAppliedDefaultPreferences) {
      try {
        const storedPrefs = localStorage.getItem('readerPreferences');
        if (storedPrefs) {
          const parsedPrefs = JSON.parse(storedPrefs);
          applyPreferences({ ...defaultPreferences, ...parsedPrefs });
        } else {
          applyPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Error loading preferences from localStorage:', error);
        applyPreferences(defaultPreferences);
      }
      setHasAppliedDefaultPreferences(true);
    }
    
    // If authenticated and preferences are loaded, apply them
    if (preferences) {
      applyPreferences(getPreferences());
    }
  }, [preferences, isAuthenticated, hasAppliedDefaultPreferences]);

  return {
    preferences: getPreferences(),
    updatePreferences,
    saveReadingPosition,
    getReadingPosition,
    isLoading: !hasAppliedDefaultPreferences && !preferences,
  };
}