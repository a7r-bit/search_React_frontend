import type { PathSegment, SearchHighlight } from "./api-global-search-dto";

export type GlobalSearchResultItem =
  | GlobalSearchDirectoryItem
  | GlobalSearchFileItem;
export type GlobalSearchEntity = {
  items: GlobalSearchResultItem[];
  total: number;
  page: number;
  limit: number;
};

export type GlobalSearchDirectoryItem = {
  kind: "directory";
  id: string;
  parentId: string;
  name: string;
  description: string;
  score: number;
  path: PathSegment[];
  highlight: SearchHighlight;
};
export type GlobalSearchFileItem = {
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
