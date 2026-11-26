import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Badge } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

type Params = Promise<{ id: string }>;

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800",
  PAID: "bg-[var(--accent-soft)] text-[var(--accent)]",
  SHIPPED: "bg-emerald-50 text-emerald-800",
  CANCELLED: "bg-rose-50 text-rose-800",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Params;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (
    !order ||
    (order.userId !== session.user.id && session.user.role !== "ADMIN")
  ) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/orders"
        className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
      >
        ← Back to orders
      </Link>

      <div className="mt-8 border border-[var(--line)] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Placed {order.createdAt.toLocaleString()}
            </p>
          </div>
          <Badge className={statusStyles[order.status]}>{order.status}</Badge>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
              Shipping
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {order.fullName}
              <br />
              {order.phone}
              <br />
              {order.addressLine1}
              {order.addressLine2 ? (
                <>
                  <br />
                  {order.addressLine2}
                </>
              ) : null}
              <br />
              {order.city}, {order.postalCode}
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
              Payment
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Method: {order.paymentMethod.replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
            Items
          </h2>
          <ul className="mt-3 space-y-2">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2 text-sm last:border-0"
              >
                <span className="text-[var(--ink-soft)]">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 space-y-1 border-t border-[var(--line)] pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Shipping</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
