import { TreeList } from "@/components/features/TreeList";
import { ContextMenu } from "@/components/ui/ContextMenu";

import DOCUMENT_PAGE_MENU_ITEMS from "./menu-config";
import { DocumentTreeNodeDialogs } from "./node-dialogs/DocumentTreeNodeDialogs";
import { useDocumentTree } from "./hooks/useDocumentTree";
import { useNodeContextMenu } from "./node-dialogs/use-node-context-menu";

type DocumentTreePanelProps = ReturnType<typeof useDocumentTree>;

export function DocumentTreePanel({
  tree,
  visibleNodes,
  handleSelect,
  handleToggle,
}: DocumentTreePanelProps) {
  const nodeContextMenu = useNodeContextMenu();

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
        onContextMenu={nodeContextMenu.handleContextMenu}
      />
      {nodeContextMenu.menu?.node ? (
        <ContextMenu
          x={nodeContextMenu.menu.x}
          y={nodeContextMenu.menu.y}
          node={nodeContextMenu.menu.node}
          items={DOCUMENT_PAGE_MENU_ITEMS}
          nodePermissions={nodeContextMenu.menu.node.permissions}
          onAction={nodeContextMenu.handleMenuAction}
          onClose={nodeContextMenu.closeMenu}
        />
      ) : null}
      <DocumentTreeNodeDialogs {...nodeContextMenu} />

      {visibleNodes.length === 0 ? (
        <p className="mt-3 text-xs text-(--color-text-muted)">Tree is empty.</p>
      ) : null}
    </section>
  );
}
