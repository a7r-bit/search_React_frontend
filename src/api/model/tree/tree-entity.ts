export type TreeNodeEntity = {
  id: string;
  parentId: string | null;
  kind: "directory" | "file";
  name: string;
  hasChildren: boolean;
  permissions: string[];
  document: TreeDocumentEntity | null;
};

export type TreeDocumentEntity = {
  latestVersionId: string;
  version: number;
  fileName: string;
  fileUrl:string;
  conversionStatus: "PENDING" | "IN_PROGRESS" | "DONE" | "FAILED";
  updatedAt: Date;
};
