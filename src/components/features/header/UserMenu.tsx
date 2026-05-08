import type { AuthUser } from "@/api/model";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Link } from "react-router";

type UserMenuProps = {
  readonly user: AuthUser;
  readonly handleOnChangeRole: (role: string) => void;
};

export function UserMenu({ user, handleOnChangeRole }: UserMenuProps) {
  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton>
        <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom"
        className="w-56 rounded-md border border-(--color-border) bg-(--color-surface) p-1 shadow-lg"
      >
        <MenuItem
          as={Link}
          to="/profile"
          className="block rounded px-2 py-1.5 text-sm text-(--color-text) data-focus:bg-(--color-surface-muted)"
        >
          Profile
        </MenuItem>
        <div className="my-1 border-t border-(--color-border)" />
        <div className="px-2 pb-1 pt-0.5 text-xs text-(--color-text-muted)">
          Roles
        </div>
        {user.roles.map((role) => (
          <MenuItem
            key={role}
            as="button"
            type="button"
            onClick={() => handleOnChangeRole(role)}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm text-(--color-text) data-focus:bg-(--color-surface-muted)"
          >
            <span>{role}</span>
            {user.activeRole === role ? (
              <Check className="h-4 w-4 text-(--color-accent)" />
            ) : null}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
