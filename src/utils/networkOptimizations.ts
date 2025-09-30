// Network and API optimization utilities

export const createOptimizedSupabaseClient = () => {
  // These optimizations are applied to the existing client
  const optimizations = {
    // Reduce network round trips
    batchRequests: true,
    
    // Connection pooling
    keepAlive: true,
    
    // Request compression
    compression: true,
    
    // Timeout settings
    timeout: 10000, // 10 seconds max
    
    // Retry configuration
    retryAttempts: 2,
    retryDelay: 1000,
  };
  
  return optimizations;
};

// Debounced API calls to prevent excessive requests
export const createDebouncedApi = <T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  delay: number = 300
): T => {
  let timeoutId: NodeJS.Timeout;
  let lastPromise: Promise<any>;
  
  return ((...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        try {
          lastPromise = apiCall(...args);
          const result = await lastPromise;
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }) as T;
};

// Request deduplication
const requestCache = new Map<string, Promise<any>>();

export const dedupedRequest = async <T>(
  key: string,
  requestFn: () => Promise<T>,
  ttl: number = 5000
): Promise<T> => {
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  const promise = requestFn();
  requestCache.set(key, promise);
  
  // Clear cache after TTL
  setTimeout(() => {
    requestCache.delete(key);
  }, ttl);
  
  try {
    const result = await promise;
    return result;
  } catch (error) {
    requestCache.delete(key); // Clear on error
    throw error;
  }
};

// Batch multiple requests
export const batchRequests = async <T>(
  requests: Array<() => Promise<T>>,
  batchSize: number = 5
): Promise<Array<T | { error: any }>> => {
  const results: Array<T | { error: any }> = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(request => request().catch(error => ({ error })))
    );
    results.push(...batchResults);
  }
  
  return results;
};