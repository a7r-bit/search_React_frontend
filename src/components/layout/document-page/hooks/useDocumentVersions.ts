import { useLazyGetDocumentsVersionsQuery } from "@/api/modelApi/document-version-api";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { clearDocumentVersions } from "@/store/documentVersion/documentVersion-slice";
import { selectDocumentVersions } from "@/store/documentVersion/documentVersion-selector";
import { useEffect } from "react";

export function useDocumentVersions(selectedNode: TreeNodeEntity | undefined) {
  const dispatch = useAppDispatch();
  const [loadDocumentVersions, { isFetching }] =
    useLazyGetDocumentsVersionsQuery();
  const documentVersions = useAppSelector(selectDocumentVersions);
  const selectedNodeId = selectedNode?.id;
  const selectedNodeKind = selectedNode?.kind;

  useEffect(() => {
    if (!selectedNodeId || selectedNodeKind !== "file") {
      dispatch(clearDocumentVersions());
      return;
    }

    loadDocumentVersions(selectedNodeId);
  }, [dispatch, loadDocumentVersions, selectedNodeId, selectedNodeKind]);

  return {
    documentVersions,
    isLoadingDocumentVersions: isFetching,
  };
}
