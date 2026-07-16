import {
  useGetTreeQuery,
  useLazyGetTreeChildrenQuery,
} from "@/api/modelApi/tree-api";
import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectVisibleNodes } from "@/store/tree/tree-selectors";
import {
  expandNodes,
  setSelected,
  toogleExpanded,
} from "@/store/tree/tree-slice";
import { useMemo } from "react";

export function useDocumentTree() {
  useGetTreeQuery(undefined, { refetchOnMountOrArgChange: true });
  const [loadChildren] = useLazyGetTreeChildrenQuery();

  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.tree);
  const visibleNodes = useAppSelector(selectVisibleNodes);

  const selectedNode = useMemo(
    () => (tree.selectedId ? tree.entities[tree.selectedId] : undefined),
    [tree.entities, tree.selectedId]
  );

  const handleSelect = (node: TreeNodeEntity) => {
    dispatch(setSelected(node.id));
  };

  const handleOpenNodePath = async (
    pathIds: string[],
    targetNodeId: string
  ) => {
    for (const parentId of pathIds) {
      await loadChildren({ parentId, sort: "name:asc" }).unwrap();
    }

    dispatch(expandNodes(pathIds));
    dispatch(setSelected(targetNodeId));
  };

  const handleToggle = (nodeId: string) => {
    const node = tree.entities[nodeId];
    const isExpanded = tree.expandedIds.includes(nodeId);
    const hasLoadedChildren =
      (tree.childrenByParentId[nodeId] ?? []).length > 0;

    if (!isExpanded && node?.hasChildren && !hasLoadedChildren) {
      loadChildren({ parentId: nodeId, sort: "name:asc" });
    }

    dispatch(toogleExpanded(nodeId));
  };

  return {
    tree,
    visibleNodes,
    selectedNode,
    handleSelect,
    handleToggle,
    handleOpenNodePath,
  };
}
