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
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, () => initialState);
  },
});

export const { setSelected, setTree, toogleExpanded, setChildren } =
  treeSlice.actions;
export const treeReducer = treeSlice.reducer;
