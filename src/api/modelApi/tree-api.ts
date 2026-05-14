import { removeNode, setChildren, setTree } from "@/store/tree/tree-slice";
import { baseApi } from "../base-api";
import type {
  CreateNodeEntity,
  TreeNodeEntity,
} from "../model/tree/tree-entity";
import type { ApiNodeUpdateDto } from "../model/node/api-node-dto";
import type { NodeEntity } from "../model/node/node-entity";
import { mapApiNodeDtoToEntity } from "../model/node/mapper";
import type { ApiCreateNodeResponse } from "../model/tree/api-tree-dto";
import { mapApiCreateNodeResponseToCreateNodeEntity } from "../model/tree/mapper";

type GetTreeChildrenParams = {
  parentId: string;
  type?: string;
  sort?: string;
};

type UpdateNodeParams = {
  id: string;
  name: string;
  description: string;
};

type CreateNodeParams = {
  parentId: string;
  name: string;
  description?: string;
  type: "DIRECTORY" | "DOCUMENT";
};

type MoveNodeParams = {
  moveNodeId: string;
  newParentId: string;
};

export const treeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTree: build.query<TreeNodeEntity[], void>({
      query: () => ({
        url: "/node/children",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTree(data));
        } catch (error) {}
      },
      providesTags: ["Tree"],
    }),

    getTreeChildren: build.query<TreeNodeEntity[], GetTreeChildrenParams>({
      query: ({ parentId, type, sort }) => ({
        url: "/node/children",
        params: { parentId, type, sort },
        method: "GET",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setChildren(data));
        } catch (error) {}
      },
      providesTags: ["Tree"],
    }),
    createNode: build.mutation<CreateNodeEntity, CreateNodeParams>({
      query: ({ parentId, name, description, type }) => ({
        url: "/node",
        method: "POST",
        body: { type: type, parentId, name, description },
      }),
      transformResponse: (response: ApiCreateNodeResponse) =>
        mapApiCreateNodeResponseToCreateNodeEntity(response),
      invalidatesTags: ["Tree"],
    }),

    updateNode: build.mutation<NodeEntity, UpdateNodeParams>({
      query: ({ id, name, description }) => ({
        url: `/node/${id}`,
        method: "PATCH",
        body: { name, description },
      }),
      transformResponse: (response: ApiNodeUpdateDto) =>
        mapApiNodeDtoToEntity(response),
      invalidatesTags: ["Tree"],
    }),

    moveNode: build.mutation<NodeEntity, MoveNodeParams>({
      query: ({ newParentId, moveNodeId }) => ({
        url: `/node/${moveNodeId}/move`,
        method: "PUT",
        body: { newParentId: newParentId },
      }),
      transformResponse: (response: ApiNodeUpdateDto) =>
        mapApiNodeDtoToEntity(response),
      invalidatesTags: ["Tree"],
    }),

    deleteNode: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/node/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeNode(id));
        } catch (error) {}
      },
      invalidatesTags: ["Tree"],
    }),
  }),
});

export const {
  useGetTreeQuery,
  useGetTreeChildrenQuery,
  useLazyGetTreeChildrenQuery,
  useCreateNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
  useMoveNodeMutation,
} = treeApi;
