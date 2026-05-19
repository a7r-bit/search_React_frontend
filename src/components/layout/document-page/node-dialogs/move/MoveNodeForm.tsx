import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useLazyGetTreeChildrenQuery } from "@/api/modelApi/tree-api";
import { TreeList } from "@/components/features/TreeList";
import { Button } from "@/components/ui/Button";
import { useAppSelector } from "@/hooks/redux";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { MoveNodeParams } from "../use-node-context-menu";

function collectDescendantIds(
  rootId: string,
  childrenByParentId: Record<string, string[]>
): Set<string> {
  const out = new Set<string>();
  const stack = [...(childrenByParentId[rootId] ?? [])];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (out.has(id)) continue;
    out.add(id);
    for (const childId of childrenByParentId[id] ?? []) {
      stack.push(childId);
    }
  }
  return out;
}

type MoveNodeFormProps = {
  readonly movedNode: TreeNodeEntity;
  readonly onClose: () => void;
  readonly onSubmit: (params: MoveNodeParams) => void | Promise<void>;
  readonly isSubmitting: boolean;
  readonly error: string | null;
};

export function MoveNodeForm({
  movedNode,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: MoveNodeFormProps) {
  const tree = useAppSelector((state) => state.tree);
  // Переписать, т.к. меняется глобальный стейт дерева
  // Отфильтровать входной массив по kind:directory
  const [loadChildren] = useLazyGetTreeChildrenQuery();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const forbiddenParentIds = useMemo(
    () => collectDescendantIds(movedNode.id, tree.childrenByParentId),
    [movedNode.id, tree.childrenByParentId]
  );

  useEffect(() => {
    setExpandedIds([]);
    setSelectedDestinationId(null);
    setPickerError(null);
  }, [movedNode.id]);

  const handleToggle = useCallback(
    (nodeId: string) => {
      setExpandedIds((prev) => {
        const isExpanded = prev.includes(nodeId);
        const node = tree.entities[nodeId];
        const hasLoadedChildren =
          (tree.childrenByParentId[nodeId] ?? []).length > 0;

        if (!isExpanded && node?.hasChildren && !hasLoadedChildren) {
          void loadChildren({
            parentId: nodeId,
            sort: "name:asc",
            type: "DIRECTORY",
          });
        }

        return isExpanded
          ? prev.filter((id) => id !== nodeId)
          : [...prev, nodeId];
      });
    },
    [loadChildren, tree.childrenByParentId, tree.entities]
  );

  const handleSelect = useCallback(
    (node: TreeNodeEntity) => {
      setPickerError(null);
      if (node.kind !== "directory") {
        setPickerError("Select a folder as the destination");
        return;
      }
      if (node.id === movedNode.id) {
        setPickerError("Cannot move an item into itself");
        return;
      }
      if (forbiddenParentIds.has(node.id)) {
        setPickerError("Cannot move into a subfolder of this item");
        return;
      }
      setSelectedDestinationId(node.id);
    },
    [forbiddenParentIds, movedNode.id]
  );

  const handleSubmit = () => {
    setPickerError(null);
    if (!selectedDestinationId) {
      setPickerError("Choose a destination folder");
      return;
    }
    const newParent = tree.entities[selectedDestinationId];
    if (!newParent || newParent.kind !== "directory") {
      setPickerError("Invalid destination");
      return;
    }
    if (newParent.id === movedNode.parentId) {
      setPickerError("The item is already in this folder");
      return;
    }
    void onSubmit({ movedNode, newParentNode: newParent });
  };

  const displayError = pickerError ?? error;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-(--color-text-muted)">
        Moving:{" "}
        <span className="font-medium text-(--color-text)">
          {movedNode.name}
        </span>
      </p>
      <div className="max-h-64 overflow-auto rounded-lg border border-(--color-border) p-2">
        <TreeList
          showActionMenu={false}
          entities={tree.entities}
          rootIds={tree.rootIds}
          childrenByParentId={tree.childrenByParentId}
          expandedIds={expandedIds}
          selectedId={selectedDestinationId}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
      </div>
      {displayError ? (
        <p className="text-sm text-red-400" role="alert">
          {displayError}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={isSubmitting || !selectedDestinationId}
          onClick={handleSubmit}
        >
          Move
        </Button>
      </div>
    </div>
  );
}
