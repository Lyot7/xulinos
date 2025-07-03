'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { apiRoutes, getRouteKeyFromPath, ApiRoute } from '@/utils/apiRoutes';
import { processWordPressData } from '@/utils/textEncoding';

// Cache global pour stocker les données entre les rendus
const globalCache: Record<string, unknown> = {};
const fetchPromises: Record<string, Promise<unknown> | null> = {};

interface WordPressData {
  [key: string]: unknown;
}

interface WordPressDataState {
  data: WordPressData;
  loading: boolean;
  error: Error | null;
  routeErrors: Record<string, Error | null>;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000,  // 5 seconds
};

// Exponential backoff retry function
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = RETRY_CONFIG.maxRetries,
  baseDelay: number = RETRY_CONFIG.baseDelay
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on 404 errors (page doesn't exist)
      if (lastError.message.includes('404')) {
        throw lastError;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), RETRY_CONFIG.maxDelay);
      
      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 200;
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} for fetch after ${delay + jitter}ms`);
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError!;
};

export const useWordPressData = () => {
  const pathname = usePathname();
  const [state, setState] = useState<WordPressDataState>({
    data: globalCache,
    loading: Object.keys(globalCache).length === 0,
    error: null,
    routeErrors: {},
  });
  
  const isMountedRef = useRef(true);
  const currentPathnameRef = useRef(pathname);
  
  useEffect(() => {
    currentPathnameRef.current = pathname;
  }, [pathname]);

  // Function to fetch data from a specific endpoint with promise caching and retry logic
  const fetchData = useCallback(async (route: ApiRoute, forceRefresh = false): Promise<unknown> => {
    if (!route || !route.endpoint) {
      throw new Error('Invalid route provided to fetchData');
    }

    // Si on force pas le refresh et qu'on a les données en cache, les retourner
    if (globalCache[route.key] && !forceRefresh) {
      console.log(`Using cached data for ${route.key}`);
      return globalCache[route.key];
    }

    // Si une promesse est en cours pour cette route, l'attendre
    if (fetchPromises[route.key] && !forceRefresh) {
      console.log(`Waiting for existing promise for ${route.key}`);
      return fetchPromises[route.key]!;
    }

    // Créer une nouvelle promesse de fetch avec retry logic
    const fetchPromise = (async () => {
      try {
        console.log(`Fetching data from ${route.key} endpoint: ${route.endpoint}`);
        
        const data = await retryWithBackoff(async () => {
          const response = await fetch(route.endpoint, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json',
              'Accept-Charset': 'utf-8'
            },
            cache: 'no-store',
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${route.key}: ${response.status} ${response.statusText}`);
          }
          
          const rawData = await response.json();
          
          // Process the data to fix UTF-8 encoding issues
          return processWordPressData(rawData);
        });
        
        console.log(`Data fetched and processed successfully for ${route.key}`);
        
        // Mettre à jour le cache global
        globalCache[route.key] = data;
        
        // Update state safely
        if (isMountedRef.current) {
          setState(prevState => ({
            ...prevState,
            data: {
              ...prevState.data,
              [route.key]: data,
            },
            routeErrors: {
              ...prevState.routeErrors,
              [route.key]: null,
            },
          }));
        }
        
        return data;
      } catch (error: unknown) {
        console.error(`Error fetching ${route.key}:`, error);
        
        const routeError = error instanceof Error ? error : new Error(String(error));
        
        if (isMountedRef.current) {
          setState(prevState => {
            const newRouteErrors = {
              ...prevState.routeErrors,
              [route.key]: routeError,
            };
            
            return {
              ...prevState,
              routeErrors: newRouteErrors,
              error: route.optional ? prevState.error : routeError,
            };
          });
        }
        
        throw routeError;
      }
    })();

    // Store the promise in the cache
    fetchPromises[route.key] = fetchPromise;
    
    return fetchPromise;
  }, []);

  // Main effect to load data based on current path
  useEffect(() => {
    const loadDataForPath = async () => {
      const routeKey = getRouteKeyFromPath(pathname);
      if (!routeKey) return;

      const route = apiRoutes[routeKey];
      if (!route) return;

      try {
        await fetchData(route);
        
        // Load couteaux data for home page as well
        if (routeKey === 'home' && apiRoutes.couteaux) {
          console.log('Loading couteaux data for home page');
          await fetchData(apiRoutes.couteaux);
        }
      } catch (error) {
        console.error(`Error loading data for route ${routeKey}:`, error);
      }
    };

    loadDataForPath();
  }, [pathname, fetchData]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { 
    data: state.data, 
    loading: state.loading, 
    error: state.error, 
    routeErrors: state.routeErrors 
  };
}