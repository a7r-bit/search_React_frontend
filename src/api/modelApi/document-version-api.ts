import {
  setDocumentVersions,
  setDocumentVersionsError,
  setDocumentVersionsLoading,
} from "@/store/documentVersion/documentVersion-slice";
import { baseApi } from "../base-api";
import { mapApiDocumentVersionsToEntities } from "../model/documentVersion/mapper";
import type { ApiDocumentVersionResponse } from "../model/documentVersion/api-document-version-dto";

export const documentVersionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDocumentsVersions: build.query<ApiDocumentVersionResponse[], string>({
      query: (nodeId) => ({
        url: `/document-versions/${nodeId}/node`,
        method: "GET",
      }),
      async onQueryStarted(nodeId, { dispatch, queryFulfilled }) {
        dispatch(setDocumentVersionsLoading(nodeId));
        try {
          const { data } = await queryFulfilled;
          const versions = mapApiDocumentVersionsToEntities(data)
            .sort((a, b) => b.verison - a.verison)
            .map((item) => ({
              ...item,
              createdAt: String(item.createdAt),
            }));
          dispatch(
            setDocumentVersions({
              nodeId,
              versions,
            })
          );
        } catch (error) {
          dispatch(
            setDocumentVersionsError("Failed to load document versions")
          );
        }
      },
    }),
  }),
});

export const {
  useGetDocumentsVersionsQuery,
  useLazyGetDocumentsVersionsQuery,
} = documentVersionApi;
