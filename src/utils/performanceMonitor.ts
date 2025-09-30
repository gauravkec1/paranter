// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public measureStart(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  public measureEnd(label: string): number {
    const start = this.metrics.get(`${label}_start`);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    this.metrics.set(`${label}_duration`, duration);
    
    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  public getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }

  public getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  public clear(): void {
    this.metrics.clear();
  }
}

// Helper for measuring React component render times
export const measureRender = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    start: () => monitor.measureStart(`render_${componentName}`),
    end: () => monitor.measureEnd(`render_${componentName}`),
  };
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};