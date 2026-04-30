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
import { useLazyGetFileQuery } from "@/api/modelApi/s3-api";

export type TreeItemProps = {
  readonly node: TreeNodeEntity;
  readonly level: number;
  readonly selected?: boolean;
  readonly expanded?: boolean;
  readonly hasChildren?: boolean;
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
  onToggle,
  onSelect,
  onContextMenu,
}: TreeItemProps) {
  const [getFile] = useLazyGetFileQuery();
  const isLocked = !node.permissions.includes("READ");

  const handleClick = async () => {
    if (isLocked) return;

    onSelect(node);

    if (node.kind !== "file" || !node.document?.fileUrl) return;

    const fileRef = node.document.fileUrl.trim();
    if (!fileRef) return;

    // Some backends return a direct URL in tree payload.
    if (fileRef.startsWith("http://") || fileRef.startsWith("https://")) {
      window.open(fileRef, "_blank", "noopener,noreferrer");
      return;
    }

    // Open a blank tab synchronously to avoid popup blockers.
    const popup = window.open("about:blank", "_blank");

    try {
      const file = await getFile({ key: fileRef }).unwrap();
      if (file.url) {
        if (popup) {
          popup.location.href = file.url;
        } else {
          window.open(file.url, "_blank", "noopener,noreferrer");
        }
      } else if (popup) {
        popup.close();
      }
    } catch (e) {
      if (popup) {
        popup.close();
      }
      console.error("Failed to open file", e);
    }
  };

  return (
    <div
      className={`group flex items-center gap-2 rounded px-2 py-1.5 transition-colors ${
        selected
          ? "bg-(--color-accent-soft) text-(--color-text)"
          : "text-(--color-text) hover:bg-(--color-surface-muted)"
      } ${isLocked ? "opacity-70" : ""}`}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
      onClick={() => {
        void handleClick();
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
        {node.permissions.length > 0 ? (
          <MoreVertical size={14} aria-hidden="true" />
        ) : null}
      </button>
    </div>
  );
}
