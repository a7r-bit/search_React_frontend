import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "@/store/auth/auth-slice";

type TreeState = {
  entities: Record<string, TreeNodeEntity>;
  rootIds: string[];
  childrenByParentId: Record<string, string[]>;
  expandedIds: string[];
  selectedId: string | null;
};

const initialState: TreeState = {
  entities: {},
  rootIds: [],
  childrenByParentId: {},
  expandedIds: [],
  selectedId: null,
};

const treeSlice = createSlice({
  name: "tree",
  initialState: initialState,
  reducers: {
    setTree(state, action: PayloadAction<TreeNodeEntity[]>) {
      const payload = action.payload;
      if (payload.length === 0) {
        return;
      }

      const incomingEntities = payload.reduce(
        (acc, node) => {
          acc[node.id] = node;
          return acc;
        },
        {} as Record<string, TreeNodeEntity>
      );
      state.entities = { ...state.entities, ...incomingEntities };

      const rootsFromPayload = payload
        .filter((node) => node.parentId === null)
        .map((node) => node.id);
      if (rootsFromPayload.length > 0) {
        state.rootIds = rootsFromPayload;
      }

      const childrenFromPayload = payload.reduce(
        (acc, node) => {
          if (node.parentId !== null) {
            const parentId = node.parentId;
            if (!acc[parentId]) {
              acc[parentId] = [];
            }
            acc[parentId].push(node.id);
          }
          return acc;
        },
        {} as Record<string, string[]>
      );
      for (const parentId of Object.keys(childrenFromPayload)) {
        state.childrenByParentId[parentId] = childrenFromPayload[parentId]!;
      }
    },
    toogleExpanded(state, action: PayloadAction<string>) {
      const newExpandedIds = state.expandedIds.includes(action.payload)
        ? state.expandedIds.filter((id) => id !== action.payload)
        : [...state.expandedIds, action.payload];
      state.expandedIds = newExpandedIds;
    },
    setSelected(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    setChildren(state, action: PayloadAction<TreeNodeEntity[]>) {
      const newEntities = {
        ...state.entities,
        ...action.payload.reduce(
          (acc, node) => {
            acc[node.id] = node;
            return acc;
          },
          {} as Record<string, TreeNodeEntity>
        ),
      };
      state.entities = newEntities;
      const newChildrenByParentId = {
        ...state.childrenByParentId,
        ...action.payload.reduce(
          (acc, node) => {
            if (node.parentId) {
              acc[node.parentId] = [...(acc[node.parentId] || []), node.id];
            }
            return acc;
          },
          {} as Record<string, string[]>
        ),
      };
      state.childrenByParentId = newChildrenByParentId;
    },
    removeNode(state, action: PayloadAction<string>) {
      const idsToRemove = new Set<string>();
      const stack = [action.payload];

      while (stack.length > 0) {
        const id = stack.pop();
        if (!id || idsToRemove.has(id)) continue;

        idsToRemove.add(id);
        for (const childId of state.childrenByParentId[id] ?? []) {
          stack.push(childId);
        }
      }

      const target = state.entities[action.payload];
      if (target?.parentId === null) {
        state.rootIds = state.rootIds.filter((id) => !idsToRemove.has(id));
      } else if (target?.parentId) {
        const siblings = state.childrenByParentId[target.parentId] ?? [];
        const nextSiblings = siblings.filter((id) => !idsToRemove.has(id));
        state.childrenByParentId[target.parentId] = nextSiblings;

        const parent = state.entities[target.parentId];
        if (parent && nextSiblings.length === 0) {
          parent.hasChildren = false;
        }
      }

      for (const id of idsToRemove) {
        delete state.entities[id];
        delete state.childrenByParentId[id];
      }

      state.expandedIds = state.expandedIds.filter(
        (id) => !idsToRemove.has(id)
      );
      if (state.selectedId && idsToRemove.has(state.selectedId)) {
        state.selectedId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, () => initialState);
  },
});

export const { setSelected, setTree, toogleExpanded, setChildren, removeNode } =
  treeSlice.actions;
export const treeReducer = treeSlice.reducer;
