import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useState, type ChangeEvent, type SubmitEventHandler } from "react";

import { Button } from "@/components/ui/Button";

import type { CreateTreeDirectoryParams } from "../use-node-context-menu";
import { Field, Input, Label } from "@headlessui/react";

type CreateNodeDirectoryFormProps = {
  readonly parentNode: TreeNodeEntity;
  readonly onClose: () => void;
  readonly onSubmit: (
    params: CreateTreeDirectoryParams
  ) => void | Promise<void>;
  readonly isSubmitting: boolean;
  readonly error: string | null;
};

export function CreateNodeDirectoryForm({
  parentNode,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: CreateNodeDirectoryFormProps) {
  const [nameValue, setNameValue] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void onSubmit({ parentNode, newName: nameValue, description: null });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Field className="w-full">
        <Label
          htmlFor="create-node-directory-name"
          className="mb-1 block text-sm text-(--color-text)"
        >
          Name
        </Label>
        <Input
          id="create-node-directory-name"
          type="text"
          name="name"
          value={nameValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setNameValue(event.target.value);
          }}
          autoComplete="off"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) outline-none transition-colors focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-ring)"
        />
      </Field>
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
          Create
        </Button>
      </div>
    </form>
  );
}
