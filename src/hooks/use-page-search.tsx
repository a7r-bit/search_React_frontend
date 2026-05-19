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

export type PageSearchConfig = {
  placeholder?: string;
  title?: string;
  hidden?: boolean;
  onQueryChange: (query: string) => void;
};

type PageSearchContextValue = {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly config: PageSearchConfig | null;
  readonly register: (config: PageSearchConfig) => void;
  readonly unregister: () => void;
};

const PageSearchContext = createContext<PageSearchContextValue | null>(null);

export function PageSearchProvider({ children }: PropsWithChildren) {
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState<PageSearchConfig | null>(null);
  const onQueryChangeRef = useRef<((query: string) => void) | null>(null);

  useEffect(() => {
    onQueryChangeRef.current = config?.onQueryChange ?? null;
  }, [config]);

  const register = useCallback((nextConfig: PageSearchConfig) => {
    setConfig(nextConfig);
  }, []);

  const unregister = useCallback(() => {
    const onQueryChange = onQueryChangeRef.current;
    setConfig(null);
    setQuery("");
    onQueryChange?.("");
  }, []);

  useEffect(() => {
    if (!config) {
      return;
    }

    const timer = window.setTimeout(() => {
      onQueryChangeRef.current?.(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, config]);

  const value = useMemo<PageSearchContextValue>(
    () => ({
      query,
      setQuery,
      config,
      register,
      unregister,
    }),
    [query, config, register, unregister]
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
    throw new Error("usePageSearchContext must be used inside PageSearchProvider");
  }

  return context;
}

export function usePageSearch({
  placeholder,
  title,
  hidden,
  onQueryChange,
}: PageSearchConfig) {
  const { register, unregister } = usePageSearchContext();
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;

  useEffect(() => {
    register({
      placeholder,
      title,
      hidden,
      onQueryChange: (query) => {
        onQueryChangeRef.current(query);
      },
    });

    return unregister;
  }, [placeholder, title, hidden, register, unregister]);
}
