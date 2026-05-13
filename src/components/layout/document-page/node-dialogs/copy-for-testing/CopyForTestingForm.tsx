import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { Field, Input, Label } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

type CopyForTestingFormProps = {
  readonly copyNode: TreeNodeEntity;
  readonly onClose: () => void;
};

function versionIdFromNode(node: TreeNodeEntity): string {
  return node.document?.latestVersionId?.trim() ?? "";
}

export function CopyForTestingForm({
  copyNode,
  onClose,
}: CopyForTestingFormProps) {
  const versionId = versionIdFromNode(copyNode);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    setCopyError(null);
  }, [copyNode.id]);

  const handleCopy = useCallback(async () => {
    setCopyError(null);
    if (!versionId) {
      setCopyError("No document version id for this item");
      return;
    }
    if (!navigator.clipboard?.writeText) {
      setCopyError("Clipboard is not available in this context");
      return;
    }
    try {
      await navigator.clipboard.writeText(versionId);
      onClose();
    } catch {
      setCopyError("Could not copy to clipboard");
    }
  }, [onClose, versionId]);

  return (
    <form className="flex flex-col gap-3">
      <Field className="w-full">
        <div className="flex items-center gap-2">
          <Input
            id="copy-for-testing-version-id"
            type="text"
            name="versionId"
            value={versionId}
            readOnly
            aria-readonly="true"
            autoComplete="off"
            className="w-full rounded-lg border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none"
          />
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!versionId}
            onClick={() => {
              void handleCopy();
            }}
          >
            Copy
          </Button>
        </div>
      </Field>
      {copyError ? (
        <p className="text-sm text-red-400" role="alert">
          {copyError}
        </p>
      ) : null}
    </form>
  );
}
