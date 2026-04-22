import {
  FileSearchCorner,
  HomeIcon,
  Settings2Icon,
  FolderKanbanIcon,
  ChartAreaIcon,
  Vault,
  GaugeIcon,
  LogOut,
} from "lucide-react";

import {
  SideBarItem,
  type SideBarItemProps,
} from "@/components/ui/SideBarItem";
import { appRoutePaths } from "@/routes/paths";
import { useSignOutMutation } from "@/api/auth-api";
import { useNavigate } from "react-router";
type SideBarProps = {
  readonly collapsed?: boolean;
};

type SideBarEntry = {
  readonly to: string;
  readonly label: string;
  readonly icon?: SideBarItemProps["icon"];
  readonly disabled?: boolean;
};

const items: readonly SideBarEntry[] = [
  {
    to: appRoutePaths.home,
    label: "Home",
    icon: HomeIcon,
  },
  {
    to: appRoutePaths.dashboard,
    label: "Dashboard",
    icon: GaugeIcon,
  },
  {
    to: appRoutePaths.projects,
    label: "Projects",
    icon: FolderKanbanIcon,
  },
  {
    to: appRoutePaths.analytics,
    label: "Analytics",
    icon: ChartAreaIcon,
  },
  {
    to: appRoutePaths.settings,
    label: "Settings",
    icon: Settings2Icon,
  },
  {
    to: appRoutePaths.archive,
    label: "Archive",
    icon: Vault,
  },
];

export function SideBar({ collapsed = false }: SideBarProps) {
  const navigate = useNavigate();
  const [signOut, { isLoading }] = useSignOutMutation();
  const handleLogout = () => {
    signOut()
      .unwrap()
      .then(() => {
        navigate(appRoutePaths.login);
      })
      .catch(() => {
        // Error state is surfaced by RTK Query and rendered below the form.
      });
  };

  return (
    <nav
      className={`relative flex h-full flex-col gap-2 overflow-y-auto overflow-x-visible p-2 ${collapsed ? "items-center" : ""}`}
      aria-label="Primary sidebar navigation"
    >
      <div
        className={`flex w-full items-end gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-3 ${
          collapsed ? "justify-center px-0" : "justify-start"
        }`}
      >
        <FileSearchCorner
          className="shrink-0 text-(--color-accent)"
          size={28}
          aria-hidden="true"
        />
        {collapsed ? null : <p className="mb-0 text-lg font-bold">Search</p>}
      </div>
      {items.map((item) => (
        <SideBarItem
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          collapsed={collapsed}
          disabled={item.disabled}
        />
      ))}
      <div className="mt-auto w-full">
        <SideBarItem
          label="Logout"
          icon={LogOut}
          collapsed={collapsed}
          disabled={isLoading}
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
}
