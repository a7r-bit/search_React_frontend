import type { GlobalSearchResultItem } from "@/api/model/globalSearch/global-search-entity";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

const SEARCH_DEBOUNCE_MS = 300;

type PageSearchStaticConfig = {
  placeholder?: string;
  title?: string;
  hidden?: boolean;
  onQueryChange: (query: string) => void;
  onSelectResult?: (item: GlobalSearchResultItem) => void;
};

export type PageSearchResultsState = {
  results?: GlobalSearchResultItem[];
  total?: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
};

export type PageSearchConfig = PageSearchStaticConfig & PageSearchResultsState;

type PageSearchContextValue = {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly config: PageSearchConfig | null;
  readonly register: (config: PageSearchStaticConfig) => void;
  readonly updateSearchResults: (state: PageSearchResultsState) => void;
  readonly unregister: () => void;
};

const PageSearchContext = createContext<PageSearchContextValue | null>(null);

const emptyResultsState: PageSearchResultsState = {};

export function PageSearchProvider({ children }: PropsWithChildren) {
  const [query, setQuery] = useState("");
  const [staticConfig, setStaticConfig] = useState<PageSearchStaticConfig | null>(
    null
  );
  const [resultsState, setResultsState] =
    useState<PageSearchResultsState>(emptyResultsState);
  const onQueryChangeRef = useRef<((query: string) => void) | null>(null);
  const isRegisteredRef = useRef(false);

  const config = useMemo<PageSearchConfig | null>(() => {
    if (!staticConfig) {
      return null;
    }

    return { ...staticConfig, ...resultsState };
  }, [staticConfig, resultsState]);

  useEffect(() => {
    onQueryChangeRef.current = staticConfig?.onQueryChange ?? null;
    isRegisteredRef.current = staticConfig !== null;
  }, [staticConfig]);

  const register = useCallback((nextConfig: PageSearchStaticConfig) => {
    setStaticConfig(nextConfig);
  }, []);

  const updateSearchResults = useCallback((nextState: PageSearchResultsState) => {
    setResultsState(nextState);
  }, []);

  const unregister = useCallback(() => {
    const onQueryChange = onQueryChangeRef.current;
    setStaticConfig(null);
    setResultsState(emptyResultsState);
    setQuery("");
    onQueryChange?.("");
  }, []);

  useEffect(() => {
    if (!isRegisteredRef.current) {
      return;
    }

    if (!query.trim()) {
      onQueryChangeRef.current?.("");
      return;
    }

    const timer = window.setTimeout(() => {
      onQueryChangeRef.current?.(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  const value = useMemo<PageSearchContextValue>(
    () => ({
      query,
      setQuery,
      config,
      register,
      updateSearchResults,
      unregister,
    }),
    [query, config, register, updateSearchResults, unregister]
  );

  return (
    <PageSearchContext.Provider value={value}>
      {children}
    </PageSearchContext.Provider>
  );
}

export function usePageSearchContext() {
  const context = useContext(PageSearchContext);

  if (!context) {
    throw new Error(
      "usePageSearchContext must be used inside PageSearchProvider"
    );
  }

  return context;
}

export function usePageSearch({
  placeholder,
  title,
  hidden,
  onQueryChange,
  onSelectResult,
  results,
  total,
  isLoading,
  isError,
  error,
}: PageSearchConfig) {
  const { register, updateSearchResults, unregister } = usePageSearchContext();
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  const onSelectResultRef = useRef(onSelectResult);
  onSelectResultRef.current = onSelectResult;

  useEffect(() => unregister, [unregister]);

  useEffect(() => {
    register({
      placeholder,
      title,
      hidden,
      onQueryChange: (nextQuery) => {
        onQueryChangeRef.current(nextQuery);
      },
      onSelectResult: (item) => {
        onSelectResultRef.current?.(item);
      },
    });
  }, [placeholder, title, hidden, register]);

  useEffect(() => {
    updateSearchResults({
      results,
      total,
      isLoading,
      isError,
      error,
    });
  }, [results, total, isLoading, isError, error, updateSearchResults]);
}
