import { lazy, ComponentType } from 'react';

// Enhanced lazy loading with prefetch capabilities
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  prefetch = false
) => {
  const LazyComponent = lazy(importFn);
  
  // Prefetch immediately if requested
  if (prefetch) {
    importFn().catch(() => {
      // Ignore prefetch errors
    });
  }
  
  return LazyComponent;
};

// Smart prefetch based on user interaction
export const usePrefetchOnHover = (importFn: () => Promise<any>) => {
  let prefetched = false;
  
  const handleMouseEnter = () => {
    if (!prefetched) {
      prefetched = true;
      importFn().catch(() => {
        prefetched = false; // Reset on error
      });
    }
  };
  
  return { onMouseEnter: handleMouseEnter };
};

// Critical resource preloader
export const preloadCriticalResources = () => {
  // Preload Supabase client early
  import('@/integrations/supabase/client');
  
  // Preload validation schemas
  import('@/lib/validation');
  
  // Preload UI components that are likely to be used
  import('@/components/ui/card');
  import('@/components/ui/button');
  import('@/components/ui/toast');
};