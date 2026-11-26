"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cartQuantitySchema } from "@/lib/validators";

export async function addToCartAction(productId: string, quantity = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to add items to your cart" };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < 1) {
    return { error: "Product is out of stock" };
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  const nextQty = (existing?.quantity ?? 0) + quantity;
  if (nextQty > product.stock) {
    return { error: "Not enough stock available" };
  }

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
    create: {
      userId: session.user.id,
      productId,
      quantity,
    },
    update: {
      quantity: nextQty,
    },
  });

  revalidatePath("/cart");
  revalidatePath("/");
  return { success: "Added to cart" };
}

export async function updateCartItemAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  const parsed = cartQuantitySchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return;
  }

  const { productId, quantity } = parsed.data;

  if (quantity === 0) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
  } else {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || quantity > product.stock) {
      return;
    }

    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeCartItemAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function getCartCount(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    select: { quantity: true },
  });
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
