import { ProductCard } from "@/components/product-card";
import { Button, Input, Select } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type SearchParams = Promise<{
  q?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  storage?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const where: Prisma.ProductWhereInput = {};

  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { brand: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }

  if (params.brand) {
    where.brand = params.brand;
  }

  if (params.storage) {
    where.storageGb = Number(params.storage);
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = Number(params.minPrice);
    if (params.maxPrice) where.price.lte = Number(params.maxPrice);
  }

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
    prisma.product.findMany({
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Catalog
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[var(--ink)] sm:text-5xl">
          All phones
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Filter by brand, price, and storage to find the right device.
        </p>
      </div>

      <form className="mb-10 grid gap-3 border border-[var(--line)] bg-white p-4 md:grid-cols-5">
        <Input
          name="q"
          defaultValue={params.q}
          placeholder="Search phones..."
        />
        <Select name="brand" defaultValue={params.brand ?? ""}>
          <option value="">All brands</option>
          {brands.map(({ brand }) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
        <Input
          name="minPrice"
          type="number"
          min={0}
          step="1"
          defaultValue={params.minPrice}
          placeholder="Min price"
        />
        <Input
          name="maxPrice"
          type="number"
          min={0}
          step="1"
          defaultValue={params.maxPrice}
          placeholder="Max price"
        />
        <Select name="storage" defaultValue={params.storage ?? ""}>
          <option value="">Any storage</option>
          <option value="128">128GB</option>
          <option value="256">256GB</option>
          <option value="512">512GB</option>
        </Select>
        <div className="md:col-span-5">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="border border-dashed border-[var(--line)] bg-white/70 p-12 text-center text-[var(--muted)]">
          No phones match your filters.
        </div>
      ) : (
        <div className="product-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
