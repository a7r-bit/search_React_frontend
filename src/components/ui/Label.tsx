import type { ReactNode } from 'react';

type LabelProps = {
  readonly label: string;
  readonly htmlFor: string;
  readonly required?: boolean;
  readonly children: ReactNode;
};

export function Label({
  label,
  htmlFor,
  required = false,
  children,
}: LabelProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-normal text-(--color-text)"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-red-400">
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
