import Link from "next/link";
import { auth } from "@/auth";
import { getCartCount } from "@/actions/cart";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui";

export async function Navbar() {
  const session = await auth();
  const cartCount = session?.user?.id
    ? await getCartCount(session.user.id)
    : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--ink)]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-white transition hover:opacity-90"
        >
          PhoneStore
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 md:flex">
          <Link href="/products" className="transition hover:text-white">
            Phones
          </Link>
          {session?.user ? (
            <Link href="/orders" className="transition hover:text-white">
              Orders
            </Link>
          ) : null}
          {session?.user?.role === "ADMIN" ? (
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            Cart
            {cartCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-[var(--accent)] px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {session?.user ? (
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                className="border-white/15 py-2 text-white hover:bg-white/10"
              >
                Log out
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="border-white/15 py-2 text-white hover:bg-white/10"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:inline-flex">
                <Button className="py-2">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
