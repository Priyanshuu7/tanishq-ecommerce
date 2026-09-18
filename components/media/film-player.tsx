"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { MediaType } from "lib/editorial";
import Image, { getImageProps } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type FilmPlayerProps = {
  /** Direct link to an .mp4 / .webm file, local image, or Google Drive URL. */
  src: string;
  /** Optional mobile-specific media source for responsive portrait framing. */
  mobileSrc?: string;
  poster?: string;
  /** Describes the footage/media for assistive tech. Omit when a caption already names it. */
  label?: string;
  /** Renders a mute toggle for videos. Playback still starts muted. */
  sound?: boolean;
  /** Lays a legibility gradient over the media. */
  scrim?: boolean;
  /** Lays a subtle dark vignette gradient at the top so transparent headers remain legible. */
  headerScrim?: boolean;
  /**
   * The hero media is the page's largest paint, so it fetches immediately.
   * Everything below the fold asks for metadata / lazy loading only.
   */
  priority?: boolean;
  /** Applied to the media layer — e.g. object position, hover scale. */
  className?: string;
  /** Explicit media type override ("image" | "video" | "auto"). */
  mediaType?: MediaType;
  /** Optional custom object-position style / class override. */
  objectPosition?: string;
};

/**
 * Normalizes media sources, converting Google Drive share URLs into
 * direct image assets or using local cached versions, and determining
 * whether to render as an optimized image or a video.
 */
export function resolveMediaSource(
  rawSrc: string,
  forcedType?: MediaType,
): { src: string; isImage: boolean; isVideo: boolean } {
  if (!rawSrc) {
    return { src: "", isImage: false, isVideo: false };
  }

  let src = rawSrc.trim();
  let isImage = false;
  let isVideo = false;

  // Extract Google Drive ID if provided
  const driveMatch = src.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^&]+&)?id=)|drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]+)/,
  );

  if (driveMatch) {
    const fileId = driveMatch[1];
    // If it's the known high-res editorial photo, route to local asset for zero-latency loading
    if (fileId === "1LYlCi8_6rD6XvXdXVSXINgXumTlPRNZW") {
      src = "/Hero-Banner.PNG";
      isImage = true;
    } else {
      // Direct high-resolution image endpoint for Google Drive
      src = `https://lh3.googleusercontent.com/d/${fileId}`;
      isImage = true;
    }
  }

  // Handle local path shortcuts or missing leading slash
  if (
    !src.startsWith("http://") &&
    !src.startsWith("https://") &&
    !src.startsWith("/") &&
    !src.startsWith("data:")
  ) {
    src = `/${src}`;
  }
  if (src.toLowerCase() === "/hero") {
    src = "/Hero-Banner.PNG";
    isImage = true;
  }

  if (forcedType === "image") {
    isImage = true;
    isVideo = false;
  } else if (forcedType === "video") {
    isVideo = true;
    isImage = false;
  } else if (!isImage) {
    const cleanUrl = src.split("?")[0]?.toLowerCase() ?? "";
    if (/\.(png|jpe?g|webp|avif|gif|svg)$/.test(cleanUrl)) {
      isImage = true;
    } else if (/\.(mp4|webm|ogg|mov)$/.test(cleanUrl)) {
      isVideo = true;
    } else {
      // Default to image if not recognized as video
      isImage = true;
    }
  }

  return { src, isImage, isVideo: !isImage };
}

/**
 * Editorial Media Player (Film or Still).
 *
 * Renders an optimized Next.js `<Image>` when given an image source (including
 * Google Drive links), or an autoplaying looping `<video>` when given footage.
 *
 * Preserves luxury editorial styling:
 * - Transparent header legibility via soft top scrim
 * - Caption contrast via bottom scrim
 * - Intelligent focal-point object positioning
 */
export function FilmPlayer({
  src,
  mobileSrc,
  poster,
  label,
  sound = false,
  scrim = true,
  headerScrim = true,
  priority = false,
  className,
  mediaType = "auto",
  objectPosition,
}: FilmPlayerProps) {
  const media = useMemo(
    () => resolveMediaSource(src, mediaType),
    [src, mediaType],
  );
  const mobileMedia = useMemo(
    () => (mobileSrc ? resolveMediaSource(mobileSrc, mediaType) : null),
    [mobileSrc, mediaType],
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!media.isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const play = () => void video.play().catch(() => {});

    if (typeof IntersectionObserver === "undefined") {
      play();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play();
          else video.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [media.isVideo]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  if (!media.src) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {media.isImage ? (
        mobileMedia?.isImage ? (
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={
                getImageProps({
                  src: media.src,
                  alt: label || "",
                  fill: true,
                  priority,
                  sizes: "100vw",
                  quality: 92,
                }).props.srcSet
              }
            />
            <source
              media="(max-width: 767px)"
              srcSet={
                getImageProps({
                  src: mobileMedia.src,
                  alt: label || "",
                  fill: true,
                  priority,
                  sizes: "100vw",
                  quality: 92,
                }).props.srcSet
              }
            />
            <img
              {...getImageProps({
                src: mobileMedia.src,
                alt: label || "",
                fill: true,
                priority,
                sizes: "100vw",
                quality: 92,
              }).props}
              alt={label || ""}
              className={clsx(
                "h-full w-full object-cover select-none transition-transform duration-(--duration-slower)",
                objectPosition,
                className,
              )}
            />
          </picture>
        ) : (
          <Image
            src={media.src}
            alt={label || ""}
            fill
            priority={priority}
            sizes="100vw"
            quality={92}
            className={clsx(
              "h-full w-full object-cover select-none transition-transform duration-(--duration-slower)",
              objectPosition,
              className,
            )}
          />
        )
      ) : (
        <video
          ref={videoRef}
          src={media.src}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          aria-label={label}
          aria-hidden={label ? undefined : true}
          className={clsx(
            "h-full w-full object-cover",
            objectPosition,
            className,
          )}
        />
      )}

      {/* Top subtle vignette scrim so brand logo and nav links stay readable over light tones */}
      {headerScrim ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/55 via-black/20 to-transparent"
          aria-hidden="true"
        />
      ) : null}

      {/* Bottom editorial scrim so title and CTA pop with cinematic clarity */}
      {scrim ? (
        <div
          className="media-scrim pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      ) : null}

      {/* Mute button is only relevant for video with an audio track */}
      {media.isVideo && sound ? (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!isMuted}
          aria-label={isMuted ? "Turn film sound on" : "Turn film sound off"}
          className="absolute bottom-6 left-6 z-10 flex h-10 w-10 items-center justify-center text-on-media/70 transition-colors duration-(--duration-base) hover:text-on-media"
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="h-5 w-5" strokeWidth={1.2} />
          ) : (
            <SpeakerWaveIcon className="h-5 w-5" strokeWidth={1.2} />
          )}
        </button>
      ) : null}
    </div>
  );
}
