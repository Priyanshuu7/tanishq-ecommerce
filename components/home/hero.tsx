import { FilmPlayer } from "components/media/film-player";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { heroFallback, heroFilm } from "lib/editorial";

import Link from "next/link";

/**
 * Full-viewport opening frame.
 *
 * The film comes from `heroFilm` in lib/editorial.ts, not from Shopify. This
 * used to pull `products[0].featuredImage` from a collection, which meant the
 * opening frame of the site was whichever product happened to sort first — no
 * art direction, and a still where the reference plays motion.
 *
 * With no film configured it falls back to `heroFallback`: a typographic
 * opening on the bone ground, which is a deliberate composition rather than a
 * broken one.
 *
 * Sits underneath the fixed, transparent header: `-mt-(--header-h)` pulls it up
 * and the matching padding keeps the type clear of the nav.
 *
 * `data-hero` is what tells the header it may go transparent, and for how long
 * (see the `body:has([data-hero])` rule in app/globals.css, and the hero-bottom
 * measurement in components/layout/navbar/header-shell.tsx). The header stays
 * transparent for the whole height of this section and turns solid the moment
 * the section's last pixel passes behind it.
 *
 * The value carries which ground the nav has to sit on: `film` needs near-white
 * ink, `light` keeps the espresso ink it already has, because white nav on the
 * bone ground would be invisible.
 */
export function Hero() {
  const hasFilm = Boolean(heroFilm.src);

  return (
    <section
      data-hero={hasFilm ? "film" : "light"}
      className="relative -mt-(--header-h) flex w-full min-h-screen min-h-dvh flex-col justify-end overflow-hidden pt-(--header-h)"
    >
      {hasFilm ? (
        <FilmPlayer
          src={heroFilm.src}
          mobileSrc={heroFilm.mobileSrc}
          poster={heroFilm.poster}
          label={heroFilm.label || heroFilm.title}
          sound={heroFilm.sound}
          headerScrim={false}
          priority
          className="md:hero-editorial-image object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" aria-hidden="true" />
      )}

      {hasFilm ? <FilmCaption /> : <TypographicOpening />}
    </section>
  );
}

/**
 * The sparse treatment the reference site uses over film: a wide-tracked title
 * and one underlined link, centred near the foot of the frame. Nothing else —
 * copy competes with the footage.
 */
function FilmCaption() {
  return (
    <>
      {/* Desktop View: positioned on the right side of the model in the bottom-right quadrant */}
      <div className="layout-wide relative z-10 hidden w-full pb-16 md:flex md:justify-end md:pb-20 lg:pb-28 text-on-media pointer-events-auto">
        <div className="flex flex-col items-start max-w-lg lg:max-w-xl text-left">
          <AnimatedReveal variant="fade" delay={80}>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[0.08em] leading-tight text-on-media drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
              {heroFilm.title}
            </h1>
          </AnimatedReveal>

          {heroFilm.desktopDescription ? (
            <div className="mt-4 lg:mt-6 space-y-3 font-sans font-light text-xs md:text-sm lg:text-[0.9375rem] text-on-media/90 leading-relaxed md:leading-[1.75] tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              {heroFilm.desktopDescription.map((para, i) => (
                <AnimatedReveal key={i} variant="up" delay={160 + i * 80}>
                  <p>{para}</p>
                </AnimatedReveal>
              ))}
            </div>
          ) : null}

          {heroFilm.cta ? (
            <AnimatedReveal variant="fade" delay={340} className="mt-6 lg:mt-8">
              <Link
                href={heroFilm.cta.href}
                className="t-nav link-sweep link-retract pb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] text-on-media"
              >
                {heroFilm.cta.label}
              </Link>
            </AnimatedReveal>
          ) : null}
        </div>
      </div>

      {/* Mobile View: positioned in the open sunlit space to the right of the model */}
      <div className="absolute right-5 xs:right-7 sm:right-10 top-[40%] -translate-y-1/2 z-10 flex md:hidden flex-col items-start max-w-[190px] xs:max-w-[210px] sm:max-w-[240px] text-left text-on-media pointer-events-auto">
        <AnimatedReveal variant="fade" delay={80}>
          <h1 className="font-display text-3xl font-normal tracking-[0.08em] leading-tight text-on-media drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
            {heroFilm.title}
          </h1>
        </AnimatedReveal>

        {heroFilm.mobileTagline ? (
          <AnimatedReveal variant="up" delay={160}>
            <p className="mt-2.5 font-sans font-light text-xs sm:text-sm text-on-media/90 leading-snug tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {heroFilm.mobileTagline}
            </p>
          </AnimatedReveal>
        ) : null}

        {heroFilm.cta ? (
          <AnimatedReveal variant="fade" delay={260} className="mt-2.5">
            <Link
              href={heroFilm.cta.href}
              className="t-nav link-sweep link-retract pb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] text-on-media"
            >
              {heroFilm.cta.label}
            </Link>
          </AnimatedReveal>
        ) : null}
      </div>
    </>
  );
}

/** Shown only until a hero film is configured. */
function TypographicOpening() {
  return (
    <div className="layout-wide relative z-10 pb-20 text-foreground md:pb-28">
      <AnimatedReveal variant="fade">
        <p className="t-eyebrow mb-6 text-muted-foreground">
          {heroFallback.eyebrow}
        </p>
      </AnimatedReveal>

      <div className="overflow-hidden">
        <AnimatedReveal
          variant="mask"
          delay={120}
          as="h1"
          className="t-display max-w-4xl"
        >
          {heroFallback.heading}
        </AnimatedReveal>
      </div>

      <AnimatedReveal variant="up" delay={280}>
        <p className="t-body mt-7 max-w-md text-muted-foreground">
          {heroFallback.subheading}
        </p>
      </AnimatedReveal>

      <AnimatedReveal variant="fade" delay={420} className="mt-10 flex">
        <Link href={heroFallback.cta.href} className="btn btn-primary">
          {heroFallback.cta.label}
        </Link>
      </AnimatedReveal>
    </div>
  );
}
