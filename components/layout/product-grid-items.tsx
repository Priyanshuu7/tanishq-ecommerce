import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { AnimatedReveal } from "components/motion/animated-reveal";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import Link from "next/link";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product, index) => (
        <Grid.Item key={product.handle}>
          <AnimatedReveal
            variant="fade"
            // Stagger across a row, then reset, so a long grid does not end up
            // with a two-second delay at the bottom.
            delay={(index % 4) * 90}
          >
            <Link
              className="block"
              href={`/product/${product.handle}`}
              prefetch={false}
            >
              <GridTileImage
                alt={product.title}
                src={product.featuredImage?.url}
                // The second Shopify image, cross-faded in on hover.
                hoverSrc={product.images?.[1]?.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />

              <div className="mt-4 flex flex-col gap-1.5">
                <h3 className="t-product-title text-foreground">
                  {product.title}
                </h3>
                <div className="flex items-baseline gap-3">
                  <Price
                    className="text-muted-foreground"
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={
                      product.priceRange.maxVariantPrice.currencyCode
                    }
                    currencyCodeClassName="hidden sm:inline"
                  />
                  {!product.availableForSale ? (
                    <span className="t-eyebrow text-subtle">Out of stock</span>
                  ) : null}
                </div>
              </div>
            </Link>
          </AnimatedReveal>
        </Grid.Item>
      ))}
    </>
  );
}
