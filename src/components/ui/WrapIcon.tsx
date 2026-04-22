import * as LucideIcons from "lucide-react";
import { CircleHelp, type LucideIcon, type LucideProps } from "lucide-react";

type WrapIconProps = LucideProps & {
  readonly icon: keyof typeof LucideIcons;
  readonly label?: string;
};

export function WrapIcon({ icon, label, ...iconProps }: WrapIconProps) {
  const Icon = (LucideIcons[icon] as LucideIcon | undefined) ?? CircleHelp;

  return <Icon aria-label={label} {...iconProps} />;
}
