import type { ApiDocumentVersionResponse } from "./api-document-version-dto";
import type { DocumentVersionEntity } from "./document-version-entity";

export const mapApiDicumentVersionToEntity = (
  dto: ApiDocumentVersionResponse
): DocumentVersionEntity => ({
  id: dto.id,
  verison: dto.version,
  nodeId: dto.nodeId,
  conversionStatus: dto.conversionStatus,
  fileName: dto.mediaFile.fileName,
  fileUrl: dto.mediaFile.fileUrl,
  extention: dto.mediaFile.extention,
  createdAt: dto.createdAt,
});

export const mapApiDocumentVersionsToEntities = (
  items: ApiDocumentVersionResponse[]
): DocumentVersionEntity[] => items.map(mapApiDicumentVersionToEntity);
