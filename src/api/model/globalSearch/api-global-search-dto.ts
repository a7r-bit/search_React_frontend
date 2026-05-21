export type PathSegment = {
  id: string;
  name: string;
};
export type SearchHighlight = {
  title: string;
  snippet: string | null;
};

export type ApiGlobalSearchResponse = {
  items: (ApiGlobalSearchFileItem | ApiGlobalSearchDirectoryItem)[];
  total: number;
  page: number;
  limit: number;
};

export type ApiGlobalSearchDirectoryItem = {
  kind: "directory";
  id: string;
  parentId: string;
  name: string;
  description: string;
  score: number;
  path: PathSegment[];
  highlight: SearchHighlight;
};
export type ApiGlobalSearchFileItem = {
  kind: "file";
  id: string;
  nodeId: string;
  parentId: string;
  fileName: string;
  version: number;
  fileUrl: string;
  createdAt: string;
  score: number;
  path: PathSegment[];
  highlight: SearchHighlight;
};
