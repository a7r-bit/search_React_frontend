import { X } from "lucide-react";

import type { useDocumentVersions } from "./hooks/useDocumentVersions";
import { DocumentVersionCard } from "./DocumentVersionCard";
import type { DocumentVersionEntity } from "@/api/model/documentVersion/document-version-entity";

type DocumentHistoryPanelProps = ReturnType<typeof useDocumentVersions> & {
  selectedDocumentVersion: DocumentVersionEntity | null;
  onSelectVersion: (versionId: string) => void;
  open: boolean;
  onClose: () => void;
};

export function DocumentHistoryPanel({
  documentVersions,
  isLoadingDocumentVersions,
  selectedDocumentVersion,
  onSelectVersion,
  open,
  onClose,
}: DocumentHistoryPanelProps) {
  return (
    <>
      <button
        type="button"
        aria-hidden={!open}
        className={
          open
            ? "fixed inset-0 z-40 bg-black/40 transition-opacity"
            : "pointer-events-none fixed inset-0 z-40 bg-black/0 opacity-0"
        }
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-(--color-border) bg-(--color-surface) shadow-lg transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-(--color-border) p-3">
          <h2 className="text-sm font-medium text-(--color-text)">
            Document history
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-(--color-text-muted) hover:bg-(--color-border) hover:text-(--color-text)"
            aria-label="Close history"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {isLoadingDocumentVersions ? (
            <p className="text-sm text-(--color-text-muted)">Loading...</p>
          ) : documentVersions.length === 0 ? (
            <p className="text-sm text-(--color-text-muted)">
              No versions for this document.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {documentVersions.map((version) => (
                <DocumentVersionCard
                  key={version.id}
                  version={version}
                  isSelected={selectedDocumentVersion?.id === version.id}
                  onOpenVersion={(v) => onSelectVersion(v.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
