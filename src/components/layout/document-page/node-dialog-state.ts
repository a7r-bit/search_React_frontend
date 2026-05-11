import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";

/** Discriminated union for node-related modals in the document tree panel. */
export type NodeDialogState =
  | { readonly type: "closed" }
  | { readonly type: "rename"; readonly target: TreeNodeEntity };

export const INITIAL_NODE_DIALOG: NodeDialogState = { type: "closed" };

export function isRenameDialog(
  state: NodeDialogState
): state is Extract<NodeDialogState, { type: "rename" }> {
  return state.type === "rename";
}
