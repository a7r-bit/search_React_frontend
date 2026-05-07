export type DocumentVersionEntity = {
  id: string;
  verison: number;
  nodeId: string;
  conversionStatus: "PENDING" | "IN_PROGRESS" | "DONE" | "FAILED";
  fileUrl: string;
  fileName: string;
  extention: string;
  createdAt: string;
};
