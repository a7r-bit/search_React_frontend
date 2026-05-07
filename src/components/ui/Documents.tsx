import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type PageSize = {
  width: number;
};

export type DocumentsProps = {
  fileUrl?: string | null;
  className?: string;
  onAcknowledge?: () => void;
  acknowledgeLabel?: string;
  /** Rendered after the acknowledge control in the PDF toolbar (e.g. history). */
  toolbarTrailing?: ReactNode;
};

export function Documents({
  fileUrl,
  className = "",
  onAcknowledge,
  acknowledgeLabel = "Ознакомиться",
  toolbarTrailing,
}: DocumentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<PageSize>({
    width: 0,
  });
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const updateContainerSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    setContainerSize({
      width: el.getBoundingClientRect().width,
    });
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(updateContainerSize);
    ro.observe(el);
    updateContainerSize();

    return () => ro.disconnect();
  }, [updateContainerSize]);

  useEffect(() => {
    setPageNumber(1);
    setNumPages(0);

    const frameId = requestAnimationFrame(updateContainerSize);
    return () => cancelAnimationFrame(frameId);
  }, [fileUrl, updateContainerSize]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: nextNumPages }: { numPages: number }) => {
      setNumPages(nextNumPages);
    },
    []
  );

  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () => setPageNumber((p) => Math.min(numPages || 1, p + 1));

  const canAcknowledge = numPages > 0 && pageNumber >= numPages;
  const availableWidth = Math.max(0, containerSize.width - 32);
  const pageWidth = Math.floor(availableWidth);
  const isContainerMeasured = pageWidth > 0;

  if (!fileUrl) {
    return (
      <div
        className={`flex h-full min-h-[200px] items-center justify-center rounded-lg border border-dashed border-(--color-surface-muted) bg-(--color-surface) p-6 text-sm text-(--color-text-muted) ${className}`}
      >
        Документ не выбран
      </div>
    );
  }

  return (
    <div className={`flex h-full min-h-0 w-full flex-col ${className}`}>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-(--color-surface-muted) bg-(--color-surface) px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageNumber <= 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-(--color-text) hover:bg-(--color-surface-muted) disabled:opacity-40"
            aria-label="Предыдущая страница"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-20 text-center text-sm tabular-nums text-(--color-text)">
            {numPages > 0 ? `${pageNumber} / ${numPages}` : "—"}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={pageNumber >= numPages || numPages === 0}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-(--color-text) hover:bg-(--color-surface-muted) disabled:opacity-40"
            aria-label="Следующая страница"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        {onAcknowledge ? (
          <button
            type="button"
            disabled={!canAcknowledge}
            onClick={onAcknowledge}
            className="ml-auto rounded-md bg-(--color-text) px-3 py-1.5 text-sm text-(--color-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            {acknowledgeLabel}
          </button>
        ) : null}
        {toolbarTrailing}
      </div>

      <div
        ref={containerRef}
        className="min-h-0 w-full flex-1 overflow-auto bg-(--color-surface-muted) p-4"
      >
        {!isContainerMeasured ? (
          <div className="flex justify-center p-8 text-sm text-(--color-text-muted)">
            Загрузка…
          </div>
        ) : (
          <Document
            key={fileUrl}
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            error={
              <p className="text-center text-sm text-red-600 dark:text-red-400">
                Не удалось загрузить PDF
              </p>
            }
            loading={
              <div className="flex justify-center p-8 text-sm text-(--color-text-muted)">
                Загрузка…
              </div>
            }
            className="flex w-full justify-center"
          >
            <Page
              key={`${fileUrl}-${pageNumber}-${pageWidth}`}
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer
              renderAnnotationLayer
            />
          </Document>
        )}
      </div>
    </div>
  );
}
