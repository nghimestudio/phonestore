"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { productSchema } from "@/lib/validators";
import type { ActionState } from "@/actions/auth";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || "",
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
    storageGb: formData.get("storageGb"),
    color: formData.get("color"),
    featured: formData.get("featured") === "on",
    display: formData.get("display") || undefined,
    chip: formData.get("chip") || undefined,
    camera: formData.get("camera") || undefined,
    battery: formData.get("battery") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data" };
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const specs = {
    display: parsed.data.display ?? "",
    chip: parsed.data.chip ?? "",
    camera: parsed.data.camera ?? "",
    battery: parsed.data.battery ?? "",
  };

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      brand: parsed.data.brand,
      description: parsed.data.description,
      price: parsed.data.price,
      compareAtPrice:
        parsed.data.compareAtPrice === "" || parsed.data.compareAtPrice === undefined
          ? null
          : Number(parsed.data.compareAtPrice),
      stock: parsed.data.stock,
      imageUrl: parsed.data.imageUrl,
      storageGb: parsed.data.storageGb,
      color: parsed.data.color,
      featured: Boolean(parsed.data.featured),
      specs: JSON.stringify(specs),
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || "",
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
    storageGb: formData.get("storageGb"),
    color: formData.get("color"),
    featured: formData.get("featured") === "on",
    display: formData.get("display") || undefined,
    chip: formData.get("chip") || undefined,
    camera: formData.get("camera") || undefined,
    battery: formData.get("battery") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data" };
  }

  const specs = {
    display: parsed.data.display ?? "",
    chip: parsed.data.chip ?? "",
    camera: parsed.data.camera ?? "",
    battery: parsed.data.battery ?? "",
  };

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      brand: parsed.data.brand,
      description: parsed.data.description,
      price: parsed.data.price,
      compareAtPrice:
        parsed.data.compareAtPrice === "" || parsed.data.compareAtPrice === undefined
          ? null
          : Number(parsed.data.compareAtPrice),
      stock: parsed.data.stock,
      imageUrl: parsed.data.imageUrl,
      storageGb: parsed.data.storageGb,
      color: parsed.data.color,
      featured: Boolean(parsed.data.featured),
      specs: JSON.stringify(specs),
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/products");
  revalidatePath("/admin/products");
}
