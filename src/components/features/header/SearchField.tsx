import type { GlobalSearchResultItem } from "@/api/model/globalSearch/global-search-entity";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { SearchResultsDropdown } from "./SearchResultsDropdown";

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  results?: GlobalSearchResultItem[];
  total?: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  onSelectResult?: (item: GlobalSearchResultItem) => void;
};

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  inputRef,
  results = [],
  total = 0,
  isLoading = false,
  isError = false,
  error,
  onSelectResult,
}: SearchFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLInputElement>(null);
  const resolvedRef = inputRef ?? internalRef;

  const isOpen = Boolean(value.trim()) && !disabled;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        resolvedRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [disabled, resolvedRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onChange("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen, onChange]);

  const focusInput = () => {
    resolvedRef.current?.focus();
  };

  const handleSelectResult = (item: GlobalSearchResultItem) => {
    onSelectResult?.(item);
    onChange("");
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      onChange("");
      resolvedRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-[20rem]">
      <div className="flex min-w-[20rem] items-center gap-3 rounded-md border border-(--color-border) bg-(--color-surface) px-2 py-1">
        <Search
          size={16}
          className="shrink-0 text-(--color-text-muted)"
          aria-hidden="true"
        />
        <input
          ref={resolvedRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={placeholder}
          aria-expanded={isOpen}
          aria-controls={isOpen ? "search-results-listbox" : undefined}
          aria-autocomplete="list"
          role="combobox"
          className="min-w-0 flex-1 p-0.5 bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-text-muted) disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {isOpen ? (
        <div id="search-results-listbox">
          <SearchResultsDropdown
            items={results}
            total={total}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onSelect={handleSelectResult}
          />
        </div>
      ) : null}
    </div>
  );
}
