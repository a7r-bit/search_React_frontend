import { useState, type ChangeEvent, type ComponentProps } from "react";
import { useNavigate } from "react-router";

import { useSignInMutation } from "@/api/modelApi/auth-api";
import { appRoutePaths } from "@/routes/paths";

import { Button } from "../ui/Button";
import { Label } from "../ui/Label";

type LoginFormState = {
  readonly username: string;
  readonly password: string;
};

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

const INITIAL_FORM_STATE: LoginFormState = {
  username: "",
  password: "",
};

export function LoginForm() {
  const navigate = useNavigate();
  const [formState, setFormState] =
    useState<LoginFormState>(INITIAL_FORM_STATE);
  const [signIn, { error, isLoading }] = useSignInMutation();

  const handleFieldChange =
    (field: keyof LoginFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setFormState((currentFormState) => ({
        ...currentFormState,
        [field]: value,
      }));
    };

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await signIn(formState).unwrap();
      navigate(appRoutePaths.home);
    } catch {
      // Error state is surfaced by RTK Query and rendered below the form.
    }
  };

  return (
    <form
      className="flex w-full max-w-sm flex-col items-start justify-start gap-4 p-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-normal text-(--color-text)">Welcome back</h2>
      <p className="text-sm font-light text-(--color-text)">
        Please enter your username and password to sign in.
      </p>

      <Label htmlFor="username" label="Username" required>
        <input
          type="text"
          id="username"
          name="username"
          required
          autoComplete="username"
          value={formState.username}
          onChange={handleFieldChange("username")}
          placeholder="Enter your username"
          className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) outline-none transition-colors focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-ring)"
        />
      </Label>

      <Label htmlFor="password" label="Password" required>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          value={formState.password}
          onChange={handleFieldChange("password")}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) outline-none transition-colors focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-ring)"
        />
      </Label>

      {error ? (
        <p className="text-sm text-red-500" role="alert">
          {error?.message}
        </p>
      ) : null}

      <Button
        variant="primary"
        className="w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
