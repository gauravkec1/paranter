import { useEffect, useState } from 'react';

// Preload critical components for faster navigation
export const usePreloadComponents = () => {
  useEffect(() => {
    // Immediate preloading for instant navigation
    const preloadComponents = async () => {
      try {
        // Preload all critical components immediately
        const promises = [
          import('../pages/TeacherDashboard'),
          import('../pages/AdminDashboard'),
          import('../pages/FinancePortal'),
          import('../pages/DriverPortal'),
          import('../pages/Index'),
        ];
        
        // Start preloading immediately
        Promise.allSettled(promises);
      } catch (error) {
        // Silently fail
      }
    };

    // Immediate execution - no delay
    preloadComponents();
  }, []);
};

// Enhanced performance hooks
export const useOptimizedRendering = () => {
  useEffect(() => {
    // Aggressive performance optimizations
    document.body.style.willChange = 'transform';
    document.body.style.transform = 'translateZ(0)'; // Force hardware acceleration
    document.body.style.backfaceVisibility = 'hidden';
    
    // Reduce paint and layout costs
    document.body.style.contain = 'layout style paint';
    
    return () => {
      document.body.style.willChange = 'auto';
      document.body.style.transform = '';
      document.body.style.backfaceVisibility = '';
      document.body.style.contain = '';
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