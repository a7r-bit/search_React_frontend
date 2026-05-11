import { TreeList } from "@/components/features/TreeList";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { ModalShell } from "@/components/ui/ModalShell";

import DOCUMENT_PAGE_MENU_ITEMS from "./menu-config";
import { useDocumentTree } from "./hooks/useDocumentTree";
import { isRenameDialog } from "./node-dialog-state";
import { RenameNodeForm } from "./RenameNodeForm";
import { useNodeContextMenu } from "./use-node-context-menu";

type DocumentTreePanelProps = ReturnType<typeof useDocumentTree>;

export function DocumentTreePanel({
  tree,
  visibleNodes,
  handleSelect,
  handleToggle,
}: DocumentTreePanelProps) {
  const {
    menu,
    handleContextMenu,
    closeMenu,
    handleMenuAction,
    dialog,
    closeNodeDialog,
    submitRename,
    isRenaming,
    renameError,
  } = useNodeContextMenu();

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
      {menu?.node ? (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          node={menu.node}
          items={DOCUMENT_PAGE_MENU_ITEMS}
          nodePermissions={menu.node.permissions}
          onAction={handleMenuAction}
          onClose={closeMenu}
        />
      ) : null}
      {isRenameDialog(dialog) ? (
        <ModalShell
          open
          onClose={closeNodeDialog}
          title="Rename"
        >
          <RenameNodeForm
            renameTarget={dialog.target}
            onClose={closeNodeDialog}
            onSubmit={submitRename}
            isSubmitting={isRenaming}
            error={renameError}
          />
        </ModalShell>
      ) : null}
      {visibleNodes.length === 0 ? (
        <p className="mt-3 text-xs text-(--color-text-muted)">Tree is empty.</p>
      ) : null}
    </section>
  );
}
