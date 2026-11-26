import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            PhoneStore
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
            Curated flagship and midrange smartphones with transparent pricing
            and reliable fulfillment.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Shop
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <Link href="/products" className="transition hover:text-white">
              All phones
            </Link>
            <Link href="/products?brand=Apple" className="transition hover:text-white">
              Apple
            </Link>
            <Link
              href="/products?brand=Samsung"
              className="transition hover:text-white"
            >
              Samsung
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Account
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <Link href="/orders" className="transition hover:text-white">
              Track orders
            </Link>
            <Link href="/cart" className="transition hover:text-white">
              Cart
            </Link>
            <Link href="/login" className="transition hover:text-white">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} PhoneStore</span>
          <span>Premium smartphones, straightforward buying</span>
        </div>
      </div>
    </footer>
  );
}
