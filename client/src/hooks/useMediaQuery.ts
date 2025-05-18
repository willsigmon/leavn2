import { useState, useEffect } from 'react';

/**
 * Custom hook that returns whether a media query matches
 * 
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state if window is available (client-side)
  const getMatches = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  useEffect(() => {
    // Bail early if no window (SSR)
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia(query);
    const handler = () => setMatches(mediaQuery.matches);

    // Set initial value
    handler();

    // Add listener for subsequent changes
    mediaQuery.addEventListener('change', handler);

    // Remove listener on cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}