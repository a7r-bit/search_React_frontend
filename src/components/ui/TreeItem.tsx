import type { MouseEvent } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  Lock,
  MoreVertical,
} from "lucide-react";

import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";

export type TreeItemProps = {
  readonly node: TreeNodeEntity;
  readonly level: number;
  readonly selected?: boolean;
  readonly expanded?: boolean;
  readonly hasChildren?: boolean;
  readonly showActionMenu?: boolean;
  readonly onToggle?: (nodeId: string) => void;
  readonly onSelect: (node: TreeNodeEntity) => void;
  readonly onContextMenu?: (node: TreeNodeEntity, event: MouseEvent) => void;
};

export function TreeItem({
  node,
  level,
  selected = false,
  expanded = false,
  hasChildren = false,
  showActionMenu = true,
  onToggle,
  onSelect,
  onContextMenu,
}: TreeItemProps) {
  const isLocked = !node.permissions.includes("READ");

  const handleClick = () => {
    if (isLocked) return;

    onSelect(node);
  };

  return (
    <div
      className={`group flex items-center gap-2 rounded px-2 py-1.5 transition-colors ${
        selected
          ? "bg-(--color-accent-soft) text-(--color-text)"
          : "text-(--color-text) hover:bg-(--color-surface-muted)"
      } ${isLocked ? "opacity-70" : ""}`}
      title={node.name}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
      onClick={() => {
        handleClick();
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu?.(node, event);
      }}
    >
      {hasChildren && !isLocked ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggle?.(node.id);
          }}
          className="rounded p-0.5 hover:bg-(--color-surface)"
          aria-label={expanded ? "Collapse node" : "Expand node"}
        >
          {expanded ? (
            <ChevronDown size={16} aria-hidden="true" />
          ) : (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </button>
      ) : (
        <span className="w-5" aria-hidden="true" />
      )}

      {node.kind === "directory" ? (
        <Folder size={16} className="text-blue-400" aria-hidden="true" />
      ) : (
        <FileText
          size={16}
          className="text-(--color-text-muted)"
          aria-hidden="true"
        />
      )}

      <span className="flex-1 truncate text-sm">{node.name}</span>

      {isLocked ? (
        <Lock size={14} className="text-orange-400" aria-hidden="true" />
      ) : null}

      <button
        type="button"
        className="rounded p-0.5 opacity-0 hover:bg-(--color-surface) group-hover:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          onContextMenu?.(node, event);
        }}
        aria-label="Node actions"
      >
        {showActionMenu && node.permissions.length > 0 ? (
          <MoreVertical size={14} aria-hidden="true" />
        ) : null}
      </button>
    </div>
  );
}
