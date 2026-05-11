import { setChildren, setTree } from "@/store/tree/tree-slice";
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
      invalidatesTags: ["Tree"],
    }),
  }),
});

export const {
  useGetTreeQuery,
  useGetTreeChildrenQuery,
  useLazyGetTreeChildrenQuery,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
} = treeApi;
