import type { ApiTreeNodeResponse } from "./api-tree-dto";
import type { TreeNodeEntity } from "./tree-entity";

export const mapApiTreeNodeResponseToTreeNodeEntity = (
  dto: ApiTreeNodeResponse
): TreeNodeEntity => ({
  id: dto.id,
  parentId: dto.parentId,
  kind: dto.kind,
  name: dto.name,
  hasChildren: dto.hasChildren,
  permissions: dto.permissions,
  document: dto.document
    ? {
        latestVersionId: dto.document.latestVersionId,
        version: dto.document.version,
        fileName: dto.document.fileName,
        fileUrl: dto.document.fileUrl,
        conversionStatus: dto.document.conversionStatus,
        updatedAt: new Date(dto.document.updatedAt),
      }
    : null,
});

export const mapApiTreeNodesToEntities = (
  items: ApiTreeNodeResponse[]
): TreeNodeEntity[] => items.map(mapApiTreeNodeResponseToTreeNodeEntity);
