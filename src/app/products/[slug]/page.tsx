import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseSpecs } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    notFound();
  }

  const specs = parseSpecs(product.specs);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/products"
        className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)]"
      >
        ← Back to phones
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--paper-deep)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {product.brand}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-[var(--ink)] sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{product.storageGb}GB</Badge>
              <Badge>{product.color}</Badge>
              <Badge
                className={
                  product.stock > 0
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "bg-rose-50 text-rose-700"
                }
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-[var(--ink)]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-lg text-[var(--muted)] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="max-w-lg text-base leading-relaxed text-[var(--muted)]">
            {product.description}
          </p>

          <AddToCartButton
            productId={product.id}
            disabled={product.stock < 1}
          />

          <div className="border-t border-[var(--line)] pt-6">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              Specs
            </h2>
            <dl className="mt-4 space-y-3">
              {Object.entries(specs).map(([key, value]) =>
                value ? (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="capitalize text-[var(--muted)]">{key}</dt>
                    <dd className="text-right font-medium text-[var(--ink)]">
                      {value}
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
