import type { ApiNodeUpdateDto } from "./api-node-dto";
import type { NodeEntity } from "./node-entity";

export const mapApiNodeDtoToEntity = (dto: ApiNodeUpdateDto): NodeEntity => ({
  id: dto.id,
  type: dto.type,
  parentId: dto.parentId,
  name: dto.name,
  description: dto.description,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const mapApiNodesToEntities = (
  items: ApiNodeUpdateDto[]
): NodeEntity[] => items.map(mapApiNodeDtoToEntity);
