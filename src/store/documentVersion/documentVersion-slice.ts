import type { DocumentVersionEntity } from "@/api/model/documentVersion/document-version-entity";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DocumentVersionStatus = "initial" | "loading" | "success" | "error";
type DocumentVersionState = {
  versions: DocumentVersionEntity[];
  currentNodeId: string | null;
  status: DocumentVersionStatus;
  error: string | null;
  selectedVersionId: string | null;
};

type SetDocumentVersionsPayload = {
  nodeId: string;
  versions: DocumentVersionEntity[];
};

const initialState: DocumentVersionState = {
  versions: [],
  currentNodeId: null,
  status: "initial",
  error: null,
  selectedVersionId: null,
};

const documentVersionSlice = createSlice({
  name: "documentVersion",
  initialState: initialState,
  reducers: {
    setDocumentVersions(
      state,
      action: PayloadAction<SetDocumentVersionsPayload>
    ) {
      state.currentNodeId = action.payload.nodeId;
      state.versions = action.payload.versions;
      state.status = "success";
      state.error = null;
    },
    setDocumentVersionsLoading(state, action: PayloadAction<string>) {
      state.currentNodeId = action.payload;
      state.versions = [];
      state.selectedVersionId = null;
      state.status = "loading";
      state.error = null;
    },
    setDocumentVersionsError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    selectDocumentVersion(state, action: PayloadAction<string | null>) {
      state.selectedVersionId = action.payload;
    },
    clearDocumentVersions(state) {
      state.versions = [];
      state.currentNodeId = null;
      state.selectedVersionId = null;
      state.status = "initial";
      state.error = null;
    },
  },
});

export const {
  setDocumentVersions,
  setDocumentVersionsLoading,
  setDocumentVersionsError,
  selectDocumentVersion,
  clearDocumentVersions,
} = documentVersionSlice.actions;
export const documentVersionReducer = documentVersionSlice.reducer;
