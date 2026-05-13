import { TreeList } from "@/components/features/TreeList";
import { ContextMenu } from "@/components/ui/ContextMenu";

import DOCUMENT_PAGE_MENU_ITEMS from "./menu-config";
import { DocumentTreeNodeDialogs } from "./node-dialogs/DocumentTreeNodeDialogs";
import { useDocumentTree } from "./hooks/useDocumentTree";
import {
  useNodeContextMenu,
  type CreateTreeDirectoryParams,
} from "./node-dialogs/use-node-context-menu";

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
    deleteError,
    isDeleting,
    submitDelete,
    createDirectoryError,
    isCreatingDirectory,
    submitCreateDirectory,
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
      <DocumentTreeNodeDialogs
        dialog={dialog}
        closeNodeDialog={closeNodeDialog}
        submitRename={submitRename}
        isRenaming={isRenaming}
        renameError={renameError}
        submitDelete={submitDelete}
        isDeleting={isDeleting}
        deleteError={deleteError}
        submitCreateDirectory={submitCreateDirectory}
        isCreatingDirectory={isCreatingDirectory}
        createDirectoryError={createDirectoryError}
      />

      {visibleNodes.length === 0 ? (
        <p className="mt-3 text-xs text-(--color-text-muted)">Tree is empty.</p>
      ) : null}
    </section>
  );
}
