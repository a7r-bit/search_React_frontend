import type {
  ApiGlobalSearchDirectoryItem,
  ApiGlobalSearchFileItem,
  ApiGlobalSearchResponse,
} from "./api-global-search-dto";
import type {
  GlobalSearchDirectoryItem,
  GlobalSearchEntity,
  GlobalSearchFileItem,
} from "./global-search-entity";

export const mapApiGlobalSearchResponceToEntity = (
  dto: ApiGlobalSearchResponse
): GlobalSearchEntity => ({
  items: dto.items.map((item) =>
    item.kind === "file"
      ? mapApiGlobalSearchFileItemToEntity(item as ApiGlobalSearchFileItem)
      : mapApiGlobalSearchDirectoryItemToEntity(
          item as ApiGlobalSearchDirectoryItem
        )
  ),
  total: dto.total,
  page: dto.page,
  limit: dto.limit,
});

const mapApiGlobalSearchDirectoryItemToEntity = (
  item: ApiGlobalSearchDirectoryItem
): GlobalSearchDirectoryItem => ({
  kind: item.kind,
  id: item.id,
  parentId: item.parentId,
  name: item.name,
  description: item.description,
  score: item.score,
  path: item.path,
  highlight: item.highlight,
});
const mapApiGlobalSearchFileItemToEntity = (
  item: ApiGlobalSearchFileItem
): GlobalSearchFileItem => ({
  kind: item.kind,
  id: item.id,
  nodeId: item.nodeId,
  parentId: item.parentId,
  fileName: item.fileName,
  version: item.version,
  fileUrl: item.fileUrl,
  createdAt: item.createdAt,
  score: item.score,
  path: item.path,
  highlight: item.highlight,
});
