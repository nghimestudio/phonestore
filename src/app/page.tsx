import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button, SectionHeading } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featured, brands] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
  ]);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1800&q=85"
            alt="Premium smartphone on display"
            fill
            priority
            className="hero-image object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,12,16,0.94)_0%,rgba(10,12,16,0.82)_48%,rgba(10,12,16,0.45)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:justify-center sm:pb-24">
          <p className="animate-rise font-display text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-none tracking-tight text-white">
            PhoneStore
          </p>
          <h1 className="animate-rise-delay-1 mt-5 max-w-xl font-display text-2xl font-semibold leading-tight text-white/95 sm:text-3xl">
            Flagship phones, chosen with care
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
            Compare the latest devices and checkout in minutes.
          </p>
          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/products">
              <Button className="px-7 py-3.5 text-base">Shop phones</Button>
            </Link>
            <Link href="/register">
              <Button
                variant="ghost"
                className="border-white/25 bg-white/5 px-7 py-3.5 text-base text-white hover:bg-white/10"
              >
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          title="Featured phones"
          description="Current flagships and standout midrange picks."
          action={
            <Link
              href="/products"
              className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)]"
            >
              View all →
            </Link>
          }
        />
        <div className="product-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            title="Shop by brand"
            description="Jump straight to the makers you trust."
          />
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {brands.map(({ brand }) => (
              <Link
                key={brand}
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="font-display text-xl font-semibold text-[var(--ink)] underline-offset-8 transition hover:text-[var(--accent)] hover:underline sm:text-2xl"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
