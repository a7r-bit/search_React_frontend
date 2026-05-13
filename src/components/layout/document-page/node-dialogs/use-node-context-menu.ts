import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useUpdateDocumentVersionMutation } from "@/api/modelApi/document-version-api";
import {
  useCreateNodeMutation,
  useDeleteNodeMutation,
  useUpdateNodeMutation,
} from "@/api/modelApi/tree-api";
import type { ContextMenuAction } from "@/components/ui/ContextMenu";
import type { MouseEvent } from "react";
import { useCallback, useState } from "react";

import { INITIAL_NODE_DIALOG, type NodeDialogState } from "./node-dialog-state";

type NodeContextMenuState = {
  x: number;
  y: number;
  node: TreeNodeEntity | null;
} | null;

export type RenameTreeItemParams = {
  renameTarget: TreeNodeEntity;
  newName: string;
};

export type DeleteTreeItemParams = {
  deleteTarget: TreeNodeEntity;
};

export type CreateTreeDirectoryParams = {
  parentNode: TreeNodeEntity;
  newName: string;
  description?: string;
};

function errorMessageFromUnknown(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Rename failed";
}

export function useNodeContextMenu() {
  const [menu, setMenu] = useState<NodeContextMenuState>(null);
  const [dialog, setDialog] = useState<NodeDialogState>(INITIAL_NODE_DIALOG);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createDirectoryError, setCreateDirectoryError] = useState<
    string | null
  >(null);

  const [updateNode, updateNodeState] = useUpdateNodeMutation();
  const [updateDocumentVersion, updateDocumentVersionState] =
    useUpdateDocumentVersionMutation();
  const [deleteNode, deleteNodeState] = useDeleteNodeMutation();
  const [createNode, createNodeState] = useCreateNodeMutation();

  const handleContextMenu = (node: TreeNodeEntity, event: MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, node });
  };

  const closeMenu = () => {
    setMenu(null);
  };

  const closeNodeDialog = useCallback(() => {
    setDialog(INITIAL_NODE_DIALOG);
    setRenameError(null);
    setDeleteError(null);
    setCreateDirectoryError(null);
  }, []);

  const submitDelete = useCallback(
    async ({ deleteTarget }: DeleteTreeItemParams) => {
      setDeleteError(null);
      if (!deleteTarget) {
        setDeleteError("No item to delete");
        return;
      }
      try {
        await deleteNode({ id: deleteTarget.id }).unwrap();
        closeNodeDialog();
      } catch (error) {
        setDeleteError(errorMessageFromUnknown(error));
      }
    },
    [closeNodeDialog, deleteNode]
  );
  const submitCreateDirectory = useCallback(
    async ({ parentNode, newName, description }: CreateTreeDirectoryParams) => {
      setCreateDirectoryError(null);
      if (!parentNode) {
        setCreateDirectoryError("No parent node to create directory");
        return;
      }
      if (!newName) {
        setCreateDirectoryError("Name cannot be empty");
        return;
      }
      try {
        await createNode({
          parentId: parentNode.id,
          name: newName,
          description,
        }).unwrap();
        closeNodeDialog();
      } catch (error) {
        setCreateDirectoryError(errorMessageFromUnknown(error));
      }
    },
    [closeNodeDialog, createNode]
  );

  const submitRename = useCallback(
    async ({ renameTarget: target, newName }: RenameTreeItemParams) => {
      const trimmed = newName.trim();
      setRenameError(null);

      if (!trimmed) {
        setRenameError("Name cannot be empty");
        return;
      }

      if (!target.permissions.includes("WRITE")) {
        setRenameError("You do not have permission to rename this item");
        return;
      }

      if (trimmed === target.name) {
        closeNodeDialog();
        return;
      }

      try {
        if (target.kind === "directory") {
          await updateNode({
            id: target.id,
            name: trimmed,
            description: "",
          }).unwrap();
        } else {
          const doc = target.document;
          const versionId = doc?.latestVersionId;
          if (!doc || !versionId) {
            setRenameError("No document version to rename");
            return;
          }
          await updateDocumentVersion({
            id: versionId,
            version: doc.version,
            fileName: trimmed,
          }).unwrap();
        }
        closeNodeDialog();
      } catch (error) {
        setRenameError(errorMessageFromUnknown(error));
      }
    },
    [closeNodeDialog, updateDocumentVersion, updateNode]
  );

  const handleMenuAction = (action: ContextMenuAction) => {
    if (!menu?.node) return;

    switch (action) {
      case "rename":
        setDialog({ type: "rename", renameNode: menu.node });
        closeMenu();
        break;
      case "delete":
        setDialog({ type: "delete", deleteNode: menu.node });
        closeMenu();
        break;
      case "create-directory":
        setDialog({ type: "create-directory", parentNode: menu.node });
        closeMenu();
        break;
      case "manage-access":
        console.log("Manage access:", menu.node.id);
        break;
      case "move":
        console.log("Move:", menu.node.id);
        break;
      case "upload-file":
        console.log("Upload file:", menu.node.id);
        break;
      default:
        console.log("Context action:", action, "for node:", menu.node.id);
    }
  };

  const isRenaming =
    updateNodeState.isLoading || updateDocumentVersionState.isLoading;

  return {
    menu,
    handleContextMenu,
    closeMenu,
    handleMenuAction,
    dialog,
    closeNodeDialog,
    submitRename,
    isRenaming,
    renameError,
    submitDelete,
    deleteError,
    isDeleting: deleteNodeState.isLoading,
    submitCreateDirectory,
    createDirectoryError,
    isCreatingDirectory: createNodeState.isLoading,
  };
}
