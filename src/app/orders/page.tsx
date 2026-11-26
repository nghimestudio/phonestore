import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Badge, Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800",
  PAID: "bg-[var(--accent-soft)] text-[var(--accent)]",
  SHIPPED: "bg-emerald-50 text-emerald-800",
  CANCELLED: "bg-rose-50 text-rose-800",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Account
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-[var(--ink)]">
        Your orders
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Track purchases and delivery status.
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 border border-dashed border-[var(--line)] bg-white/70 p-12 text-center">
          <p className="text-[var(--muted)]">
            You have not placed any orders yet.
          </p>
          <Link href="/products" className="mt-5 inline-block">
            <Button>Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border border-[var(--line)] bg-white p-5 transition hover:border-[var(--ink)]/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-[var(--ink)]">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {order.createdAt.toLocaleString()} · {order.items.length}{" "}
                    item(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusStyles[order.status]}>
                    {order.status}
                  </Badge>
                  <span className="font-semibold text-[var(--ink)]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
