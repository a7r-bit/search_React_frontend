import { useCallback, useEffect, useState } from "react";
import type { GlobalSearchResultItem } from "@/api/model/globalSearch/global-search-entity";
import { useAppDispatch } from "@/hooks/redux";
import { usePageSearch } from "@/hooks/use-page-search";
import { DocumentHistoryPanel } from "./DocumentHistoryPanel";
import { DocumentPreviewPanel } from "./DocumentPreviewPanel";
import { DocumentTreePanel } from "./DocumentTreePanel";
import { useDocumentGlobalSearch } from "./hooks/useDocumentGlobalSearch";
import { useDocumentPreview } from "./hooks/useDocumentPreview";
import { useDocumentTree } from "./hooks/useDocumentTree";

import { useDocumentVersions } from "./hooks/useDocumentVersions";

export function DocumentPage() {
  const dispatch = useAppDispatch();
  const documentTree = useDocumentTree();
  const globalSearch = useDocumentGlobalSearch(
    documentTree.selectedNode,
    documentTree.tree.rootIds
  );
  const documentVersions = useDocumentVersions(documentTree.selectedNode);
  const [openedVersionId, setOpenedVersionId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleSelectSearchResult = useCallback(
    async (item: GlobalSearchResultItem) => {
      //  TODO реализация взамодействия с redux tree slice
      const targetNodeId = item.id;
      const pathIds = item.path.map((segment) => segment.id);

      await documentTree.handleOpenNodePath(pathIds, targetNodeId);

      globalSearch.reset();
    },
    [dispatch, globalSearch.reset]
  );

  usePageSearch({
    title: "All files",
    placeholder: "Search files and folders...",
    results: globalSearch.data?.items,
    total: globalSearch.data?.total,
    error: globalSearch.error?.message ?? undefined,
    isLoading: globalSearch.isLoading,
    isError: Boolean(globalSearch.error),
    onQueryChange: globalSearch.runSearch,
    onSelectResult: handleSelectSearchResult,
  });

  const defaultVersionId =
    documentTree.selectedNode?.document?.latestVersionId ?? null;

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
