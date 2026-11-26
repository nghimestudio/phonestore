"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators";
import type { ActionState } from "@/actions/auth";

const SHIPPING_FEE = 15;

export async function placeOrderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to checkout" };
  }

  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    paymentMethod: formData.get("paymentMethod"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid checkout data" };
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { error: "Your cart is empty" };
  }

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      return {
        error: `Not enough stock for ${item.product.name}`,
      };
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const total = subtotal + SHIPPING_FEE;
  const initialStatus =
    parsed.data.paymentMethod === "BANK_TRANSFER"
      ? OrderStatus.PENDING
      : OrderStatus.PENDING;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session.user.id,
        status: initialStatus,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        addressLine1: parsed.data.addressLine1,
        addressLine2: parsed.data.addressLine2,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        paymentMethod: parsed.data.paymentMethod,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: session.user.id } });
    return created;
  });

  revalidatePath("/orders");
  revalidatePath("/cart");
  revalidatePath("/admin");
  redirect(`/orders/${order.id}`);
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return;
  }

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  if (!Object.values(OrderStatus).includes(status)) {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
}
