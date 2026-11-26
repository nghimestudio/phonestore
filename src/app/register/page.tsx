import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <p className="font-display text-6xl font-extrabold leading-none text-[var(--ink)]">
          PhoneStore
        </p>
        <p className="mt-5 max-w-sm text-lg text-[var(--muted)]">
          Create an account to save carts, place orders, and track shipments.
        </p>
      </div>

      <div className="border border-[var(--line)] bg-white p-7 sm:p-9">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
          Create account
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Join PhoneStore in under a minute.
        </p>
        <div className="mt-7">
          <AuthForm action={registerAction} mode="register" />
        </div>
        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
