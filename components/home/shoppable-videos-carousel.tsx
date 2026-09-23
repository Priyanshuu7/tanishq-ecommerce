"use client";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Price from "components/price";
import type { CustomerReel } from "lib/editorial";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export type ShoppableVideoItem = CustomerReel & {
  product?: Product | null;
};

export function ShoppableVideosCarousel({
  videos,
  eyebrow,
  heading,
  description,
}: {
  videos: ShoppableVideoItem[];
  eyebrow?: string;
  heading: string;
  description?: string;
}) {
  const scrollRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstItem = container.firstElementChild as HTMLElement | null;
    const gap = typeof window !== "undefined" && window.innerWidth >= 768 ? 24 : 16;
    const cardWidth = firstItem
      ? firstItem.clientWidth + gap
      : container.clientWidth * 0.75;

    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === "left") {
      if (container.scrollLeft <= 15) {
        // Loop to the end if at the start
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft >= maxScroll - 15) {
        // Loop back to start if at the end
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }
  };

  if (!videos.length) return null;

  return (
    <section id="customer-spotlight" className="section-y">
      {/* Constrained inside layout-wide to match collection page grid dimensions */}
      <div className="layout-wide">
        {/* Section Heading */}
        <div className="mb-8 md:mb-10">
          {eyebrow ? (
            <p className="t-eyebrow text-muted-foreground">{eyebrow}</p>
          ) : null}
          <h2 className="t-heading text-foreground mt-2">{heading}</h2>
          {description ? (
            <p className="t-caption mt-2 text-muted-foreground max-w-xl">
              {description}
            </p>
          ) : null}
        </div>

        {/* Carousel Row: Desktop has flanking buttons in side gutters, mobile has native swiping */}
        <div className="relative md:px-12 lg:px-14">
          {/* Backward Button: Desktop only, viewable & clickable all the time */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous videos"
            className={clsx(
              "hidden md:flex absolute left-0 top-[38%] -translate-y-1/2 z-20 cursor-pointer",
              "h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all duration-(--duration-base)",
              "hover:border-foreground hover:bg-foreground hover:text-background active:scale-95",
            )}
          >
            <ChevronLeftIcon className="h-5 w-5" strokeWidth={1.8} />
          </button>

          {/* Carousel Track: 4 in a row on desktop matching collection product size */}
          <ul
            ref={scrollRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:gap-6"
          >
            {videos.map((item, index) => (
              <VideoCard key={item.id || index} item={item} />
            ))}
          </ul>

          {/* Forward Button: Desktop only, viewable & clickable all the time */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next videos"
            className={clsx(
              "hidden md:flex absolute right-0 top-[38%] -translate-y-1/2 z-20 cursor-pointer",
              "h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur-md transition-all duration-(--duration-base)",
              "hover:border-foreground hover:bg-foreground hover:text-background active:scale-95",
            )}
          >
            <ChevronRightIcon className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </section>
  );
}

function VideoCard({ item }: { item: ShoppableVideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const productUrl = `/product/${item.product?.handle || item.productHandle}`;
  const displayTitle = item.product?.title || item.tagline || "Product";

  return (
    <li className="group/video shrink-0 basis-[78%] snap-start sm:basis-[48%] md:basis-[calc((100%-48px)/3)] lg:basis-[calc((100%-72px)/4)]">
      <Link href={productUrl} className="block group/link">
        {/* Video Frame — Aspect 2:3 matching collection page product cards with subtle rounded edges */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-surface border border-border/40 transition-transform duration-(--duration-slower) ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:shadow-md">
          {/* Non-stop Looping Video */}
          <video
            ref={videoRef}
            src={item.videoSrc}
            poster={item.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/video:scale-[1.03]"
          />

          {/* Subtle bottom gradient for card readability */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Bar: Patron Badge & Mute Toggle */}
          <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-sans text-white/90 backdrop-blur-xs border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[100px]">
                {item.customerName || "Patron"}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-xs border border-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
              ) : (
                <SpeakerWaveIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
              )}
            </button>
          </div>

          {/* Small Floating Product Badge Overlaid on the Video */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-10">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-background/90 px-2.5 py-1.5 backdrop-blur-md shadow-md transition-all duration-300 group-hover/link:bg-background group-hover/link:border-foreground/30">
              {/* Product Thumbnail */}
              {item.product?.featuredImage?.url ? (
                <div className="relative h-6 w-6 flex-none overflow-hidden rounded-full border border-border/40">
                  <Image
                    src={item.product.featuredImage.url}
                    alt={item.product.featuredImage.altText || displayTitle}
                    fill
                    sizes="24px"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-sans tracking-wide text-foreground font-medium">
                  Shop {displayTitle}
                </p>
              </div>

              {/* Shop Arrow Icon */}
              <div className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover/link:translate-x-0.5">
                <ArrowRightIcon className="h-2.5 w-2.5" strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Underneath Card — Exactly Matching Collection Page */}
        <div className="mt-3.5 flex flex-col gap-1">
          <h3 className="t-product-title text-foreground italic group-hover/link:text-accent-deep transition-colors truncate">
            {displayTitle}
          </h3>
          {item.product?.priceRange?.maxVariantPrice ? (
            <div className="flex items-baseline gap-2">
              <Price
                className="text-sm text-muted-foreground"
                amount={item.product.priceRange.maxVariantPrice.amount}
                currencyCode={
                  item.product.priceRange.maxVariantPrice.currencyCode
                }
                currencyCodeClassName="hidden sm:inline"
              />
            </div>
          ) : item.tagline ? (
            <p className="text-xs text-muted-foreground truncate">
              {item.tagline}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
