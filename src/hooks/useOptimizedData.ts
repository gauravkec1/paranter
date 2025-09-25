import { useState, useEffect, useCallback, useMemo } from 'react';
import { dedupedRequest } from '@/utils/networkOptimizations';
import { PerformanceMonitor } from '@/utils/performanceMonitor';

interface OptimizedDataConfig<T = any> {
  fetchFn: () => Promise<T[]>;
  cacheKey?: string;
  cacheTTL?: number;
  dependencies?: any[];
}

export const useOptimizedData = <T = any>(config: OptimizedDataConfig<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    fetchFn,
    cacheKey = 'default_cache_key',
    cacheTTL = 60000, // 1 minute
    dependencies = [],
  } = config;

  const monitor = PerformanceMonitor.getInstance();

  const fetchData = useCallback(async () => {
    monitor.measureStart(`fetch_${cacheKey}`);
    setLoading(true);
    setError(null);

    try {
      const result = await dedupedRequest(
        cacheKey,
        fetchFn,
        cacheTTL
      );

      setData(result as T[]);
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching data:`, err);
    } finally {
      setLoading(false);
      monitor.measureEnd(`fetch_${cacheKey}`);
    }
  }, [fetchFn, cacheKey, cacheTTL, monitor]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Memoized computed values
  const isEmpty = useMemo(() => data.length === 0, [data]);
  const count = useMemo(() => data.length, [data]);

  return {
    data,
    loading,
    error,
    refetch,
    isEmpty,
    count,
  };
};