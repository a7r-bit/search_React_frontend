export type ApiDocumentVersionResponse = {
  id: string;
  version: number;
  nodeId: string;
  conversionStatus: "PENDING" | "IN_PROGRESS" | "DONE" | "FAILED";
  mediaFile: ApiMediaFileResponce;
  createdAt: string;
  updatedAt: string;
};

export type ApiMediaFileResponce = {
  id: string;
  fileUrl: string;
  fileName: string;
  extention: string;
  documentVersionId: string;
};
