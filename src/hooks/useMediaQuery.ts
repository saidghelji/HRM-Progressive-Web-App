import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * @param query Media query string like '(min-width: 768px)'
 * @returns Boolean indicating if the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state initially
    setMatches(media.matches);
    
    // Define a callback function to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the callback as a listener for changes to the media query
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;