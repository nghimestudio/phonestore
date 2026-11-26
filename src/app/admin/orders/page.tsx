import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/actions/orders";
import { Badge, Button, Select } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-sky-50 text-sky-700",
  SHIPPED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-slate-900">Orders</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    #{order.id.slice(-8).toUpperCase()} · {order.user.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.createdAt.toLocaleString()} · {order.user.email}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.fullName}, {order.city} · {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={statusStyles[order.status]}>
                    {order.status}
                  </Badge>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} × {item.quantity} —{" "}
                    {formatPrice(item.unitPrice * item.quantity)}
                  </li>
                ))}
              </ul>

              <form
                action={updateOrderStatusAction}
                className="mt-4 flex flex-wrap items-end gap-3"
              >
                <input type="hidden" name="orderId" value={order.id} />
                <div className="min-w-[180px]">
                  <Select name="status" defaultValue={order.status}>
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button type="submit" variant="secondary" className="py-2">
                  Update status
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
