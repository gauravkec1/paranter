import React from 'react';

// Minimal performance monitor for development
export const usePerformanceMonitor = () => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Monitor critical performance metrics
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log(`Load: ${Math.round(navEntry.loadEventEnd - navEntry.loadEventStart)}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      return () => observer.disconnect();
    }
  }, []);
};

// Instant component preloader
export const useInstantPreload = () => {
  React.useEffect(() => {
    // Preload everything immediately
    const preloadAll = () => {
      const criticalImports = [
        () => import('../pages/Index'),
        () => import('../pages/TeacherDashboard'),
        () => import('../pages/AdminDashboard'),
        () => import('../pages/FinancePortal'),
        () => import('../pages/DriverPortal'),
      ];
      
      // Fire all imports simultaneously
      criticalImports.forEach(importFn => importFn());
    };
    
    // Execute immediately
    preloadAll();
  }, []);
};

// Aggressive rendering optimization
export const useMaxPerformance = () => {
  React.useEffect(() => {
    // Force maximum performance settings
    document.body.style.willChange = 'transform';
    document.body.style.contain = 'layout style paint';
    document.body.style.isolation = 'isolate';
    
    // Disable smooth scrolling for instant response
    document.documentElement.style.scrollBehavior = 'auto';
    
    return () => {
      document.body.style.willChange = '';
      document.body.style.contain = '';
      document.body.style.isolation = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
};