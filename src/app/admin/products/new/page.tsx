import { createProductAction } from "@/actions/products";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Add phone</h2>
      <ProductForm action={createProductAction} />
    </div>
  );
}
