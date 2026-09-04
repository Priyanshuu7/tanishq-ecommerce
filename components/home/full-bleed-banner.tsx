import { FilmPlayer } from "components/media/film-player";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { featureFallback, featureFilm } from "lib/editorial";
import Link from "next/link";

/**
 * Full-bleed feature band, lower down the page.
 *
 * Like the hero, this used to lay type over a Shopify product still; it now
 * plays `featureFilm` from lib/editorial.ts. `sound` is on for this slot, so
 * FilmPlayer draws a mute toggle in the bottom-left corner — the film still
 * starts silent and only unmutes on a real click.
 *
 * Falls back to a flat espresso panel with the fuller `featureFallback` copy
 * while no film is configured.
 */
export function FullBleedBanner() {
  const hasFilm = Boolean(featureFilm.src);

  return (
    <section className="relative flex min-h-[78svh] items-center justify-center overflow-hidden">
      {hasFilm ? (
        <FilmPlayer
          src={featureFilm.src}
          poster={featureFilm.poster}
          label={featureFilm.label}
          sound={featureFilm.sound}
        />
      ) : (
        <div className="absolute inset-0 bg-foreground" aria-hidden="true" />
      )}

      <div className="layout-wide relative z-10 py-24 text-center text-on-media">
        {hasFilm ? <FilmCaption /> : <FallbackCopy />}
      </div>
    </section>
  );
}

/** The reference treatment: wide-tracked title, one underlined link. */
function FilmCaption() {
  return (
    <>
      <div className="overflow-hidden">
        <AnimatedReveal variant="mask" as="h2" className="t-film-title">
          {featureFilm.title}
        </AnimatedReveal>
      </div>

      {featureFilm.cta ? (
        <AnimatedReveal
          variant="fade"
          delay={260}
          className="mt-7 flex justify-center"
        >
          <Link
            href={featureFilm.cta.href}
            className="t-nav link-sweep link-retract pb-2"
          >
            {featureFilm.cta.label}
          </Link>
        </AnimatedReveal>
      ) : null}
    </>
  );
}

/** Shown only until a feature film is configured. */
function FallbackCopy() {
  return (
    <>
      <AnimatedReveal variant="fade">
        <p className="t-eyebrow mb-7 opacity-80">{featureFallback.eyebrow}</p>
      </AnimatedReveal>

      <div className="overflow-hidden">
        <AnimatedReveal
          variant="mask"
          delay={100}
          as="h2"
          className="t-section mx-auto max-w-3xl"
        >
          {featureFallback.heading}
        </AnimatedReveal>
      </div>

      <AnimatedReveal variant="up" delay={240}>
        <p className="t-body mx-auto mt-7 max-w-lg opacity-85">
          {featureFallback.body}
        </p>
      </AnimatedReveal>

      <AnimatedReveal
        variant="fade"
        delay={380}
        className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link href={featureFallback.primaryCta.href} className="btn btn-light">
          {featureFallback.primaryCta.label}
        </Link>
        <Link
          href={featureFallback.secondaryCta.href}
          className="t-nav link-sweep link-retract px-4 py-3"
        >
          {featureFallback.secondaryCta.label}
        </Link>
      </AnimatedReveal>
    </>
  );
}
