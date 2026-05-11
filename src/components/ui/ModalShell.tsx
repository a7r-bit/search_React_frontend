import type { ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export type ModalShellProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
};

export function ModalShell({ open, onClose, title, children }: ModalShellProps) {
  return (
    <Dialog open={open} onClose={() => onClose()} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-lg border border-(--color-border) bg-(--color-surface) p-4 shadow-lg">
          <DialogTitle className="mb-3 text-sm font-medium text-(--color-text)">
            {title}
          </DialogTitle>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
