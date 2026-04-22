import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

export type SideBarItemProps = {
  readonly label: string;
  readonly to?: string;
  readonly icon?: LucideIcon;
  readonly collapsed?: boolean;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
};

export function SideBarItem({
  label,
  to,
  icon,
  collapsed = false,
  disabled = false,
  onClick,
}: SideBarItemProps) {
  const Icon = icon;

  const baseClassName = `flex w-full items-center justify-between rounded-lg px-2 py-1 text-left transition-colors duration-200 ${
    collapsed ? "h-11 justify-center px-0" : ""
  } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)`;

  if (disabled) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={collapsed ? label : undefined}
        title={collapsed ? label : undefined}
        className={`${baseClassName} bg-(--color-surface) text-(--color-text)`}
      >
        <span
          className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}
        >
          {Icon ? (
            <span className="grid place-items-center text-(--color-text-muted)">
              <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
          ) : null}
          {collapsed ? null : (
            <span className="text-sm font-normal">{label}</span>
          )}
        </span>
      </button>
    );
  }

  if (!to) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={collapsed ? label : undefined}
        title={collapsed ? label : undefined}
        className={`${baseClassName} border-none bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-muted)`}
      >
        <span
          className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}
        >
          {Icon ? (
            <span className="grid place-items-center text-(--color-text-muted)">
              <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
          ) : null}
          {collapsed ? null : (
            <span className="text-sm font-normal">{label}</span>
          )}
        </span>{" "}
      </button>
    );
  }
  return (
    <NavLink
      to={to}
      onClick={onClick}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `${baseClassName} ${
          isActive
            ? "border-(--color-accent) bg-(--color-accent-soft) text-(--color-text)"
            : "border-none bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-muted)"
        }`
      }
    >
      <span
        className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}
      >
        {Icon ? (
          <span className="grid place-items-center text-(--color-text-muted)">
            <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
          </span>
        ) : null}
        {collapsed ? null : (
          <span className="text-sm font-normal">{label}</span>
        )}
      </span>
    </NavLink>
  );
}
