import { baseApi } from "../base-api";
import type {
  ApiPoliticAccessGroupResponse,
  ApiPoliticGroupResponse,
  ApiPoliticGroupResponseList,
} from "../model/politicGroup/api-politic-group-dto";
import {
  mapApiPoliticAccessGroupResponseToEntity,
  mapApiPoliticGroupResponseListToEntity,
  mapApiPoliticGroupResponseToEntity,
} from "../model/politicGroup/mapper";
import type {
  AccessType,
  PoliticGroupEntity,
  PoliticGroupListEntity,
  PoliticGroupResponse,
} from "../model/politicGroup/politic-group-entity";

type GetPoliticGroupsParams = {
  page?: number;
  limit: number;
  search?: string;
};
type GetGroupWithAccessedForNodeParams = {
  nodeId: string;
};

type UpdatePoliticGroupForNodeParams = {
  nodeId: string;
  groupAccesses: UpdateGroupAccesses[];
};
export type UpdateGroupAccesses = {
  groupId: string;
  accesses: AccessType[];
};
export const politicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPoliticGroups: build.query<
      PoliticGroupListEntity,
      GetPoliticGroupsParams
    >({
      query: ({ page = 1, limit, search }) => ({
        url: "/politic/groups",
        method: "GET",
        params: { page, limit, search },
      }),
      transformResponse: (response: ApiPoliticGroupResponseList) =>
        mapApiPoliticGroupResponseListToEntity(response),
    }),

    getGroupWithAccessedForNode: build.query<
      PoliticGroupResponse[],
      GetGroupWithAccessedForNodeParams
    >({
      query: ({ nodeId }) => ({
        url: "/politic/groups/accesses",
        method: "GET",
        params: { nodeId },
      }),
      transformResponse: (response: ApiPoliticAccessGroupResponse[]) =>
        response.map(mapApiPoliticAccessGroupResponseToEntity),
      providesTags: (_result, _error, { nodeId }) => [
        { type: "GroupAccess", id: nodeId },
      ],
    }),

    updatePoliticGroupForNode: build.mutation<
      PoliticGroupResponse[],
      UpdatePoliticGroupForNodeParams
    >({
      query: ({ nodeId, groupAccesses }) => ({
        url: "/politic/groups/accesses",
        method: "PUT",
        params: { nodeId },
        body: { groups: groupAccesses },
      }),
      transformResponse: (response: ApiPoliticAccessGroupResponse[]) =>
        response.map(mapApiPoliticAccessGroupResponseToEntity),
      invalidatesTags: (_result, _error, { nodeId }) => [
        { type: "GroupAccess", id: nodeId },
      ],
    }),
  }),
});

export const {
  useGetPoliticGroupsQuery,
  useLazyGetPoliticGroupsQuery,
  useGetGroupWithAccessedForNodeQuery,
  useLazyGetGroupWithAccessedForNodeQuery,
  useUpdatePoliticGroupForNodeMutation,
} = politicApi;
