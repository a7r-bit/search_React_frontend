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
import { Search, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";

import type { ManageAccessForNodeParams } from "../use-node-context-menu";

const ACCESS_TYPES: AccessType[] = ["READ", "WRITE", "DELETE", "ADMIN"];
const DEFAULT_ACCESSES: AccessType[] = ["READ"];
const EMPTY_GROUP_ACCESSES: PoliticGroupResponse[] = [];
const GROUPS_PAGE_LIMIT = 20;

function getNextAccesses(
  accesses: AccessType[],
  access: AccessType,
  checked: boolean
): AccessType[] {
  if (!checked) {
    return accesses.filter((value) => value !== access);
  }

  return accesses.includes(access) ? accesses : [...accesses, access];
}

function toSubmitPayload(
  draft: PoliticGroupResponse[],
  initial: PoliticGroupResponse[]
): UpdateGroupAccesses[] {
  const draftGroupIds = new Set(draft.map(({ group }) => group.id));
  const currentGroupAccesses = draft.map(({ group, accesses }) => ({
    groupId: group.id,
    accesses,
  }));
  const removedGroupAccesses = initial
    .filter(({ group }) => !draftGroupIds.has(group.id))
    .map(({ group }) => ({
      groupId: group.id,
      accesses: [],
    }));

  return [...currentGroupAccesses, ...removedGroupAccesses];
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

type GroupAccessRowProps = {
  readonly groupAccess: PoliticGroupResponse;
  readonly onAccessChange: (access: AccessType, checked: boolean) => void;
  readonly onRemove: () => void;
  readonly disabled: boolean;
};

function GroupAccessRow({
  groupAccess,
  onAccessChange,
  onRemove,
  disabled,
}: GroupAccessRowProps) {
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

type AvailableGroupListProps = {
  readonly groups: PoliticGroupEntity[];
  readonly onAddGroup: (group: PoliticGroupEntity) => void;
  readonly disabled: boolean;
};

function AvailableGroupList({
  groups,
  onAddGroup,
  disabled,
}: AvailableGroupListProps) {
  return (
    <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg border border-(--color-border)">
      {groups.map((group) => (
        <li
          key={group.id}
          className="flex items-center justify-between border-b border-(--color-border) px-3 py-2 text-sm text-(--color-text) last:border-b-0"
        >
          <span>{group.name}</span>
          <button
            type="button"
            className="text-xs text-(--color-accent) hover:underline disabled:opacity-50"
            disabled={disabled}
            onClick={() => {
              onAddGroup(group);
            }}
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  );
}

type AvailableGroupsPaginationProps = {
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly disabled: boolean;
};

function AvailableGroupsPagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: AvailableGroupsPaginationProps) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2 text-xs text-(--color-text-muted)">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled || page <= 1}
        onClick={() => {
          onPageChange(page - 1);
        }}
      >
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled || page >= totalPages}
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        Next
      </Button>
    </div>
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

  const [searchQuery, setSearchQuery] = useState("");
  const [availableGroupsPage, setAvailableGroupsPage] = useState(1);
  const [draftGroupAccesses, setDraftGroupAccesses] = useState<
    PoliticGroupResponse[]
  >([]);
  const hasHydratedDraftRef = useRef(false);

  function fetchAvailableGroups(page: number, search = searchQuery) {
    void fetchAllGroups({
      limit: GROUPS_PAGE_LIMIT,
      page,
      search: search || undefined,
    });
  }

  // Загрузка с сервера только при открытии формы
  useEffect(() => {
    hasHydratedDraftRef.current = false;
    setSearchQuery("");
    setAvailableGroupsPage(1);
    setDraftGroupAccesses([]);

    void fetchLinkedGroups({ nodeId: manageNode.id }, false);
    void fetchAllGroups({ limit: GROUPS_PAGE_LIMIT, page: 1 });
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
  const totalAvailableGroups = allGroupsQuery.data?.total ?? 0;
  const availableGroupsLimit = allGroupsQuery.data?.limit ?? GROUPS_PAGE_LIMIT;
  const availableGroupsTotalPages = Math.max(
    1,
    Math.ceil(totalAvailableGroups / availableGroupsLimit)
  );

  const availableGroups = useMemo(
    () => allGroupItems.filter((group) => !assignedGroupIds.has(group.id)),
    [allGroupItems, assignedGroupIds]
  );

  const initialGroupAccesses = linkedGroupsQuery.data ?? EMPTY_GROUP_ACCESSES;

  const submitPayload = useMemo(
    () => toSubmitPayload(draftGroupAccesses, initialGroupAccesses),
    [draftGroupAccesses, initialGroupAccesses]
  );

  const handleAccessChange = (
    groupId: string,
    access: AccessType,
    checked: boolean
  ) => {
    setDraftGroupAccesses((prev) =>
      prev.map((item) => {
        if (item.group.id !== groupId) return item;

        return {
          ...item,
          accesses: getNextAccesses(item.accesses, access, checked),
        };
      })
    );
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

  const handleSearchChange = (value: string) => {
    const nextPage = 1;

    setSearchQuery(value);
    setAvailableGroupsPage(nextPage);
    fetchAvailableGroups(nextPage, value);
  };

  const handleAvailableGroupsPageChange = (page: number) => {
    setAvailableGroupsPage(page);
    fetchAvailableGroups(page);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void onSubmit({
      manageNode,
      groupAccesses: submitPayload,
    });
  };

  const isAssignedGroupsLoading =
    linkedGroupsQuery.isLoading || linkedGroupsQuery.isFetching;
  const isAvailableGroupsInitialLoading =
    allGroupsQuery.isLoading && !allGroupsQuery.data;
  const hasAvailableGroupsError = allGroupsQuery.isError;
  const isAvailableGroupsFetching = allGroupsQuery.isFetching;
  const isInitialLoading =
    isAssignedGroupsLoading || isAvailableGroupsInitialLoading;

  const assignedGroupsContent = (() => {
    if (isAssignedGroupsLoading) {
      return (
        <p className="text-sm text-(--color-text-muted)">Loading groups...</p>
      );
    }

    if (linkedGroupsQuery.isError) {
      return (
        <p className="text-sm text-red-400" role="alert">
          Failed to load groups
        </p>
      );
    }

    if (draftGroupAccesses.length === 0) {
      return (
        <p className="text-sm text-(--color-text-muted)">
          No groups assigned to this node.
        </p>
      );
    }

    return (
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
    );
  })();

  const availableGroupsContent = (() => {
    if (isAvailableGroupsInitialLoading) {
      return (
        <p className="text-sm text-(--color-text-muted)">Loading groups...</p>
      );
    }

    if (hasAvailableGroupsError) {
      return null;
    }

    return (
      <div>
        <div className="mb-2 flex min-w-[20rem] items-center gap-3 rounded-md border border-(--color-border) bg-(--color-surface) px-2 py-1">
          <Search
            size={16}
            className="shrink-0 text-(--color-text-muted)"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            placeholder="Search groups..."
            onChange={(event) => {
              handleSearchChange(event.target.value);
            }}
            className="min-w-0 flex-1 bg-transparent p-0.5 text-sm text-(--color-text) outline-none placeholder:text-(--color-text-muted) disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        {availableGroups.length === 0 ? (
          <p className="text-sm text-(--color-text-muted)">
            No available groups found.
          </p>
        ) : (
          <AvailableGroupList
            groups={availableGroups}
            disabled={isSubmitting}
            onAddGroup={handleAddGroup}
          />
        )}
        <AvailableGroupsPagination
          page={availableGroupsPage}
          totalPages={availableGroupsTotalPages}
          disabled={isSubmitting || isAvailableGroupsFetching}
          onPageChange={handleAvailableGroupsPageChange}
        />
      </div>
    );
  })();

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
        {assignedGroupsContent}
      </section>

      <section className="flex min-h-0 flex-col gap-2">
        <h3 className="text-sm font-medium text-(--color-text)">
          Available groups
        </h3>
        {availableGroupsContent}
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
          disabled={isSubmitting || isInitialLoading}
        >
          Update
        </Button>
      </div>
    </form>
  );
}
