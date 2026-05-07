import type { RootState } from "@/app/root-reducer";

export const selectDocumentVersions = (state: RootState) =>
  state.documentVersion.versions;
