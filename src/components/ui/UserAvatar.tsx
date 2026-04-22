import type { AuthUser } from "@/api/model";

type UserAvatarProps = {
  readonly user: AuthUser;
};

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="aspect-auto rounded-full p-1.5 border bg-(--color-accent-soft) text-(--color-text)">
      {user.firstName.charAt(0) + user.middleName.charAt(0)}
    </div>
  );
}
