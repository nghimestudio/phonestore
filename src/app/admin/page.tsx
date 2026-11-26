import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";

export default async function AdminDashboardPage() {
  const [productCount, lowStock, orderCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      where: { stock: { lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.count(),
    prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{productCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{orderCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Low stock items</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {lowStock.length}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Low stock</h2>
          <Link href="/admin/products" className="text-sm font-medium text-sky-700">
            Manage products
          </Link>
        </div>
        {lowStock.length === 0 ? (
          <p className="text-sm text-slate-500">All products are well stocked.</p>
        ) : (
          <ul className="space-y-2">
            {lowStock.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-slate-700">{product.name}</span>
                <Badge className="bg-amber-50 text-amber-700">
                  {product.stock} left
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-sky-700">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    #{order.id.slice(-8).toUpperCase()} · {order.user.name}
                  </p>
                  <p className="text-slate-500">
                    {order.items.length} item(s) · {order.status}
                  </p>
                </div>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
