import { baseApi } from "../base-api";
import type { ApiGlobalSearchResponse } from "../model/globalSearch/api-global-search-dto";
import type { GlobalSearchEntity } from "../model/globalSearch/global-search-entity";
import { mapApiGlobalSearchResponceToEntity } from "../model/globalSearch/mapper";

export type GlobalSearchRequest = {
  currentNodeId: string;
  searchQuery: string;
};

export const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    globalSearch: build.query<GlobalSearchEntity, GlobalSearchRequest>({
      query: ({ currentNodeId, searchQuery }) => ({
        url: "/global-search",
        method: "POST",
        body: {
          currentNodeId,
          searchQuery,
        },
      }),
      transformResponse: (responce: ApiGlobalSearchResponse) =>
        mapApiGlobalSearchResponceToEntity(responce),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazyGlobalSearchQuery } = searchApi;
