import clsx from "clsx";
import Image from "next/image";

/**
 * Product card image component with hover cross-fade.
 *
 * Two behaviours:
 * - `hoverSrc` cross-fades to a second Shopify image on hover, the standard
 *   fashion-retail card interaction using pure CSS opacity.
 * - the image is `object-cover` inside a portrait frame (default 2:3 aspect ratio).
 */
export function ProductCardImage({
  isInteractive = true,
  active,
  hoverSrc,
  ratioClassName = "aspect-[2/3]",
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  /** Second image, revealed on hover. Usually `product.images[1]?.url`. */
  hoverSrc?: string;
  /** Override the frame ratio, e.g. "aspect-square" for gallery thumbnails. */
  ratioClassName?: string;
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden bg-surface",
        ratioClassName,
        active !== undefined && [
          "after:pointer-events-none after:absolute after:inset-0 after:transition-colors after:duration-(--duration-base)",
          active ? "after:border after:border-foreground" : "after:border-0",
        ],
      )}
    >
      {props.src ? (
        <Image
          className={clsx(
            "absolute inset-0 h-full w-full object-cover",
            "transition-[opacity,transform] duration-(--duration-slow) ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInteractive && !hoverSrc && "group-hover/card:scale-[1.04]",
            // With a hover image present, the primary fades out instead of
            // scaling, so the two images cross-dissolve cleanly.
            isInteractive && hoverSrc && "group-hover/card:opacity-0",
          )}
          {...props}
        />
      ) : null}

      {hoverSrc ? (
        <Image
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes={props.sizes}
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition-[opacity,transform] duration-(--duration-slow) ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-100 group-hover/card:opacity-100"
        />
      ) : null}
    </div>
  );
}

// Named alias for convenience
export const GridTileImage = ProductCardImage;
export default ProductCardImage;
