import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { type SubmitEventHandler } from "react";

import { Button } from "@/components/ui/Button";

import type { DeleteTreeItemParams } from "../use-node-context-menu";

type DeleteNodeFormProps = {
  readonly deleteTarget: TreeNodeEntity;
  readonly onClose: () => void;
  readonly onSubmit: (params: DeleteTreeItemParams) => void | Promise<void>;
  readonly isSubmitting: boolean;
  readonly error: string | null;
};

export function DeleteNodeForm({
  deleteTarget,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: DeleteNodeFormProps) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void onSubmit({ deleteTarget });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <p className="text-xs text-(--color-text-muted)">
        Are you sure you want to delete:{" "}
        <span className="font-medium text-(--color-text)">
          {deleteTarget.name}?
        </span>
      </p>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
        >
          Delete
        </Button>
      </div>
    </form>
  );
}
