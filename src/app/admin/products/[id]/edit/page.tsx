import { notFound } from "next/navigation";
import { updateProductAction } from "@/actions/products";
import { ProductForm } from "@/components/product-form";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Edit {product.name}
      </h2>
      <ProductForm action={boundAction} product={product} />
    </div>
  );
}
