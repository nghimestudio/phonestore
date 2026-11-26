import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden border border-[var(--line)] bg-white transition duration-300 hover:border-[var(--ink)]/25"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--paper-deep)]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)]/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {product.brand}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug text-[var(--ink)]">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--muted)]">
          {product.storageGb}GB · {product.color}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-semibold text-[var(--ink)]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-[var(--muted)] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
