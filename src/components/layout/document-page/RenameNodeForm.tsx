import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { Field, Input, Label } from "@headlessui/react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";

import type { RenameTreeItemParams } from "./use-node-context-menu";

type RenameNodeFormProps = {
  readonly renameTarget: TreeNodeEntity;
  readonly onClose: () => void;
  readonly onSubmit: (params: RenameTreeItemParams) => void | Promise<void>;
  readonly isSubmitting: boolean;
  readonly error: string | null;
};

export function RenameNodeForm({
  renameTarget,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: RenameNodeFormProps) {
  const [value, setValue] = useState(renameTarget.name);

  useEffect(() => {
    setValue(renameTarget.name);
  }, [renameTarget]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit({ renameTarget, newName: value });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Field className="w-full">
        <Label
          htmlFor="rename-node-name"
          className="mb-1 block text-sm text-(--color-text)"
        >
          Name
        </Label>
        <Input
          id="rename-node-name"
          type="text"
          name="name"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
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
        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
