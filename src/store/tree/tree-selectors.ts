import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import type { RootState } from "@/app/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

export const selectNodeById = (state: RootState, id: string) =>
  state.tree.entities[id] ?? null;
export const selectChildrenByParentId = (
  state: RootState,
  parentId: string
) => {
  const ids = state.tree.childrenByParentId[parentId] ?? [];
  return ids.map((id) => state.tree.entities[id]).filter(Boolean);
};

const selectTreeState = (state: RootState) => state.tree;

export const selectVisibleNodes = createSelector([selectTreeState], (tree) => {
  const { entities, expandedIds, rootIds, childrenByParentId } = tree;
  const expanded = new Set(expandedIds);

  const result: TreeNodeEntity[] = [];
  const stack = [...rootIds].reverse();
  while (stack.length > 0) {
    const id = stack.pop();
    if (!id) continue;

    const node = entities[id];
    if (!node) continue;
    result.push(node);

    if (expanded.has(id)) {
      const children = childrenByParentId[id] ?? [];
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }

  return result;
});
