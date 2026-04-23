import { setChildren, setTree } from "@/store/tree/tree-slice";
import { baseApi } from "../base-api";
import type { TreeNodeEntity } from "../model/tree/tree-entity";

type GetTreeChildrenParams = {
  parentId: string;
  type?: string;
  sort?: string;
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
  }),
});

export const {
  useGetTreeQuery,
  useGetTreeChildrenQuery,
  useLazyGetTreeChildrenQuery,
} = treeApi;
