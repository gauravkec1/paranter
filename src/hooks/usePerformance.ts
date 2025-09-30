import { useEffect, useState } from 'react';

// Preload critical components for faster navigation
export const usePreloadComponents = () => {
  useEffect(() => {
    // Preload commonly accessed routes in the background
    const preloadComponents = async () => {
      try {
        // Preload based on user role patterns
        const promises = [
          import('../pages/TeacherDashboard'),
          import('../pages/AdminDashboard'),
          import('../pages/FinancePortal'),
          import('../pages/DriverPortal'),
        ];
        
        // Preload components without blocking the UI
        await Promise.allSettled(promises);
      } catch (error) {
        // Silently fail - preloading is just an optimization
      }
    };

    // Start preloading after a short delay to not impact initial load
    const timer = setTimeout(preloadComponents, 2000);
    return () => clearTimeout(timer);
  }, []);
};

// Enhanced performance hooks
export const useOptimizedRendering = () => {
  useEffect(() => {
    // Enable hardware acceleration for smooth animations
    document.body.style.willChange = 'transform';
    
    // Cleanup on unmount
    return () => {
      document.body.style.willChange = 'auto';
    };
  }, []);
};

// Debounce hook for search inputs
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};