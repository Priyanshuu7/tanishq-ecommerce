"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type FilmPlayerProps = {
  /** Direct link to an .mp4 / .webm file. See the `Film` type in lib/editorial.ts. */
  src: string;
  poster?: string;
  /** Describes the footage for assistive tech. Omit when a caption already names it. */
  label?: string;
  /** Renders a mute toggle. Playback still starts muted — browsers insist. */
  sound?: boolean;
  /** Lays a legibility gradient over the film. Off for the grid tiles. */
  scrim?: boolean;
  /**
   * The hero film is the page's largest paint, so it fetches immediately.
   * Everything below the fold asks for metadata only.
   */
  priority?: boolean;
  /** Applied to the film layer — used for the grid's slow hover scale. */
  className?: string;
};

/**
 * Autoplaying background film.
 *
 * Renders its own absolutely-positioned media layer, which is why the parent
 * must be `relative` and any caption over it needs `relative z-10`. Owning the
 * layer is what keeps the mute toggle clickable: an earlier arrangement put the
 * video in a `-z-10` well, which pushed the button behind the page.
 *
 * Three behaviours worth knowing:
 *
 * 1. It plays only while on screen. An IntersectionObserver pauses it on the
 *    way out, which matters most for the 2×2 grid — four simultaneous video
 *    decodes drop frames on a laptop and drain a phone for no benefit, since
 *    only one or two tiles are ever visible.
 * 2. `prefers-reduced-motion` stops it dead and leaves the poster showing. A
 *    silent looping video is precisely the motion that setting exists to
 *    suppress, and CSS cannot pause playback, so this one has to be JS.
 * 3. It starts muted, always — no browser autoplays audio. The `sound` toggle
 *    only becomes meaningful after the visitor's own click.
 */
export function FilmPlayer({
  src,
  poster,
  label,
  sound = false,
  scrim = true,
  priority = false,
  className,
}: FilmPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React does not reliably reflect `muted` onto the element, and an unmuted
    // video is not allowed to autoplay. Assert it before anything else.
    video.muted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // play() rejects when the browser blocks autoplay — low power mode, a
    // data-saver setting. The poster stays up, which is the right fallback,
    // so there is nothing to handle.
    const play = () => void video.play().catch(() => { });

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
  }, []);

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        // Unlabelled film sits behind a caption that already carries the
        // meaning, so it is decorative rather than an unnamed <video> node.
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={clsx("h-full w-full object-cover", className)}
      />

      {scrim ? (
        <div className="media-scrim absolute inset-0" aria-hidden="true" />
      ) : null}

      {sound ? (
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
