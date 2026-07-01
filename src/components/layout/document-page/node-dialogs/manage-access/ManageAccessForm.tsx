import type {
  AccessType,
  PoliticGroupEntity,
  PoliticGroupResponse,
} from "@/api/model/politicGroup/politic-group-entity";
import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import type { UpdateGroupAccesses } from "@/api/modelApi/pilitic-api";
import {
  useLazyGetGroupWithAccessedForNodeQuery,
  useLazyGetPoliticGroupsQuery,
} from "@/api/modelApi/pilitic-api";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SubmitEventHandler,
} from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/Button";

import type { ManageAccessForNodeParams } from "../use-node-context-menu";

const ACCESS_TYPES: AccessType[] = ["READ", "WRITE", "DELETE", "ADMIN"];
const DEFAULT_ACCESSES: AccessType[] = ["READ"];

function toSubmitPayload(draft: PoliticGroupResponse[]): UpdateGroupAccesses[] {
  return draft.map(({ group, accesses }) => ({
    groupId: group.id,
    accesses,
  }));
}

type ManageAccessFormProps = {
  readonly manageNode: TreeNodeEntity;
  readonly onClose: () => void;
  readonly onSubmit: (
    params: ManageAccessForNodeParams
  ) => void | Promise<void>;
  readonly isSubmitting: boolean;
  readonly error: string | null;
};

function GroupAccessRow({
  groupAccess,
  onAccessChange,
  onRemove,
  disabled,
}: {
  readonly groupAccess: PoliticGroupResponse;
  readonly onAccessChange: (access: AccessType, checked: boolean) => void;
  readonly onRemove: () => void;
  readonly disabled: boolean;
}) {
  return (
    <li className="rounded-lg border border-(--color-border) bg-(--color-surface) px-2 py-2">
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-(--color-text)">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Users size={16} className="shrink-0" aria-hidden="true" />
          <p className="truncate">{groupAccess.group.name}</p>
        </div>
        <button
          type="button"
          className="shrink-0 text-red-500 hover:text-red-300 disabled:opacity-50"
          disabled={disabled}
          onClick={onRemove}
        >
          Удалить
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {ACCESS_TYPES.map((access) => (
          <label
            key={access}
            className="flex items-center gap-1.5 text-xs text-(--color-text)"
          >
            <input
              type="checkbox"
              checked={groupAccess.accesses.includes(access)}
              disabled={disabled}
              onChange={(event) => {
                onAccessChange(access, event.target.checked);
              }}
              className="rounded border-(--color-border)"
            />
            {access}
          </label>
        ))}
      </div>
    </li>
  );
}

