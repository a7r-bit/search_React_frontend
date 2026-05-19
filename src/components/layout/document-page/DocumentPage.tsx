import { useCallback, useEffect, useState } from "react";
import { usePageSearch } from "@/hooks/use-page-search";
import { DocumentHistoryPanel } from "./DocumentHistoryPanel";
import { DocumentPreviewPanel } from "./DocumentPreviewPanel";
import { DocumentTreePanel } from "./DocumentTreePanel";
import { useDocumentPreview } from "./hooks/useDocumentPreview";
import { useDocumentTree } from "./hooks/useDocumentTree";

import { useDocumentVersions } from "./hooks/useDocumentVersions";

export function DocumentPage() {
  const handleSearchQueryChange = useCallback((_query: string) => {
    // TODO: filter document tree via Redux when search is wired to tree slice
  }, []);

  usePageSearch({
    title: "All files",
    placeholder: "Search files and folders...",
    onQueryChange: handleSearchQueryChange,
  });

  const documentTree = useDocumentTree();
  const documentVersions = useDocumentVersions(documentTree.selectedNode);

  const defaultVersionId =
    documentTree.selectedNode?.document?.latestVersionId ?? null;
  const [openedVersionId, setOpenedVersionId] = useState<string | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setOpenedVersionId(null);
    setHistoryOpen(false);
  }, [documentTree.selectedNode?.id]);

  const activeVersionId = openedVersionId ?? defaultVersionId;
  const selectedDocumentVersion =
    documentVersions.documentVersions.find(
      (version) => version.id === activeVersionId
    ) ?? null;
  const documentPreview = useDocumentPreview(
    documentTree.selectedNode,
    selectedDocumentVersion?.fileUrl ?? null
  );

  const canOpenHistory = documentTree.selectedNode?.kind === "file";

  return (
    <div className="relative flex h-full min-h-0 flex-row gap-2">
      <DocumentTreePanel {...documentTree} />
      <DocumentPreviewPanel
        {...documentPreview}
        onOpenHistory={canOpenHistory ? () => setHistoryOpen(true) : undefined}
      />
      <DocumentHistoryPanel
        {...documentVersions}
        selectedDocumentVersion={selectedDocumentVersion}
        isLoadingDocumentVersions={documentVersions.isLoadingDocumentVersions}
        onSelectVersion={setOpenedVersionId}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
