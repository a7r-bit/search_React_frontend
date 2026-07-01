type ApiAccessType = "READ" | "WRITE" | "ADMIN" | "DELETE";

export type ApiPoliticGroupResponse = {
  id: string;
  name: string;
};
export type ApiPoliticGroupResponseList = {
  items: ApiPoliticGroupResponse[];
  total: number;
  page: number;
  limit: number;
};
export type ApiPoliticAccessGroupResponse = {
  id: string;
  name: string;
  accesses: ApiAccessType[];
};
