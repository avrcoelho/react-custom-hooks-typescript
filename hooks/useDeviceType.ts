import { useState, useEffect } from 'react'

export const useDeviceType = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState( false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia '(max-width: 1279px)');
    
    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile0rTablet(event.matches);
    };

    setIsMobileOrTablet(mediaQuery.matches);

    mediaQueryaddEventListener('change', handleResize);

    return() => {
      mediaQuery. removeEventListener( 'change', handleResize);
    }
 }, []);
