/**
 * API Request Cache & Deduplication Layer
 *
 * Prevents duplicate API calls by:
 * 1. Caching successful responses with TTL
 * 2. Deduplicating in-flight requests (same params = same promise)
 * 3. Allowing manual cache invalidation
 *
 * Usage:
 *   const data = await cachedApiCall('bookings', params, fetchFn, ttl);
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface InFlightRequest {
  promise: Promise<any>;
  timestamp: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private inFlight: Map<string, InFlightRequest> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired cache entries every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30000);
  }

  /**
   * Generate cache key from endpoint and parameters
   */
  private generateKey(endpoint: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${JSON.stringify(params[key])}`)
      .join("|");
    return `${endpoint}?${sortedParams}`;
  }

  /**
   * Check if cached entry is still valid
   */
  private isValidCache(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Main cache function - deduplicates and caches API calls
   */
  async get<T>(
    endpoint: string,
    fetcher: () => Promise<T>,
    options: {
      params?: Record<string, any>;
      ttl?: number; // milliseconds, default 10000 (10 sec)
    } = {},
  ): Promise<T> {
    const { params, ttl = 10000 } = options;
    const cacheKey = this.generateKey(endpoint, params);

    // Check if valid cached data exists
    if (this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      if (this.isValidCache(entry)) {
        return entry.data;
      }
      // Expired, remove it
      this.cache.delete(cacheKey);
    }

    // Check if request is already in-flight
    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey)!.promise;
    }

    // Make new request and track it
    const promise = fetcher()
      .then((data) => {
        // Cache successful response
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl,
        });
        // Remove from in-flight
        this.inFlight.delete(cacheKey);
        return data;
      })
      .catch((error) => {
        // Remove from in-flight on error but don't cache the error
        this.inFlight.delete(cacheKey);
        throw error;
      });

    // Track in-flight request
    this.inFlight.set(cacheKey, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  /**
   * Invalidate specific cache entries
   */
  invalidate(endpoint?: string): void {
    if (!endpoint) {
      // Clear all cache
      this.cache.clear();
      return;
    }

    // Clear entries matching this endpoint
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(endpoint)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (!this.isValidCache(entry)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));

    // Also cleanup old in-flight requests (older than 60 seconds, likely abandoned)
    const inFlightKeysToDelete: string[] = [];
    this.inFlight.forEach((request, key) => {
      if (Date.now() - request.timestamp > 60000) {
        inFlightKeysToDelete.push(key);
      }
    });
    inFlightKeysToDelete.forEach((key) => this.inFlight.delete(key));
  }

  /**
   * Get cache statistics (for debugging)
   */
  getStats(): {
    cacheSize: number;
    inFlightSize: number;
    cacheEntries: string[];
  } {
    return {
      cacheSize: this.cache.size,
      inFlightSize: this.inFlight.size,
      cacheEntries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Destroy cache and cleanup intervals
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
    this.inFlight.clear();
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

/**
 * Hook to invalidate cache on component unmount or prop change
 */
export function useCacheInvalidation(
  endpoint: string,
  deps: React.DependencyList = [],
) {
  const React = require("react");

  React.useEffect(() => {
    return () => {
      apiCache.invalidate(endpoint);
    };
  }, [endpoint, ...deps]);
}
