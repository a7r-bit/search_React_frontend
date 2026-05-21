import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useLazyGlobalSearchQuery } from "@/api/modelApi/search-api";
import { useCallback, useRef } from "react";

export function useDocumentGlobalSearch(
  selectedNode: TreeNodeEntity | undefined,
  rootIds: string[]
) {
  const [trigger, { data, isFetching, isError, error, reset }] =
    useLazyGlobalSearchQuery();
  const lastRequestRef = useRef<{ query: string; nodeId: string } | null>(null);

  const runSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery || trimmedQuery.length < 3) {
        lastRequestRef.current = null;
        return;
      }

      const currentNodeId = selectedNode?.id ?? rootIds[0];
      if (!currentNodeId) {
        return;
      }

      if (
        lastRequestRef.current?.query === trimmedQuery &&
        lastRequestRef.current.nodeId === currentNodeId
      ) {
        return;
      }

      lastRequestRef.current = { query: trimmedQuery, nodeId: currentNodeId };
      void trigger({ currentNodeId, searchQuery: trimmedQuery });
    },
    [trigger, selectedNode?.id, rootIds]
  );

  const clearSearch = useCallback(() => {
    lastRequestRef.current = null;
    reset();
  }, [reset]);

  return {
    isLoading: isFetching,
    error,
    isError,
    data,
    reset: clearSearch,
    runSearch,
  };
}
