import type { DocumentVersionEntity } from "@/api/model/documentVersion/document-version-entity";
import { formatDate } from "@/utils/dateFormatter";

type DocumentVersionCardProps = {
  version: DocumentVersionEntity;
  isSelected: boolean;
  onOpenVersion: (documentVersion: DocumentVersionEntity) => void;
};

const statusLabel: Record<DocumentVersionEntity["conversionStatus"], string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  FAILED: "Failed",
};
const statusClass: Record<DocumentVersionEntity["conversionStatus"], string> = {
  PENDING: "bg-yellow-200 p-0.5 rounded-sm text-xs text-yellow-800 font-medium",
  IN_PROGRESS: "bg-blue-200 p-1 rounded-sm text-xs text-blue-800 font-medium",
  DONE: "bg-green-200 p-1 rounded-sm text-xs text-green-800 font-medium",
  FAILED: "bg-red-200 p-1 rounded-sm text-xs text-red-800 font-medium",
};

export function DocumentVersionCard({
  version,
  isSelected,
  onOpenVersion,
}: DocumentVersionCardProps) {
  return (
    <li key={version.id}>
      <div
        className={`flex flex-col gap-0.5 p-2 rounded-md bg-(--color-surface-muted) text-(--color-text) font-normal
        ${isSelected ? "border border-(--color-accent)" : "border border-(--color-border)"}
        `}
      >
        <div className="flex gap-1 items-center">
          <span className="text-sm font-medium">v{version.verison}</span>
          <span className={statusClass[version.conversionStatus]}>
            {statusLabel[version.conversionStatus]}
          </span>
        </div>
        <p
          className="text-sm font-medium text-(--color-text) hover:underline cursor-pointer"
          onClick={() => onOpenVersion(version)}
        >
          {version.fileName}
        </p>
        <p className="text-xs text-(--color-text-muted">
          {formatDate(version.createdAt)}
        </p>
      </div>
    </li>
  );
}
