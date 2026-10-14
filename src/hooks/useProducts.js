import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "../services/productService";

const PAGE_SIZE = 12;

export function useProducts(query) {
  const [state, setState] = useState({
    products: [],
    total: 0,
    loading: true,
    refreshing: false,
    loadingMore: false,
    error: null,
  });
  const requestId = useRef(0);
  const inFlight = useRef(false);

  const load = useCallback(
    async ({ reset = false, refresh = false } = {}) => {
      if (!reset && inFlight.current) return;
      const id = ++requestId.current;
      inFlight.current = true;
      const skip = reset ? 0 : state.products.length;
      setState((current) => ({
        ...current,
        error: null,
        loading: reset && !refresh,
        refreshing: refresh,
        loadingMore: !reset && !refresh,
      }));
      try {
        const result = await getProducts({ query, skip, limit: PAGE_SIZE });
        if (id !== requestId.current) return;
        setState((current) => ({
          ...current,
          products: reset
            ? result.products
            : [
                ...current.products,
                ...result.products.filter(
                  (item) =>
                    !current.products.some((existing) => existing.id === item.id),
                ),
              ],
          total: result.total,
          loading: false,
          refreshing: false,
          loadingMore: false,
        }));
      } catch (error) {
        if (id !== requestId.current) return;
        setState((current) => ({
          ...current,
          loading: false,
          refreshing: false,
          loadingMore: false,
          error: error.message || "Unable to load products.",
        }));
      } finally {
        if (id === requestId.current) inFlight.current = false;
      }
    },
    [query, state.products.length],
  );

  useEffect(() => {
    load({ reset: true });
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (
      inFlight.current ||
      state.loading ||
      state.refreshing ||
      state.loadingMore ||
      state.products.length >= state.total
    )
      return;
    load();
  }, [load, state]);

  return {
    ...state,
    retry: () => load({ reset: true }),
    refresh: () => load({ reset: true, refresh: true }),
    loadMore,
  };
}
