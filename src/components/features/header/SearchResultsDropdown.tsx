import type { GlobalSearchResultItem } from "@/api/model/globalSearch/global-search-entity";
import { FileText, Folder } from "lucide-react";
import { SearchHighlight } from "./SearchHighlight";

type SearchResultsDropdownProps = {
  items: GlobalSearchResultItem[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  onSelect: (item: GlobalSearchResultItem) => void;
};

function getResultKey(item: GlobalSearchResultItem): string {
  return item.kind === "file" ? `file-${item.id}` : `directory-${item.id}`;
}

function SearchResultRow({
  item,
  onSelect,
}: {
  item: GlobalSearchResultItem;
  onSelect: (item: GlobalSearchResultItem) => void;
}) {
  const isFile = item.kind === "file";
  const title = isFile ? item.fileName : item.name;
  const breadcrumb = item.path.map((segment) => segment.name).join(" / ");

  return (
    <li role="option">
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(item)}
        className="flex w-full gap-2 px-3 py-2 text-left hover:bg-(--color-surface-muted) focus-visible:bg-(--color-surface-muted) focus-visible:outline-none"
      >
        {isFile ? (
          <FileText
            size={16}
            className="mt-0.5 shrink-0 text-(--color-text-muted)"
            aria-hidden="true"
          />
        ) : (
          <Folder
            size={16}
            className="mt-0.5 shrink-0 text-(--color-text-muted)"
            aria-hidden="true"
          />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-(--color-text) [&_mark]:rounded-sm [&_mark]:bg-yellow-200/80 [&_mark]:px-0.5 dark:[&_mark]:bg-yellow-500/30">
            <SearchHighlight html={item.highlight.title ?? title} />
          </span>
          <span className="mt-0.5 block truncate text-xs text-(--color-text-muted)">
            {breadcrumb}
          </span>
          {isFile && item.highlight.snippet ? (
            <span className="mt-1 line-clamp-2 text-xs text-(--color-text-muted) [&_mark]:rounded-sm [&_mark]:bg-yellow-200/80 [&_mark]:px-0.5 dark:[&_mark]:bg-yellow-500/30">
              <SearchHighlight html={item.highlight.snippet} />
            </span>
          ) : null}
        </span>
      </button>
    </li>
  );
}

export function SearchResultsDropdown({
  items,
  total,
  isLoading,
  isError,
  error,
  onSelect,
}: SearchResultsDropdownProps) {
  return (
    <ul
      role="listbox"
      aria-label="Search results"
      className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-80 overflow-auto rounded-md border border-(--color-border) bg-(--color-surface) py-1 shadow-lg"
    >
      {isLoading && items.length === 0 ? (
        <li className="px-3 py-2 text-sm text-(--color-text-muted)">
          Searching...
        </li>
      ) : null}

      {isError ? (
        <li className="px-3 py-2 text-sm text-red-500">
          {error ?? "Search failed"}
        </li>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <li className="px-3 py-2 text-sm text-(--color-text-muted)">
          No results found
        </li>
      ) : null}

      {!isError
        ? items.map((item) => (
            <SearchResultRow
              key={getResultKey(item)}
              item={item}
              onSelect={onSelect}
            />
          ))
        : null}

      {!isLoading && !isError && total > items.length ? (
        <li className="border-t border-(--color-border) px-3 py-2 text-xs text-(--color-text-muted)">
          Showing {items.length} of {total}
        </li>
      ) : null}
    </ul>
  );
}
