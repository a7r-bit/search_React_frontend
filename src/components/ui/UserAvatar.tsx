import type { AuthUser } from "@/api/model";

type UserAvatarProps = {
  readonly user: AuthUser;
};

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-(--color-accent-soft) text-(--color-text)">
      {user.firstName.charAt(0) + user.middleName.charAt(0)}
    </div>
  );
}
