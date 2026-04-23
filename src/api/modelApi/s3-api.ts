import { baseApi } from "../base-api";

type GetFileParams = {
  key: string;
};
type GetFileResponse = {
  url: string;
};

export const S3api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFile: build.query<GetFileResponse, GetFileParams>({
      query: ({ key }) => ({
        url: `/s3/getFile`,
        method: "GET",
        params: { key },
      }),
      transformResponse: (response: GetFileResponse | string): GetFileResponse =>
        typeof response === "string" ? { url: response } : response,
    }),
  }),
});
export const { useLazyGetFileQuery } = S3api;
