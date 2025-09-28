// Performance optimization utilities
import { lazy, ComponentType } from 'react';

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds
const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,    // 5 minutes
  MEDIUM: 15 * 60 * 1000,  // 15 minutes
  LONG: 60 * 60 * 1000,    // 1 hour
};

export const cacheManager = {
  set: (key: string, data: any, ttl: number = CACHE_TTL.MEDIUM) => {
    apiCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  },

  get: (key: string) => {
    const cached = apiCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      apiCache.delete(key);
      return null;
    }

    return cached.data;
  },

  clear: (pattern?: string) => {
    if (pattern) {
      for (const key of apiCache.keys()) {
        if (key.includes(pattern)) {
          apiCache.delete(key);
        }
      }
    } else {
      apiCache.clear();
    }
  }
};

// Optimized lazy loading with prefetching
export const createOptimizedLazy = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  prefetchCondition?: () => boolean
) => {
  // Prefetch on hover or user interaction
  if (prefetchCondition && prefetchCondition()) {
    importFunc();
  }

  return lazy(importFunc);
};

// Network status detection
export const getNetworkStatus = () => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    isOnline: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    saveData: connection?.saveData || false
  };
};

// Optimized image loading
export const createOptimizedImageLoader = () => {
  const imageCache = new Set<string>();

  return {
    preloadImage: (src: string): Promise<void> => {
      if (imageCache.has(src)) return Promise.resolve();

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCache.add(src);
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    },

    isImageCached: (src: string) => imageCache.has(src)
  };
};

// Bundle size optimization helpers
export const createChunkLoader = () => {
  const loadedChunks = new Set<string>();

  return {
    loadChunk: async (chunkName: string, loader: () => Promise<any>) => {
      if (loadedChunks.has(chunkName)) return;

      try {
        await loader();
        loadedChunks.add(chunkName);
      } catch (error) {
        console.error(`Failed to load chunk: ${chunkName}`, error);
      }
    },

    isChunkLoaded: (chunkName: string) => loadedChunks.has(chunkName)
  };
};

// Performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    performance.mark(`${name}-start`);
  },

  markEnd: (name: string) => {
    try {
      performance.mark(`${name}-end`);
      // Check if start mark exists before measuring
      const marks = performance.getEntriesByName(`${name}-start`, 'mark');
      if (marks.length > 0) {
        performance.measure(name, `${name}-start`, `${name}-end`);
      }
    } catch (error) {
      // Silently ignore performance measurement errors
      console.debug(`Performance measurement failed for ${name}:`, error);
    }
  },

  getMetrics: () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      // Load times
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      
      // Paint metrics
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      
      // Memory usage (if available)
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  }
};

// Debounce utility for API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

// Throttle utility for high-frequency events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Critical resource preloader
export const preloadCriticalResources = () => {
  // Preload important fonts
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
  ];

  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/src/assets/paranter-logo.png'
  ];

  const imageLoader = createOptimizedImageLoader();
  criticalImages.forEach(src => {
    imageLoader.preloadImage(src).catch(console.error);
  });
};

// Error boundary logger
export const logError = (error: Error, errorInfo?: any) => {
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.error('Application Error:', error, errorInfo);
  } else {
    console.error('Development Error:', error, errorInfo);
  }
};