import type { TreeDocumentEntity, TreeNodeEntity } from "@/api/model";

/** Ветка `ready` отдельна, иначе `status === "ready"` не сужает union. */
export type PreviewModel =
  | { status: "empty" }
  | { status: "directory"; message: string }
  | { status: "file_no_document"; message: string }
  | { status: "converting"; message: string }
  | { status: "conversion_failed"; message: string }
  | { status: "ready"; fileUrl: string; document: TreeDocumentEntity };

export function previewFromSelectedNode(
  node: TreeNodeEntity | undefined,
): PreviewModel {
  if (!node) return { status: "empty" };
  if (node.kind === "directory")
    return { status: "directory", message: "Выберите файл для просмотра" };

  if (!node.document) {
    return {
      status: "file_no_document",
      message: "Файл не содержит документ",
    };
  }
  const {
    conversionStatus,
    fileUrl,
  }: {
    conversionStatus: TreeDocumentEntity["conversionStatus"];
    fileUrl: TreeDocumentEntity["fileUrl"];
  } = node.document;
  if (conversionStatus === "PENDING" || conversionStatus === "IN_PROGRESS") {
    return { status: "converting", message: "Идёт подготовка превью…" };
  }
  if (conversionStatus === "FAILED") {
    return {
      status: "conversion_failed",
      message: "Не удалось подготовить документ",
    };
  }
  return {
    status: "ready",
    fileUrl,
    document: node.document,
  };
}

export function getPreviewStatusMessage(preview: PreviewModel): string | null {
  if (preview.status === "ready") return null;
  if (preview.status === "empty") return "Документ не выбран";

  return preview.message;
}
