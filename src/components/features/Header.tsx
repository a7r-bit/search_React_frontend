import { useTheme } from "@/hooks/use-theme";
import { Button } from "../ui/Button";
import { WrapIcon } from "../ui/WrapIcon";
import { useAppSelector } from "@/hooks/redux";
import { selectCurrentUser } from "@/store/auth/auth-selectors";
import { UserAvatar } from "../ui/UserAvatar";
import { useSwitchRoleMutation } from "@/api/modelApi/auth-api";
import { UserMenu } from "./header/UserMenu";
import { SearchField } from "./header/SearchField";
import { usePageSearchContext } from "@/hooks/use-page-search";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { config, query, setQuery } = usePageSearchContext();
  const user = useAppSelector(selectCurrentUser);

  const [switchRole] = useSwitchRoleMutation();
  const handleRoleChange = async (role: string) => {
    if (!user || role === user.activeRole) return;
    try {
      await switchRole({ requireRole: role }).unwrap();
      window.location.reload();
    } catch (error) {}
  };

  return (
    <header className="flex flex-row justify-between items-center h-14  ">
      <h1 className="ml-2 text-md font-medium text-(--color-text)">
        {config?.title ?? "All files"}
      </h1>
      <div className="flex flex-row gap-2 items-center mx-2">
        {config && !config.hidden ? (
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={config.placeholder}
          />
        ) : null}
        <Button size="md" variant="ghost" onClick={toggleTheme}>
          <WrapIcon icon={theme === "light" ? "Moon" : "Sun"} size={18} />
        </Button>
        <div className="flex flex-row items-center gap-2">
          {user && (
            <>
              <UserAvatar user={user} />
              <UserMenu user={user} handleOnChangeRole={handleRoleChange} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
