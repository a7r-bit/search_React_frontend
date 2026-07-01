import type {
  ApiPoliticAccessGroupResponse,
  ApiPoliticGroupResponse,
  ApiPoliticGroupResponseList,
} from "./api-politic-group-dto";
import type {
  AccessType,
  PoliticGroupEntity,
  PoliticGroupListEntity,
  PoliticGroupResponse,
} from "./politic-group-entity";

export const mapApiPoliticGroupResponseToEntity = (
  dto: ApiPoliticGroupResponse
): PoliticGroupEntity => ({
  id: dto.id,
  name: dto.name,
});

export const mapApiPoliticAccessGroupResponseToEntity = (
  dto: ApiPoliticAccessGroupResponse
): PoliticGroupResponse => ({
  group: mapApiPoliticGroupResponseToEntity({ id: dto.id, name: dto.name }),
  accesses: dto.accesses.map((access) => access as AccessType),
});

export const mapApiPoliticGroupResponseListToEntity = (
  dto: ApiPoliticGroupResponseList
): PoliticGroupListEntity => ({
  items: dto.items.map(mapApiPoliticGroupResponseToEntity),
  total: dto.total,
  page: dto.page,
  limit: dto.limit,
});
