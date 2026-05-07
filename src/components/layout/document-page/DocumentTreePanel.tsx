import { TreeList } from "@/components/features/TreeList";
import { ContextMenu } from "@/components/ui/ContextMenu";

import DOCUMENT_PAGE_MENU_ITEMS from "./menu-config";
import { useDocumentTree } from "./hooks/useDocumentTree";
import { useNodeContextMenu } from "./use-node-context-menu";

type DocumentTreePanelProps = ReturnType<typeof useDocumentTree>;

export function DocumentTreePanel({
  tree,
  visibleNodes,
  handleSelect,
  handleToggle,
}: DocumentTreePanelProps) {
  const { menu, handleContextMenu, closeMenu, handleMenuAction } =
    useNodeContextMenu();

  return (
    <section className="h-full w-1/4 shrink-0 overflow-auto bg-(--color-surface) rounded-md p-3">
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
        onContextMenu={handleContextMenu}
      />
      {menu ? (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={DOCUMENT_PAGE_MENU_ITEMS}
          nodePermissions={menu.node?.permissions ?? []}
          onAction={handleMenuAction}
          onClose={closeMenu}
        />
      ) : null}
      {visibleNodes.length === 0 ? (
        <p className="mt-3 text-xs text-(--color-text-muted)">Tree is empty.</p>
      ) : null}
    </section>
  );
}
