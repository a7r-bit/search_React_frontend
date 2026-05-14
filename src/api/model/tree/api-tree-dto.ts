export type ApiTreeNodeResponse = {
  id: string;
  parentId: string | null;
  kind: "directory" | "file";
  name: string;
  hasChildren: boolean;
  permissions: string[];
  document?: ApiTreeDocument;
};

export type ApiTreeDocument = {
  latestVersionId: string;
  version: number;
  fileName: string;
  fileUrl: string;
  conversionStatus: "PENDING" | "IN_PROGRESS" | "DONE" | "FAILED";
  updatedAt: string;
};

export type ApiCreateNodeResponse = {
  id: string;
  type: "DIRECTORY" | "DOCUMENT";
  parentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
