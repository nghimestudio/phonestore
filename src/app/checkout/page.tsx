import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { placeOrderAction } from "@/actions/orders";
import { CheckoutForm } from "@/components/checkout-form";
import { Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const SHIPPING_FEE = 15;

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-[var(--muted)]">Add phones to your cart first.</p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Browse phones</Button>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const total = subtotal + SHIPPING_FEE;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Checkout
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-[var(--ink)]">
        Shipping & payment
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Enter shipping details and choose a payment method.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <CheckoutForm action={placeOrderAction} />

        <aside className="h-fit border border-[var(--line)] bg-white p-5">
          <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-[var(--muted)]">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium text-[var(--ink)]">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Shipping</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
