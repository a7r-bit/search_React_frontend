import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
// "create-directory"
// | "upload-file"
// | "move"
// | "rename"
// | "manage-access"
// | "copy-for-testing"
// | "delete";

/** Discriminated union for node-related modals in the document tree panel. */
export type NodeDialogState =
  | { readonly type: "closed" }
  | { readonly type: "create-directory"; readonly parentNode: TreeNodeEntity }
  | { readonly type: "upload-file"; readonly parentNode: TreeNodeEntity }
  | { readonly type: "move"; readonly moveNode: TreeNodeEntity }
  | { readonly type: "manage-access"; readonly manageNode: TreeNodeEntity }
  | { readonly type: "rename"; readonly renameNode: TreeNodeEntity }
  | { readonly type: "copy-for-testing"; readonly copyNode: TreeNodeEntity }
  | { readonly type: "delete"; readonly deleteNode: TreeNodeEntity };

export const INITIAL_NODE_DIALOG: NodeDialogState = { type: "closed" };

export function isRenameDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "rename" }> {
  return state.type === "rename";
}

export function isDeleteDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "delete" }> {
  return state.type === "delete";
}

export function isCreateDirectoryDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "create-directory" }> {
  return state.type === "create-directory";
}

export function isUploadFileDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "upload-file" }> {
  return state.type === "upload-file";
}

export function isMoveDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "move" }> {
  return state.type === "move";
}

export function isManageAccessDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "manage-access" }> {
  return state.type === "manage-access";
}

export function isCopyForTestingDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "copy-for-testing" }> {
  return state.type === "copy-for-testing";
}
