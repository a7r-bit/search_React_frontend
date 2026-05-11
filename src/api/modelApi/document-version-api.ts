import {
  setDocumentVersions,
  setDocumentVersionsError,
  setDocumentVersionsLoading,
} from "@/store/documentVersion/documentVersion-slice";
import { baseApi } from "../base-api";
import {
  mapApiDicumentVersionToEntity,
  mapApiDocumentVersionsToEntities,
} from "../model/documentVersion/mapper";
import type { ApiDocumentVersionResponse } from "../model/documentVersion/api-document-version-dto";
import type { DocumentVersionEntity } from "../model/documentVersion/document-version-entity";

type UpdateDocumentVersionParams = {
  id: string;
  version: number;
  fileName: string;
};

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
    updateDocumentVersion: build.mutation<
      DocumentVersionEntity,
      UpdateDocumentVersionParams
    >({
      query: ({ id, version, fileName }) => ({
        url: `/document-versions/${id}`,
        method: "PATCH",
        body: { version, fileName },
      }),
      transformResponse: (responce: ApiDocumentVersionResponse) =>
        mapApiDicumentVersionToEntity(responce),
      invalidatesTags: ["Tree"],
    }),
    deleteDocumentVersion: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/document-versions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tree"],
    }),
  }),
});

export const {
  useGetDocumentsVersionsQuery,
  useLazyGetDocumentsVersionsQuery,
  useDeleteDocumentVersionMutation,
  useUpdateDocumentVersionMutation,
} = documentVersionApi;
