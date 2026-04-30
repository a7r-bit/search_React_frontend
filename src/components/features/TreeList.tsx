import type { MouseEvent, ReactElement } from "react";

import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { TreeItem } from "../ui/TreeItem";

export type TreeListProps = {
  readonly entities: Record<string, TreeNodeEntity>;
  readonly rootIds: string[];
  readonly childrenByParentId: Record<string, string[]>;
  readonly expandedIds: string[];
  readonly selectedId: string | null;
  readonly onToggle: (nodeId: string) => void;
  readonly onSelect: (node: TreeNodeEntity) => void;
  readonly onContextMenu?: (node: TreeNodeEntity, event: MouseEvent) => void;
  readonly className?: string;
};

export function TreeList({
  entities,
  rootIds,
  childrenByParentId,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
  onContextMenu,
  className,
}: TreeListProps) {
  const expanded = new Set(expandedIds);

  const renderNode = (nodeId: string, level: number): ReactElement | null => {
    const node = entities[nodeId];
    if (!node) {
      return null;
    }

    const children = childrenByParentId[node.id] ?? [];
    const hasChildren = node.hasChildren || children.length > 0;
    const isExpanded = expanded.has(node.id);

    return (
      <div key={node.id}>
        <TreeItem
          node={node}
          level={level}
          selected={selectedId === node.id}
          expanded={isExpanded}
          hasChildren={hasChildren}
          onToggle={onToggle}
          onSelect={onSelect}
          onContextMenu={onContextMenu}
        />

        {hasChildren && isExpanded
          ? children.map((childId) => renderNode(childId, level + 1))
          : null}
      </div>
    );
  };

  return (
    <div className={className}>
      {rootIds.map((rootId) => renderNode(rootId, 0))}
    </div>
  );
}
