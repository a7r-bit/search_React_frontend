import {
  useGetTreeQuery,
  useLazyGetTreeChildrenQuery,
} from "@/api/modelApi/tree-api";
import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectVisibleNodes } from "@/store/tree/tree-selectors";
import { setSelected, toogleExpanded } from "@/store/tree/tree-slice";
import { TreeList } from "../ui/TreeList";

export function DocumentPage() {
  useGetTreeQuery(undefined, { refetchOnMountOrArgChange: true });
  const [loadChildren] = useLazyGetTreeChildrenQuery();

  const dispatch = useAppDispatch();
  const tree = useAppSelector((state) => state.tree);
  const visibleNodes = useAppSelector(selectVisibleNodes);

  const handleSelect = (node: TreeNodeEntity) => {
    dispatch(setSelected(node.id));
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

  return (
    <section className="mt-4 rounded-xl bg-(--color-surface) p-3">
      <h2 className="mb-2 text-sm font-medium text-(--color-text)">
        Document tree
      </h2>
      <TreeList
        entities={tree.entities}
        rootIds={tree.rootIds}
        childrenByParentId={tree.childrenByParentId}
        expandedIds={tree.expandedIds}
        selectedId={tree.selectedId}
        onToggle={handleToggle}
        onSelect={handleSelect}
        className="space-y-0.5"
      />
      {visibleNodes.length === 0 ? (
        <p className="mt-3 text-xs text-(--color-text-muted)">Tree is empty.</p>
      ) : null}
    </section>
  );
}
