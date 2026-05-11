export type NodeEntity = {
  id: string;
  type: "DIRECTORY" | "DOCUMENT";
  parentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
