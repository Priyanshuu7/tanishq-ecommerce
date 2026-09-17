import { AnimatedReveal } from "components/motion/animated-reveal";
import { SectionHeading } from "components/ui/section-heading";
import { categoryRail } from "lib/editorial";
import { getCollectionProducts, getCollections } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

/**
 * The four-card collection module.
 *
 * Cards are built from the store's real collections. Each card uses the
 * collection's dedicated image if set in Shopify Admin, or falls back to
 * the featured image of the first product in that collection.
 */
export async function CategoryCarousel() {
  const collections = await getCollections();

  // getCollections() prepends a synthetic "All" entry with an empty handle.
  const featured = collections.filter((entry) => entry.handle).slice(0, 4);
  if (!featured.length) return null;

  const cards = await Promise.all(
    featured.map(async (collection) => {
      if (collection.image) {
        return { collection, image: collection.image };
      }

      const products = await getCollectionProducts({
        collection: collection.handle,
      });
      return { collection, image: products[0]?.featuredImage };
    }),
  );

  return (
    <section className="section-y">
      <div className="layout-wide">
        <SectionHeading
          eyebrow={categoryRail.eyebrow}
          heading={categoryRail.heading}
        />
      </div>

      {/* Snapping rail on small screens, an even four-up grid from lg. */}
      <ul className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--page-gutter) md:gap-6 lg:mx-auto lg:grid lg:max-w-(--page-max) lg:grid-cols-4 lg:overflow-visible">
        {cards.map(({ collection, image }, index) => (
          <li
            key={collection.handle}
            className="group/card shrink-0 basis-[78%] snap-start sm:basis-[46%] lg:basis-auto"
          >
            <AnimatedReveal variant="up" delay={index * 110}>
              <Link href={collection.path} className="block">

                {/* // will updated this later  */}
                {/* <Link href={collection.path} prefetch={true} className="block"> */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText || collection.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 78vw"
                      className="h-full w-full object-cover transition-transform duration-(--duration-slower) ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.05]"
                    />
                  ) : null}

                  <div
                    className="media-scrim absolute inset-0"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 text-on-media md:p-7">
                    <h3 className="font-display text-2xl font-light leading-tight md:text-[1.75rem]">
                      {collection.title}
                    </h3>
                    <span className="t-nav link-sweep">
                      {categoryRail.exploreLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
