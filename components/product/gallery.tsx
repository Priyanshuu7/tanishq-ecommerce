import { AnimatedReveal } from "components/motion/animated-reveal";
import { productPage } from "lib/editorial";
import Image from "next/image";

/**
 * Product imagery.
 *
 * One DOM structure, two behaviours, no JavaScript: below `lg` the list is a
 * full-width scroll-snap rail you swipe through; from `lg` up the same items
 * stack into an editorial column beside the sticky info panel. Rendering the
 * images once and letting flex-direction do the work avoids the double image
 * download a hidden duplicate markup would cost.
 *
 * This used to be a client component that tracked the active image in
 * `?image=N`. A stacked column has no active image, so the hook, the router
 * writes and the arrow controls are all gone — presentation only, and it takes
 * the whole gallery off the client bundle.
 */
export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  if (!images.length) {
    return (
      <div className="aspect-[3/4] w-full bg-surface" aria-hidden="true" />
    );
  }

  return (
    <div>
      <ul
        className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto lg:snap-none lg:flex-col lg:gap-3 lg:overflow-visible"
        aria-label="Product images"
      >
        {images.map((image, index) => (
          <li
            key={image.src}
            className="group/zoom w-full flex-none snap-center lg:flex-auto"
          >
            <AnimatedReveal
              variant={index === 0 ? "fade" : "up"}
              className="relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-surface"
            >
              <Image
                className="h-full w-full object-cover transition-transform duration-(--duration-slower) ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/zoom:scale-[1.06]"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt={image.altText}
                src={image.src}
                priority={index === 0}
              />
            </AnimatedReveal>
          </li>
        ))}
      </ul>

      {images.length > 1 ? (
        <p className="t-caption mt-4 hidden lg:block">
          {productPage.zoomLabel}
        </p>
      ) : null}
    </div>
  );
}
