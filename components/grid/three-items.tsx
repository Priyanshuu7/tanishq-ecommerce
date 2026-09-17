import { GridTileImage } from "components/grid/tile";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { getCollectionProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import Link from "next/link";

function ThreeItemGridItem({
  item,
  size,
  priority,
  delay,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
  delay?: number;
}) {
  return (
    <AnimatedReveal
      variant="zoom"
      delay={delay}
      className={
        size === "full"
          ? "group/card md:col-span-2 md:row-span-2"
          : "group/card md:col-span-1 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-[4/5] h-full w-full md:aspect-auto"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          ratioClassName="h-full"
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </AnimatedReveal>
  );
}

/**
 * Editorial feature grid: one tall frame beside two stacked ones.
 *
 * The fixed container height on md+ is what lets the small frames add up to
 * exactly the height of the large one; below md each frame falls back to its
 * own 4:5 ratio and they stack.
 */
export async function ThreeItemGrid() {
  // Products from the Shopify "Home page" collection.
  const homepageItems = await getCollectionProducts({
    collection: "home-page",
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="layout-wide section-y">
      <div className="grid gap-4 md:h-[clamp(32rem,60vw,52rem)] md:grid-cols-3 md:grid-rows-2 md:gap-6">
        <ThreeItemGridItem size="full" item={firstProduct} priority={true} />

        <ThreeItemGridItem
          size="half"
          item={secondProduct}
          priority={true}
          delay={110}
        />

        <ThreeItemGridItem
          size="half"
          item={thirdProduct}
          delay={220}
        />
      </div>
    </section>
  );
}