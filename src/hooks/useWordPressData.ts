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
      } finally {
        // Nettoyer la promesse
        fetchPromises[route.key] = null;
      }
    })();

    // Stocker la promesse
    fetchPromises[route.key] = fetchPromise;
    
    return fetchPromise;
  }, []);

  // Helper function to get prioritized routes based on current page
  const getPrioritizedRoutes = useCallback((currentRouteKey: string | null): ApiRoute[][] => {
    const allRoutes = Object.values(apiRoutes);
    
    // Tier 1: Current page (highest priority)
    const currentRoute = currentRouteKey ? apiRoutes[currentRouteKey] : null;
    const tier1 = currentRoute ? [currentRoute] : [];
    
    // Tier 2: Related routes based on current page
    let tier2: ApiRoute[] = [];
    
    // Special logic for configurator pages
    if (currentRouteKey?.startsWith('configurateur')) {
      // If on configurateur page, prioritize all configurateur pages
      tier2 = allRoutes
        .filter(route => route.key.startsWith('configurateur') && route.key !== currentRouteKey)
        .sort((a, b) => {
          // Sort configurateur pages by their number
          const aNum = parseInt(a.key.replace('configurateur', '').replace('Home', '0')) || 0;
          const bNum = parseInt(b.key.replace('configurateur', '').replace('Home', '0')) || 0;
          return aNum - bNum;
        });
    } else {
      // For other pages, prioritize essential pages
      const essentialKeys = ['home', 'couteaux', 'about'];
      tier2 = allRoutes.filter(route => 
        essentialKeys.includes(route.key) && route.key !== currentRouteKey
      );
    }
    
    // Tier 3: All other routes
    const tier3 = allRoutes.filter(route => 
      !tier1.includes(route) && !tier2.includes(route)
    ).sort((a, b) => a.priority - b.priority);
    
    return [tier1, tier2, tier3];
  }, []);

  // Main loading effect
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadData = async () => {
      if (!isMountedRef.current) return;
      
      const currentRouteKey = getRouteKeyFromPath(pathname);
      console.log(`Current path: ${pathname}, Route key: ${currentRouteKey}`);
      
      // Only set loading to true if we don't have current page data
      const hasCurrentPageData = currentRouteKey && globalCache[currentRouteKey];
      if (!hasCurrentPageData) {
        setState(prevState => ({ 
          ...prevState, 
          loading: true, 
          error: null,
        }));
      }

      try {
        const [tier1, tier2, tier3] = getPrioritizedRoutes(currentRouteKey);
        
        // Tier 1: Load current page immediately (blocking)
        if (tier1.length > 0) {
          console.log('Loading Tier 1 (current page):', tier1.map(r => r.key));
          await Promise.all(tier1.map(route => fetchData(route, true)));
          
          // Mark loading as false as soon as current page is loaded
          if (isMountedRef.current) {
            setState(prevState => ({ ...prevState, loading: false }));
          }
        }
        
        // Tier 2: Load related/priority pages in parallel (non-blocking)
        if (tier2.length > 0 && isMountedRef.current) {
          console.log('Loading Tier 2 (priority pages):', tier2.map(r => r.key));
          
          // Load only routes that aren't already cached
          const tier2ToLoad = tier2.filter(route => !globalCache[route.key]);
          
          if (tier2ToLoad.length > 0) {
            // Start loading in parallel but don't wait
            Promise.all(tier2ToLoad.map(route => 
              fetchData(route).catch(error => {
                console.warn(`Failed to load tier 2 route ${route.key}:`, error);
                return null;
              })
            )).then(() => {
              console.log('Tier 2 loading complete');
            });
          }
        }
        
        // Tier 3: Load remaining pages with delay (background)
        if (tier3.length > 0 && isMountedRef.current) {
          // Add small delay to let Tier 2 start first
          setTimeout(() => {
            if (!isMountedRef.current) return;
            
            console.log('Loading Tier 3 (background pages):', tier3.map(r => r.key));
            
            const tier3ToLoad = tier3.filter(route => !globalCache[route.key]);
            
            if (tier3ToLoad.length > 0) {
              // Load with throttling (2 at a time)
              const loadInBatches = async (routes: ApiRoute[], batchSize = 2) => {
                for (let i = 0; i < routes.length; i += batchSize) {
                  if (!isMountedRef.current) break;
                  
                  const batch = routes.slice(i, i + batchSize);
                  await Promise.all(batch.map(route => 
                    fetchData(route).catch(error => {
                      console.warn(`Failed to load tier 3 route ${route.key}:`, error);
                      return null;
                    })
                  ));
                  
                  // Small delay between batches
                  if (i + batchSize < routes.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                  }
                }
              };
              
              loadInBatches(tier3ToLoad).then(() => {
                console.log('Tier 3 loading complete');
              });
            }
          }, 200);
        }
        
      } catch (error: unknown) {
        if (isMountedRef.current) {
          console.error('Error in loadData:', error);
          setState(prevState => ({ 
            ...prevState, 
            loading: false,
            error: error instanceof Error ? error : new Error(String(error))
          }));
        }
      }
    };
    
    loadData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [pathname, getPrioritizedRoutes, fetchData]);

  return state;
};

export default useWordPressData; 