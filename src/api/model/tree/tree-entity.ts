export type TreeNodeKind = "directory" | "file";
export type TreeNodeConversionStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "DONE"
  | "FAILED";
export type TreeNodeEntity = {
  id: string;
  parentId: string | null;
  kind: TreeNodeKind;
  name: string;
  hasChildren: boolean;
  permissions: string[];
  document: TreeDocumentEntity | null;
};

export type TreeDocumentEntity = {
  latestVersionId: string;
  version: number;
  fileName: string;
  fileUrl: string;
  conversionStatus: TreeNodeConversionStatus;
  updatedAt: Date;
};
