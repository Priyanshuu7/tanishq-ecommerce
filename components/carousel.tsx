import { ProductCardImage } from "components/product/product-card-image";
import Price from "components/price";
import { SectionHeading } from "components/ui/section-heading";
import { featuredProducts } from "lib/editorial";
import { getCollectionProducts } from "lib/shopify";
import Link from "next/link";

/**
 * Slow, continuously drifting product rail.
 *
 * `animate-carousel` translates the strip by exactly one third of its width,
 * which is why the products below are tripled — the loop point is invisible.
 * The animation pauses on hover so a slide can actually be read and clicked,
 * and `prefers-reduced-motion` stops it outright via the global rule
 * in `globals.css`.
 */
export async function Carousel() {
  // Products for the homepage carousel.
  const products = await getCollectionProducts({
    collection: "feztive",
  });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop
  // and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <section className="section-y-sm overflow-hidden">
      <div className="layout-wide">
        <SectionHeading
          eyebrow={featuredProducts.eyebrow}
          heading={featuredProducts.heading}
        />
      </div>

      <div className="mt-14 w-full overflow-hidden">
        <ul className="flex w-max animate-carousel gap-4 hover:[animation-play-state:paused] md:gap-6">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.handle}${i}`}
              className="group/card w-[62vw] flex-none sm:w-[38vw] lg:w-[24vw] xl:w-[20vw]"
              aria-hidden={i >= products.length}
            >
              <Link
                href={`/product/${product.handle}`}
                className="block"
                tabIndex={i >= products.length ? -1 : undefined}
              >
                <ProductCardImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  hoverSrc={product.images?.[1]?.url}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 24vw, (min-width: 640px) 38vw, 62vw"
                />

                <div className="mt-4 flex flex-col gap-1.5">
                  <h3 className="t-product-title truncate">{product.title}</h3>

                  <Price
                    className="text-muted-foreground"
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={
                      product.priceRange.maxVariantPrice.currencyCode
                    }
                    currencyCodeClassName="hidden sm:inline"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
