import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/actions/cart";
import { Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/cart");
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Cart
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-[var(--ink)]">
        Your cart
      </h1>
      <p className="mt-2 text-[var(--muted)]">Review items before checkout.</p>

      {items.length === 0 ? (
        <div className="mt-10 border border-dashed border-[var(--line)] bg-white/70 p-12 text-center">
          <p className="text-[var(--muted)]">Your cart is empty.</p>
          <Link href="/products" className="mt-5 inline-block">
            <Button>Browse phones</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 border border-[var(--line)] bg-white p-4 sm:flex-row"
              >
                <div className="relative h-32 w-full overflow-hidden bg-[var(--paper-deep)] sm:h-28 sm:w-28">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-display text-lg font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-[var(--muted)]">
                      {item.product.brand} · {item.product.storageGb}GB
                    </p>
                    <p className="mt-1 font-medium text-[var(--ink)]">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <form
                      action={updateCartItemAction}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="hidden"
                        name="productId"
                        value={item.productId}
                      />
                      <label
                        className="text-sm text-[var(--muted)]"
                        htmlFor={`qty-${item.id}`}
                      >
                        Qty
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        name="quantity"
                        type="number"
                        min={0}
                        max={item.product.stock}
                        defaultValue={item.quantity}
                        className="w-20 rounded-md border border-[var(--line)] px-2 py-1.5 text-sm"
                      />
                      <Button type="submit" variant="ghost" className="py-1.5">
                        Update
                      </Button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await removeCartItemAction(item.productId);
                      }}
                    >
                      <Button type="submit" variant="danger" className="py-1.5">
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-[var(--line)] bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              Summary
            </h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--ink)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Shipping calculated at checkout.
            </p>
            <Link href="/checkout" className="mt-5 block">
              <Button className="w-full">Proceed to checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
