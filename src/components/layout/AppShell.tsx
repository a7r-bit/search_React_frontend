import {
  cloneElement,
  isValidElement,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Header } from "../features/Header";

type AppShellProps = PropsWithChildren<{
  sidebar: ReactElement<{ collapsed?: boolean }>;
}>;

export function AppShell({ sidebar, children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarNode = isValidElement<{ collapsed?: boolean }>(sidebar)
    ? cloneElement(sidebar, { collapsed: isSidebarCollapsed })
    : sidebar;

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg) p-1 text-(--color-text)">
      <aside
        className={`relative flex h-full shrink-0   bg-(--color-surface) rounded-xl transition-[width] duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-52"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
          className="absolute bottom-4 -right-4 z-10 grid size-8 place-items-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-muted) shadow-sm transition-colors hover:bg-(--color-surface-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          aria-pressed={isSidebarCollapsed}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={16} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={16} aria-hidden="true" />
          )}
        </button>

        <section className="min-h-0 flex-1 overflow-visible">
          {sidebarNode}
        </section>
      </aside>
      <main className="flex min-w-0 flex-1 min-h-0 flex-col p-2">
        <Header />
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
