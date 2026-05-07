import { History } from "lucide-react";

import { Documents } from "@/components/ui/Documents";

import { useDocumentPreview } from "./hooks/useDocumentPreview";

type DocumentPreviewPanelProps = ReturnType<typeof useDocumentPreview> & {
  onOpenHistory?: () => void;
};

export function DocumentPreviewPanel({
  preview,
  previewFileUrl,
  previewError,
  previewStatusMessage,
  isPreviewUrlLoading,
  onOpenHistory,
}: DocumentPreviewPanelProps) {
  const statusText =
    previewError ??
    (isPreviewUrlLoading ? "Получаем ссылку на файл…" : previewStatusMessage);

  const historyButton = onOpenHistory ? (
    <button
      type="button"
      onClick={onOpenHistory}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-surface) px-2.5 py-1.5 text-sm font-medium text-(--color-text) hover:bg-(--color-surface-muted)"
      aria-label="Open document history"
    >
      <History className="h-4 w-4" aria-hidden />
      History
    </button>
  ) : null;

  return (
    <section className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col ">
      {onOpenHistory && !previewFileUrl ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-b border-(--color-surface-muted) bg-(--color-surface) px-3 py-2">
          {historyButton}
        </div>
      ) : null}
      {previewFileUrl ? (
        <Documents
          fileUrl={previewFileUrl}
          onAcknowledge={() => {
            if (preview.status === "ready") {
              console.log("Ознакомлен", preview.document.latestVersionId);
            }
          }}
          acknowledgeLabel="Ознакомиться"
          toolbarTrailing={historyButton}
        />
      ) : (
        <Documents
          fileUrl={null}
          className="h-full min-h-0 w-full flex-1"
          acknowledgeLabel="Ознакомиться"
        />
      )}
      {statusText ? (
        <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-center text-sm text-(--color-text-muted) shadow-sm">
          {statusText}
        </p>
      ) : null}
    </section>
  );
}