export function ManageAccessForm({
  manageNode,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: ManageAccessFormProps) {
  // Get group + accesses for node by ID
  const [fetchLinkedGroups, linkedGroupsQuery] =
    useLazyGetGroupWithAccessedForNodeQuery();

  // Get groups for adding to node
  const [fetchAllGroups, allGroupsQuery] = useLazyGetPoliticGroupsQuery();

  const [draftGroupAccesses, setDraftGroupAccesses] = useState<
    PoliticGroupResponse[]
  >([]);
  const hasHydratedDraftRef = useRef(false);

  // Загрузка с сервера только при открытии формы
  useEffect(() => {
    hasHydratedDraftRef.current = false;
    setDraftGroupAccesses([]);

    void fetchLinkedGroups({ nodeId: manageNode.id }, false);
    void fetchAllGroups({ limit: 100, page: 1 });
  }, [manageNode.id, fetchLinkedGroups, fetchAllGroups]);

  // Инициализация черновика после завершения актуального GET-запроса
  useEffect(() => {
    if (hasHydratedDraftRef.current) return;
    if (linkedGroupsQuery.isFetching || !linkedGroupsQuery.isSuccess) return;
    if (!linkedGroupsQuery.data) return;

    setDraftGroupAccesses(linkedGroupsQuery.data);
    hasHydratedDraftRef.current = true;
  }, [
    linkedGroupsQuery.data,
    linkedGroupsQuery.isFetching,
    linkedGroupsQuery.isSuccess,
  ]);

  const assignedGroupIds = useMemo(
    () => new Set(draftGroupAccesses.map((item) => item.group.id)),
    [draftGroupAccesses]
  );

  const allGroupItems = allGroupsQuery.data?.items ?? [];

  const availableGroups = useMemo(
    () => allGroupItems.filter((group) => !assignedGroupIds.has(group.id)),
    [allGroupItems, assignedGroupIds]
  );

  // Итоговый объект для отправки — формируется локально, без запросов
  const submitPayload = useMemo(
    () => toSubmitPayload(draftGroupAccesses),
    [draftGroupAccesses]
  );

  const handleAccessChange = (
    groupId: string,
    access: AccessType,
    checked: boolean
  ) => {
    setDraftGroupAccesses((prev) => {
      console.log("123");

      const next = prev.map((item) => {
        if (item.group.id !== groupId) return item;

        const accesses = checked
          ? [...new Set([...item.accesses, access])]
          : item.accesses.filter((value) => value !== access);

        return { ...item, accesses };
      });

      return next;
    });
  };

  const handleAddGroup = (group: PoliticGroupEntity) => {
    setDraftGroupAccesses((prev) => [
      ...prev,
      { group, accesses: [...DEFAULT_ACCESSES] },
    ]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setDraftGroupAccesses((prev) =>
      prev.filter((item) => item.group.id !== groupId)
    );
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void onSubmit({
      manageNode,
      groupAccesses: submitPayload,
    });
  };

  const isLoading =
    linkedGroupsQuery.isLoading ||
    linkedGroupsQuery.isFetching ||
    allGroupsQuery.isLoading ||
    allGroupsQuery.isFetching;
  const loadError = linkedGroupsQuery.isError || allGroupsQuery.isError;

  return (
    <form className="flex max-h-[70vh] flex-col gap-4" onSubmit={handleSubmit}>
      <p className="text-xs text-(--color-text-muted)">
        Node:{" "}
        <span className="font-medium text-(--color-text)">
          {manageNode.name}
        </span>
      </p>

      <section className="flex min-h-0 flex-col gap-2">
        <h3 className="text-sm font-medium text-(--color-text)">
          Assigned groups
        </h3>
        {isLoading ? (
          <p className="text-sm text-(--color-text-muted)">Loading groups...</p>
        ) : loadError ? (
          <p className="text-sm text-red-400" role="alert">
            Failed to load groups
          </p>
        ) : draftGroupAccesses.length === 0 ? (
          <p className="text-sm text-(--color-text-muted)">
            No groups assigned to this node.
          </p>
        ) : (
          <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {draftGroupAccesses.map((groupAccess) => (
              <GroupAccessRow
                key={groupAccess.group.id}
                groupAccess={groupAccess}
                disabled={isSubmitting}
                onAccessChange={(access, checked) => {
                  handleAccessChange(groupAccess.group.id, access, checked);
                }}
                onRemove={() => {
                  handleRemoveGroup(groupAccess.group.id);
                }}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="flex min-h-0 flex-col gap-2">
        <h3 className="text-sm font-medium text-(--color-text)">
          Available groups
        </h3>
        {isLoading ? (
          <p className="text-sm text-(--color-text-muted)">Loading groups...</p>
        ) : loadError ? null : availableGroups.length === 0 ? (
          <p className="text-sm text-(--color-text-muted)">
            All groups are already assigned.
          </p>
        ) : (
          <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg border border-(--color-border)">
            {availableGroups.map((group) => (
              <li
                key={group.id}
                className="flex items-center justify-between border-b border-(--color-border) px-3 py-2 text-sm text-(--color-text) last:border-b-0"
              >
                <span>{group.name}</span>
                <button
                  type="button"
                  className="text-xs text-(--color-accent) hover:underline disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={() => {
                    handleAddGroup(group);
                  }}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

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
          disabled={isSubmitting || isLoading}
        >
          Update
        </Button>
      </div>
    </form>
  );
}
