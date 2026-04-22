import { BellIcon, PlusIcon, Search } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "../ui/Button";
import { WrapIcon } from "../ui/WrapIcon";
import { useAppSelector } from "@/hooks/redux";
import { selectCurrentUser } from "@/store/auth/auth-selectors";
import { UserAvatar } from "../ui/UserAvatar";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const user = useAppSelector(selectCurrentUser);
  return (
    <header className="flex flex-row justify-between items-center h-14  ">
      <h1 className="ml-2 text-md font-medium text-(--color-text)">
        All files
      </h1>
      <div className="flex flex-row gap-2 items-center mx-2">
        <Button>
          <PlusIcon />
          New file
        </Button>
        <Button size="md" variant="ghost" onClick={toggleTheme}>
          <WrapIcon icon={theme === "light" ? "Moon" : "Sun"} size={18} />
        </Button>
        <div className="flex min-w-[20rem] items-center gap-3 rounded-md border border-(--color-border) bg-(--color-surface) px-2 py-1">
          <Search
            size={16}
            className="shrink-0 text-(--color-text-muted)"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="min-w-0 flex-1 bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-text-muted)"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 rounded-md border-(--color-border) bg-(--color-surface-muted) px-2 text-xs text-(--color-text-muted) hover:bg-(--color-surface-muted)"
          >
            Ctrl+K
          </Button>
        </div>
        {user && <UserAvatar user={user} />}
      </div>
    </header>
  );
}
