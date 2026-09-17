import clsx from "clsx";
import Image from "next/image";
import Label from "../label";

/**
 * The image well every product card, gallery thumbnail and carousel slide
 * shares.
 *
 * Two behaviours worth knowing about:
 * - `hoverSrc` cross-fades to a second Shopify image on hover, the standard
 *   fashion-retail card interaction. It is pure CSS opacity, no JS.
 * - the image is `object-cover` inside a 3:4 portrait frame. Couture
 *   photography is shot vertically; `object-contain` letterboxes it.
 */
export function GridTileImage({
  isInteractive = true,
  active,
  label,
  hoverSrc,
  ratioClassName = "aspect-[4/5]",
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  /** Second image, revealed on hover. Usually `product.images[1]?.url`. */
  hoverSrc?: string;
  /** Override the frame ratio, e.g. "aspect-square" for gallery thumbnails. */
  ratioClassName?: string;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
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
            "absolute inset-0 h-full w-full object-contain",
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
          className="absolute inset-0 h-full w-full scale-[1.02] object-contain opacity-0 transition-[opacity,transform] duration-(--duration-slow) ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-100 group-hover/card:opacity-100"
        />
      ) : null}

      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
