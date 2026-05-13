import { ModalShell } from "@/components/ui/ModalShell";

import {
  isCopyForTestingDialog,
  isCreateDirectoryDialog,
  isDeleteDialog,
  isRenameDialog,
  type NodeDialogState,
} from "./node-dialog-state";
import { RenameNodeForm } from "./rename/RenameNodeForm";
import type {
  CreateTreeDirectoryParams,
  DeleteTreeItemParams,
  RenameTreeItemParams,
} from "./use-node-context-menu";
import { DeleteNodeForm } from "./delete/DeleteNodeForm";
import { CreateNodeDirectoryForm } from "./create-directory/CreateNodeDirectoryForm";
import { CopyForTestingForm } from "./copy-for-testing/CopyForTestingForm";

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

  return null;
}
