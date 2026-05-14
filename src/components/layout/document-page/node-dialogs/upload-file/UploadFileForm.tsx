import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { Field, Input, Label } from "@headlessui/react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEventHandler,
} from "react";

import { Button } from "@/components/ui/Button";
import type { UploadFileParams } from "../use-node-context-menu";
import { FileStack } from "lucide-react";

type UploadFileFormProps = {
  readonly parentNode: TreeNodeEntity;
  readonly onClose: () => void;
  readonly onSubmit: (params: UploadFileParams) => void | Promise<void>;
  readonly isSubmitting: boolean;
  readonly error: string | null;
};

export function UploadFileForm({
  error,
  isSubmitting,
  onClose,
  onSubmit,
  parentNode,
}: UploadFileFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFile(null);
  }, [parentNode.id]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    void onSubmit({ parentNode, file });
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Field className="w-full">
        <Label
          htmlFor="upload-file-input"
          className="mb-1 block text-sm text-(--color-text)"
        >
          File
        </Label>

        <div className="relative w-full">
          <Input
            id="upload-file-input"
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".doc,.docx,.pdf"
            disabled={isSubmitting}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFile(event.target.files?.[0] ?? null);
            }}
          />
          <div className="flex w-full overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) transition-colors focus-within:border-(--color-accent) focus-within:ring-2 focus-within:ring-(--color-ring)">
            <Input
              type="text"
              readOnly
              tabIndex={-1}
              value={file?.name ?? ""}
              placeholder="No file selected"
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-(--color-text-muted) outline-none ring-0 focus:ring-0"
            />
            <button
              type="button"
              aria-label="Select file"
              disabled={isSubmitting}
              className="inline-flex shrink-0 items-center justify-center border-l border-(--color-border) bg-(--color-surface) px-3 text-(--color-text-muted) transition-colors hover:bg-(--color-border) hover:text-(--color-text) disabled:pointer-events-none disabled:opacity-50"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <FileStack size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
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
            disabled={isSubmitting || !file}
          >
            Upload
          </Button>
        </div>
      </Field>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
