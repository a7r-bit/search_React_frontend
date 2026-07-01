export type AccessType = "READ" | "WRITE" | "ADMIN" | "DELETE";

export type PoliticGroupEntity = {
  id: string;
  name: string;
};

export type PoliticGroupResponse = {
  group: PoliticGroupEntity;
  accesses: AccessType[];
};

export type PoliticGroupListEntity = {
  items: PoliticGroupEntity[];
  total: number;
  page: number;
  limit: number;
};
