"use client";

import { useActionState } from "react";
import type { ActionState } from "@/actions/auth";
import { Alert, Button, Input, Label } from "@/components/ui";

export function AuthForm({
  action,
  mode,
  callbackUrl,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  mode: "login" | "register";
  callbackUrl?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" ? (
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </div>
      ) : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="••••••••"
        />
      </div>
      {callbackUrl ? (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      ) : null}
      {state.error ? <Alert>{state.error}</Alert> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? "Please wait..."
          : mode === "login"
            ? "Log in"
            : "Create account"}
      </Button>
    </form>
  );
}
