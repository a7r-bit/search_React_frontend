import { ModalShell } from "@/components/ui/ModalShell";

import {
  isCopyForTestingDialog,
  isCreateDirectoryDialog,
  isDeleteDialog,
  isMoveDialog,
  isRenameDialog,
  isUploadFileDialog,
  type NodeDialogState,
} from "./node-dialog-state";
import { RenameNodeForm } from "./rename/RenameNodeForm";
import type {
  CreateTreeDirectoryParams,
  DeleteTreeItemParams,
  MoveNodeParams,
  RenameTreeItemParams,
  UploadFileParams,
} from "./use-node-context-menu";
import { DeleteNodeForm } from "./delete/DeleteNodeForm";
import { CreateNodeDirectoryForm } from "./create-directory/CreateNodeDirectoryForm";
import { CopyForTestingForm } from "./copy-for-testing/CopyForTestingForm";
import { UploadFileForm } from "./upload-file/UploadFileForm";
import { MoveNodeForm } from "./move/MoveNodeForm";

type DocumentTreeNodeDialogsProps = {
  readonly dialog: NodeDialogState;
  readonly closeNodeDialog: () => void;
  readonly submitRename: (params: RenameTreeItemParams) => void | Promise<void>;
  readonly isRenaming: boolean;
  readonly renameError: string | null;
  readonly submitDelete: (params: DeleteTreeItemParams) => void | Promise<void>;
  readonly isDeleting: boolean;
  readonly deleteError: string | null;
  readonly submitCreateDirectory: (
    params: CreateTreeDirectoryParams
  ) => void | Promise<void>;
  readonly isCreatingDirectory: boolean;
  readonly createDirectoryError: string | null;
  readonly submitUploadFile: (params: UploadFileParams) => void | Promise<void>;
  readonly uploadFileError: string | null;
  readonly isUploadingFile: boolean;
  readonly submitMove: (params: MoveNodeParams) => void | Promise<void>;
  readonly moveNodeError: string | null;
  readonly isMoving: boolean;
};

export function DocumentTreeNodeDialogs({
  dialog,
  closeNodeDialog,
  submitRename,
  isRenaming,
  renameError,
  deleteError,
  isDeleting,
  submitDelete,
  createDirectoryError,
  isCreatingDirectory,
  submitCreateDirectory,
  isUploadingFile,
  submitUploadFile,
  uploadFileError,
  submitMove,
  moveNodeError,
  isMoving,
}: DocumentTreeNodeDialogsProps) {
  if (isRenameDialog(dialog)) {
    return (
      <ModalShell open onClose={closeNodeDialog} title="Rename">
        <RenameNodeForm
          renameTarget={dialog.renameNode}
          onClose={closeNodeDialog}
          onSubmit={submitRename}
          isSubmitting={isRenaming}
          error={renameError}
        />
      </ModalShell>
    );
  }

  if (isDeleteDialog(dialog)) {
    return (
      <ModalShell open onClose={closeNodeDialog} title="Delete">
        <DeleteNodeForm
          deleteTarget={dialog.deleteNode}
          onClose={closeNodeDialog}
          onSubmit={submitDelete}
          isSubmitting={isDeleting}
          error={deleteError}
        />
      </ModalShell>
    );
  }
  if (isCreateDirectoryDialog(dialog)) {
    return (
      <ModalShell open onClose={closeNodeDialog} title="Create Directory">
        <CreateNodeDirectoryForm
          parentNode={dialog.parentNode}
          onClose={closeNodeDialog}
          onSubmit={submitCreateDirectory}
          isSubmitting={isCreatingDirectory}
          error={createDirectoryError}
        />
      </ModalShell>
    );
  }
  if (isCopyForTestingDialog(dialog)) {
    return (
      <ModalShell open onClose={closeNodeDialog} title="Copy for Testing">
        <CopyForTestingForm
          copyNode={dialog.copyNode}
          onClose={closeNodeDialog}
        />
      </ModalShell>
    );
  }
  if (isUploadFileDialog(dialog)) {
    return (
      <ModalShell open onClose={closeNodeDialog} title="Upload File">
        <UploadFileForm
          parentNode={dialog.parentNode}
          onClose={closeNodeDialog}
          onSubmit={submitUploadFile}
          isSubmitting={isUploadingFile}
          error={uploadFileError}
        />
      </ModalShell>
    );
  }
  if (isMoveDialog(dialog)) {
    return (
      <ModalShell open onClose={closeNodeDialog} title="Move">
        <MoveNodeForm
          movedNode={dialog.moveNode}
          onClose={closeNodeDialog}
          onSubmit={submitMove}
          isSubmitting={isMoving}
          error={moveNodeError}
        />
      </ModalShell>
    );
  }

  return null;
}
