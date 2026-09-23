"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Image as ShopifyImage } from "lib/shopify/types";
import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Product card image component with swipeable multi-image gallery support.
 *
 * Behaviors:
 * - When `images` (with >1 images) is provided:
 *   - Mobile touch swipe (left/right) to browse all photos directly on the collection card.
 *   - Desktop hover previous/next chevron buttons.
 *   - Elegant pagination indicators (slim dashes) showing active index.
 *   - Swipe and button clicks cancel link navigation (`preventDefault`/`stopPropagation`),
 *     while an intentional tap opens the product page.
 * - When a single image is provided:
 *   - Falls back to standard image display with optional `hoverSrc` cross-fade.
 */
export function ProductCardImage({
  isInteractive = true,
  active,
  images,
  hoverSrc,
  ratioClassName = "aspect-[2/3]",
  alt = "",
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  /** Full list of product images for swipeable gallery. */
  images?: ShopifyImage[];
  /** Second image, revealed on hover when not using multi-image slider. */
  hoverSrc?: string;
  /** Override the frame ratio, e.g. "aspect-square" for gallery thumbnails. */
  ratioClassName?: string;
} & Omit<React.ComponentProps<typeof Image>, "src"> & {
  src?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize images list
  const imagesList: { url: string; altText?: string }[] =
    images && images.length > 0
      ? images.map((img) => ({
          url: img.url,
          altText: img.altText || alt,
        }))
      : props.src
        ? [
            { url: props.src as string, altText: alt },
            ...(hoverSrc ? [{ url: hoverSrc, altText: alt }] : []),
          ]
        : [];

  const totalImages = imagesList.length;
  const isMultiImage = totalImages > 1;

  // Touch and pointer swipe tracking
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const hasSwiped = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isMultiImage) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    hasSwiped.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startX.current === null || startY.current === null) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;

    if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {
      hasSwiped.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - (startY.current ?? 0);

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      hasSwiped.current = true;
      if (deltaX < 0) {
        // Swiped left -> next
        setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
      } else {
        // Swiped right -> prev
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
      }
    }

    startX.current = null;
    startY.current = null;

    setTimeout(() => {
      hasSwiped.current = false;
    }, 100);
  };

  const handlePointerCancel = () => {
    startX.current = null;
    startY.current = null;
    setTimeout(() => {
      hasSwiped.current = false;
    }, 100);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasSwiped.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
      className={clsx(
        "relative w-full overflow-hidden bg-surface select-none touch-pan-y",
        ratioClassName,
        active !== undefined && [
          "after:pointer-events-none after:absolute after:inset-0 after:transition-colors after:duration-(--duration-base)",
          active ? "after:border after:border-foreground" : "after:border-0",
        ],
      )}
    >
      {isMultiImage ? (
        <>
          {/* Sliding Track */}
          <div
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {imagesList.map((img, idx) => (
              <div
                key={img.url || idx}
                className="relative h-full w-full flex-none"
              >
                <Image
                  src={img.url}
                  alt={img.altText || alt}
                  fill
                  sizes={props.sizes}
                  priority={idx === 0 && props.priority}
                  loading={idx <= 1 ? "eager" : "lazy"}
                  draggable={false}
                  className="h-full w-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>

          {/* Desktop Chevron Navigation Controls */}
          {isInteractive ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/85 text-foreground shadow-xs backdrop-blur-xs opacity-0 transition-all duration-(--duration-base) hover:bg-background hover:scale-105 active:scale-95 group-hover/card:opacity-100 focus:opacity-100"
              >
                <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/85 text-foreground shadow-xs backdrop-blur-xs opacity-0 transition-all duration-(--duration-base) hover:bg-background hover:scale-105 active:scale-95 group-hover/card:opacity-100 focus:opacity-100"
              >
                <ChevronRightIcon className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </>
          ) : null}

          {/* Pagination Indicators (Dashes / Dots) */}
          <div className="absolute bottom-2.5 inset-x-0 z-10 flex items-center justify-center gap-1.5 px-3 pointer-events-none">
            {imagesList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`View image ${idx + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={clsx(
                  "pointer-events-auto h-1 rounded-full transition-all duration-300",
                  currentIndex === idx
                    ? "w-4 bg-foreground"
                    : "w-1.5 bg-foreground/35 hover:bg-foreground/60",
                )}
              />
            ))}
          </div>
        </>
      ) : props.src ? (
        <Image
          className={clsx(
            "absolute inset-0 h-full w-full object-cover",
            "transition-[opacity,transform] duration-(--duration-slow) ease-[cubic-bezier(0.22,1,0.36,1)]",
            isInteractive && !hoverSrc && "group-hover/card:scale-[1.04]",
            isInteractive && hoverSrc && "group-hover/card:opacity-0",
          )}
          alt={alt}
          src={props.src}
          {...props}
        />
      ) : null}

      {/* Fallback Single Hover Image when not multi-image */}
      {!isMultiImage && hoverSrc ? (
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

export const GridTileImage = ProductCardImage;
export default ProductCardImage;
