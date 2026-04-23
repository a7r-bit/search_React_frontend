export type ApiError = {
  readonly message: string;
  readonly statusCode: number;
};

export * from "./auth/auth";
export * from "./tree/tree-entity";
