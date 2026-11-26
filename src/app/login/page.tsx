import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth-form";

type SearchParams = Promise<{ callbackUrl?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <p className="font-display text-6xl font-extrabold leading-none text-[var(--ink)]">
          PhoneStore
        </p>
        <p className="mt-5 max-w-sm text-lg text-[var(--muted)]">
          Sign in to sync your cart, track deliveries, and manage orders.
        </p>
      </div>

      <div className="border border-[var(--line)] bg-white p-7 sm:p-9">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Log in to manage your cart and orders.
        </p>
        <div className="mt-7">
          <AuthForm
            action={loginAction}
            mode="login"
            callbackUrl={params.callbackUrl}
          />
        </div>
        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          No account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Sign up
          </Link>
        </p>
        <p className="mt-5 border border-[var(--line)] bg-[var(--paper)] p-3 text-xs leading-relaxed text-[var(--muted)]">
          Demo: customer@phonestore.com / customer123 · admin@phonestore.com /
          admin123
        </p>
      </div>
    </div>
  );
}
