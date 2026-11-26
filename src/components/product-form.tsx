"use client";

import { useActionState } from "react";
import type { Product } from "@prisma/client";
import type { ActionState } from "@/actions/auth";
import { Alert, Button, Input, Label, TextArea } from "@/components/ui";
import { parseSpecs } from "@/lib/utils";

export function ProductForm({
  action,
  product,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const specs = product ? parseSpecs(product.specs) : {};

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={product?.name} />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" name="brand" required defaultValue={product?.brand} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={product?.description}
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min={0}
            required
            defaultValue={product?.price}
          />
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Compare-at price</Label>
          <Input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min={0}
            defaultValue={product?.compareAtPrice ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min={0}
            required
            defaultValue={product?.stock ?? 0}
          />
        </div>
        <div>
          <Label htmlFor="storageGb">Storage (GB)</Label>
          <Input
            id="storageGb"
            name="storageGb"
            type="number"
            min={1}
            required
            defaultValue={product?.storageGb}
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" required defaultValue={product?.color} />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            defaultValue={product?.imageUrl}
          />
        </div>
        <div>
          <Label htmlFor="display">Display</Label>
          <Input id="display" name="display" defaultValue={specs.display} />
        </div>
        <div>
          <Label htmlFor="chip">Chip</Label>
          <Input id="chip" name="chip" defaultValue={specs.chip} />
        </div>
        <div>
          <Label htmlFor="camera">Camera</Label>
          <Input id="camera" name="camera" defaultValue={specs.camera} />
        </div>
        <div>
          <Label htmlFor="battery">Battery</Label>
          <Input id="battery" name="battery" defaultValue={specs.battery} />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={product?.featured}
            className="h-4 w-4 rounded border-slate-300"
          />
          <Label htmlFor="featured" className="mb-0">
            Featured on homepage
          </Label>
        </div>
      </div>

      {state.error ? <Alert>{state.error}</Alert> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : product ? "Update product" : "Create product"}
      </Button>
    </form>
  );
}
