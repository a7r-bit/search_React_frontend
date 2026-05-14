import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import {
  useUpdateDocumentVersionMutation,
  useUploadFileMutation,
} from "@/api/modelApi/document-version-api";
import {
  treeApi,
  useCreateNodeMutation,
  useDeleteNodeMutation,
  useMoveNodeMutation,
  useUpdateNodeMutation,
} from "@/api/modelApi/tree-api";
import type { ContextMenuAction } from "@/components/ui/ContextMenu";
import { useAppDispatch } from "@/hooks/redux";
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

export type CopyForTestingParams = {
  copyNode: TreeNodeEntity;
};

export type UploadFileParams = {
  parentNode: TreeNodeEntity;
  file: File;
};

export type MoveNodeParams = {
  movedNode: TreeNodeEntity;
  newParentNode: TreeNodeEntity;
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
  const dispatch = useAppDispatch();
  const [menu, setMenu] = useState<NodeContextMenuState>(null);
  const [dialog, setDialog] = useState<NodeDialogState>(INITIAL_NODE_DIALOG);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createDirectoryError, setCreateDirectoryError] = useState<
    string | null
  >(null);
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const [moveNodeError, setMoveNodeError] = useState<string | null>(null);

  const [updateNode, updateNodeState] = useUpdateNodeMutation();
  const [updateDocumentVersion, updateDocumentVersionState] =
    useUpdateDocumentVersionMutation();
  const [deleteNode, deleteNodeState] = useDeleteNodeMutation();
  const [createNode, createNodeState] = useCreateNodeMutation();
  const [uploadFile, uploadFileState] = useUploadFileMutation();
  const [moveNode, moveNodeState] = useMoveNodeMutation();

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
    setUploadFileError(null);
    setMoveNodeError(null);
  }, []);

  const refreshTreeByParentId = useCallback(
    (parentId: string | null) => {
      if (parentId) {
        void dispatch(
          treeApi.endpoints.getTreeChildren.initiate(
            { parentId, sort: "name:asc" },
            { forceRefetch: true }
          )
        );
        return;
      }

      void dispatch(
        treeApi.endpoints.getTree.initiate(undefined, {
          forceRefetch: true,
        })
      );
    },
    [dispatch]
  );

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

  const submitUploadFile = useCallback(
    async ({ parentNode, file }: UploadFileParams) => {
      setUploadFileError(null);
      if (!parentNode) {
        setUploadFileError("No parent node to upload file");
        return;
      }
      if (!file) {
        setUploadFileError("No file to upload");
        return;
      }
      try {
        if (parentNode.kind === "directory") {
          const newDocumentNode = await createNode({
            type: "DOCUMENT",
            name: file.name,
            parentId: parentNode.id,
          }).unwrap();
          await uploadFile({ nodeId: newDocumentNode.id, file }).unwrap();
          refreshTreeByParentId(newDocumentNode.id);
          closeNodeDialog();
        }
        if (parentNode.kind === "file") {
          await uploadFile({ nodeId: parentNode.id, file }).unwrap();
          refreshTreeByParentId(parentNode.id);
          closeNodeDialog();
        }
      } catch (error) {
        setUploadFileError(errorMessageFromUnknown(error));
      }
    },
    [closeNodeDialog, createNode, refreshTreeByParentId, uploadFile]
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
          type: "DIRECTORY",
        }).unwrap();
        refreshTreeByParentId(parentNode.id);
        closeNodeDialog();
      } catch (error) {
        setCreateDirectoryError(errorMessageFromUnknown(error));
      }
    },
    [closeNodeDialog, createNode, refreshTreeByParentId]
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

  const submitMove = useCallback(
    async ({ movedNode, newParentNode }: MoveNodeParams) => {
      setMoveNodeError(null);
      if (!movedNode) {
        setMoveNodeError("No node to move");
        return;
      }
      if (!newParentNode) {
        setMoveNodeError("No parent node to move to");
        return;
      }
      try {
        await moveNode({
          moveNodeId: movedNode.id,
          newParentId: newParentNode.id,
        }).unwrap();
        refreshTreeByParentId(movedNode.parentId);
        refreshTreeByParentId(newParentNode.id);
        closeNodeDialog();
      } catch (error) {
        setMoveNodeError(errorMessageFromUnknown(error));
      }
    },
    [closeNodeDialog, moveNode, refreshTreeByParentId]
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
      case "copy-for-testing":
        setDialog({ type: "copy-for-testing", copyNode: menu.node });
        closeMenu();
        break;
      case "move":
        setDialog({ type: "move", moveNode: menu.node });
        closeMenu();
        break;
      case "upload-file":
        setDialog({ type: "upload-file", parentNode: menu.node });
        closeMenu();
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
    submitUploadFile,
    uploadFileError,
    isUploadingFile: uploadFileState.isLoading,
    submitMove,
    moveNodeError,
    isMoving: moveNodeState.isLoading,
  };
}
