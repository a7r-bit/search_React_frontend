import { useLazyGetFileQuery } from "@/api/modelApi/s3-api";
import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import { useEffect, useState } from "react";

import {
  getPreviewStatusMessage,
  previewFromSelectedNode,
} from "../preview-helper";

export function useDocumentPreview(
  selectedNode: TreeNodeEntity | undefined,
  overrideFileRef: string | null = null
) {
  const [getFile, { isFetching: isPreviewUrlLoading }] = useLazyGetFileQuery();
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const preview = previewFromSelectedNode(selectedNode);

  const previewStatusMessage = overrideFileRef
    ? null
    : getPreviewStatusMessage(preview);
  const previewFileRef = (
    overrideFileRef ?? (preview.status === "ready" ? preview.fileUrl : null)
  )?.trim();

  useEffect(() => {
    let isCurrent = true;

    setPreviewFileUrl(null);
    setPreviewError(null);

    if (!previewFileRef) {
      if (preview.status !== "ready") {
        return;
      }
      setPreviewError("У документа нет ссылки на файл");
      return;
    }

    console.log("[useDocumentPreview] resolved fileRef:", previewFileRef);

    if (
      previewFileRef.startsWith("http://") ||
      previewFileRef.startsWith("https://")
    ) {
      console.log("[useDocumentPreview] use direct url for preview");
      setPreviewFileUrl(previewFileRef);
      return;
    }

    console.log(
      "[useDocumentPreview] request signed url by key:",
      previewFileRef
    );
    getFile({ key: previewFileRef })
      .unwrap()
      .then((file) => {
        if (isCurrent) {
          console.log("[useDocumentPreview] signed url received:", file.url);
          setPreviewFileUrl(file.url);
        }
      })
      .catch(() => {
        if (isCurrent) {
          console.error("[useDocumentPreview] failed to get file url");
          setPreviewError("Не удалось получить ссылку на файл");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [getFile, preview.status, previewFileRef]);

  return {
    preview,
    previewFileUrl,
    previewError,
    previewStatusMessage,
    isPreviewUrlLoading,
  };
}
