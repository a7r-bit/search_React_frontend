import { removeNode, setChildren, setTree } from "@/store/tree/tree-slice";
import { baseApi } from "../base-api";
import type { TreeNodeEntity } from "../model/tree/tree-entity";
import type { ApiNodeUpdateDto } from "../model/node/api-node-dto";
import type { NodeEntity } from "../model/node/node-entity";
import { mapApiNodeDtoToEntity } from "../model/node/mapper";

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
          console.log("Получение корневых узлов", data);
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
          console.log(
            `Получение дочерних узлов для узла ${_args.parentId}`,
            data
          );
          dispatch(setChildren(data));
        } catch (error) {}
      },
      providesTags: ["Tree"],
    }),
    createNode: build.mutation<void, CreateNodeParams>({
      query: ({ parentId, name, description }) => ({
        url: "/node",
        method: "POST",
        body: { type: "DIRECTORY", parentId, name, description },
      }),
      invalidatesTags: ["Tree"],
      async onQueryStarted({ parentId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          if (parentId) {
            dispatch(
              treeApi.endpoints.getTreeChildren.initiate(
                { parentId, sort: "name:asc" },
                { forceRefetch: true }
              )
            );
          } else {
            dispatch(
              treeApi.endpoints.getTree.initiate(undefined, {
                forceRefetch: true,
              })
            );
          }
        } catch {}
      },
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
} = treeApi;
