import { useEffect, useState } from "react";
import { apiRoutes } from "@/utils/apiRoutes";

export default function useWordPressData() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pending = Object.keys(apiRoutes).length;

    setLoading(true);
    setError(null);

    Object.values(apiRoutes).forEach(async (route) => {
      try {
        const res = await fetch(route.endpoint);
        if (!res.ok) throw new Error(`${route.key}: ${res.status}`);
        const json = await res.json();

        if (!isMounted) return;

        setData(prev => ({
          ...prev,
          [route.key]: json,
        }));
      } catch (err) {
        console.warn(`Erreur fetch ${route.key} :`, err);
        if (isMounted) setError(err as Error);
      } finally {
        pending--;
        if (pending === 0 && isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}