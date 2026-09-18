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
          priority
          className="md:hero-editorial-image object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" aria-hidden="true" />
      )}

      {hasFilm ? <FilmCaption /> : <TypographicOpening />}

      {/* Scroll cue: a hairline that travels down its own track. */}
      <div
        aria-hidden="true"
        className={`absolute bottom-0 left-1/2 z-10 hidden h-20 w-px -translate-x-1/2 md:block ${
          hasFilm ? "bg-on-media/25" : "bg-border"
        }`}
      >
        <span
          className={`animate-scroll-cue block h-full w-px ${
            hasFilm ? "bg-on-media" : "bg-foreground"
          }`}
        />
      </div>
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
    <div className="layout-wide relative z-10 pb-20 text-center text-on-media md:pb-28">
      <div className="overflow-hidden">
        <AnimatedReveal
          variant="mask"
          as="h1"
          className="t-film-title drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
        >
          {heroFilm.title}
        </AnimatedReveal>
      </div>

      {heroFilm.cta ? (
        <AnimatedReveal
          variant="fade"
          delay={260}
          className="mt-7 flex justify-center"
        >
          <Link
            href={heroFilm.cta.href}
            className="t-nav link-sweep link-retract pb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          >
            {heroFilm.cta.label}
          </Link>
        </AnimatedReveal>
      ) : null}
    </div>
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
