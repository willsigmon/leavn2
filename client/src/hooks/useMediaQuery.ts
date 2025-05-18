import { useState, useEffect } from 'react';

/**
 * A hook that returns whether a media query matches or not.
 * 
 * @param query The media query to match against
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial state
    setMatches(mediaQuery.matches);
    
    // Define listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener('change', listener);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;