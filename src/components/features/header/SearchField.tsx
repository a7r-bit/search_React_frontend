import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  inputRef,
}: SearchFieldProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const resolvedRef = inputRef ?? internalRef;

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

  const focusInput = () => {
    resolvedRef.current?.focus();
  };

  return (
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
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-text-muted) disabled:cursor-not-allowed disabled:opacity-60"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={focusInput}
        className="h-7 shrink-0 rounded-md border-(--color-border) bg-(--color-surface-muted) px-2 text-xs text-(--color-text-muted) hover:bg-(--color-surface-muted)"
      >
        Ctrl+K
      </Button>
    </div>
  );
}
