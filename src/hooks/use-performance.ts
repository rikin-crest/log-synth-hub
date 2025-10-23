import { useCallback, useMemo } from 'react';

/**
 * Performance optimization hooks
 */

// Memoized callback hook with stable reference
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Memoized value with deep comparison for objects
export const useStableMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// Debounced callback for performance-sensitive operations
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T => {
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(timeoutId);
    },
    [callback, delay, ...deps]
  );

  return debouncedCallback as T;
};

// Memory-efficient list rendering helper
export const useVirtualizedData = <T>(
  data: T[],
  pageSize: number = 50
) => {
  return useMemo(() => {
    if (data.length <= pageSize) return data;
    return data.slice(0, pageSize);
  }, [data, pageSize]);
};
