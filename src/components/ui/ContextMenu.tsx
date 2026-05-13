import type { TreeNodeEntity, TreeNodeKind } from "@/api/model";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ContextMenuAction =
  | "create-directory"
  | "upload-file"
  | "move"
  | "rename"
  | "manage-access"
  | "copy-for-testing"
  | "delete";

export type ContextMenuItem = {
  id: ContextMenuAction;
  label: string;
  kind?: TreeNodeKind;
  permission: string;
  icon?: ReactNode;
  danger?: boolean;
};

interface ContextMenuProps {
  x: number;
  y: number;
  node: TreeNodeEntity;
  nodePermissions: string[];
  items: ContextMenuItem[];
  onAction: (action: ContextMenuAction) => void;
  onClose: () => void;
}

function menuRow(
  id: ContextMenuAction,
  label: string,
  icon: ReactNode | undefined,
  danger: boolean | undefined,
  onAction: (action: ContextMenuAction) => void,
  onClose: () => void
) {
  return (
    <button
      type="button"
      className={`block w-full rounded px-2 py-1 text-left text-sm hover:bg-(--color-surface-muted) disabled:cursor-not-allowed disabled:opacity-50 ${danger ? "text-red-400" : ""}`}
      onClick={() => {
        onAction(id);
        onClose();
      }}
    >
      <span className="flex items-center gap-2">
        {icon ? (
          <span
            className={`${danger ? "text-red-400" : "text-(--color-text-muted)"}`}
          >
            {icon}
          </span>
        ) : null}
        <span className="text-xs">{label}</span>
      </span>
    </button>
  );
}

export function ContextMenu({
  x,
  y,
  nodePermissions,
  items,
  node,
  onAction,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: y, left: x });
  const visibleItems = items.filter((item) => {
    const hasPermission = nodePermissions.includes(item.permission);
    const kindAllowes = item.kind ? item.kind === node.kind : true;
    return hasPermission && kindAllowes;
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useLayoutEffect(() => {
    if (visibleItems.length === 0) return;

    const menu = menuRef.current;
    if (!menu) return;

    const margin = 8;
    const { innerWidth, innerHeight } = window;
    const rect = menu.getBoundingClientRect();

    const nextLeft = Math.min(
      Math.max(margin, x),
      innerWidth - rect.width - margin
    );
    const nextTop = Math.min(
      Math.max(margin, y),
      innerHeight - rect.height - margin
    );

    setPosition({ top: nextTop, left: nextLeft });
  }, [x, y, visibleItems.length]);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        ref={menuRef}
        className="fixed z-20 min-w-40 rounded-md bg-(--color-surface) p-1 shadow-md"
        style={{ top: position.top, left: position.left }}
      >
        {visibleItems.map((item) =>
          menuRow(
            item.id,
            item.label,
            item.icon,
            item.danger,
            onAction,
            onClose
          )
        )}
      </div>
    </>
  );
}
