import clsx from "clsx";
import { AnimatedReveal } from "components/motion/animated-reveal";
import type { EditorialStatement } from "lib/editorial";
import Image from "next/image";
import Link from "next/link";

/**
 * A centred statement block — the quiet, text-only beat that separates two
 * image-heavy modules. Copy comes from lib/editorial.ts.
 *
 * Pass an optional `image` URL to render a decorative full-bleed border below
 * the CTA. It spans the full viewport width, fits in the existing white-space
 * gap, and blends into the background via mix-blend-mode: multiply.
 */
export function EditorialSection({
  statement,
  image,
  className,
}: {
  statement: EditorialStatement;
  /** Optional decorative image shown below the CTA, ofull-bleed at low opacity. */
  image?: string;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "section-y text-center",
        // Remove bottom padding when the image fills that gap naturally
        image && "!pb-0",
        className,
      )}
    >
      {/* Text content — kept in the narrow reading column */}
      <div className="layout-text">
        {statement.eyebrow ? (
          <AnimatedReveal variant="fade">
            <p className="t-eyebrow mb-8 text-accent">{statement.eyebrow}</p>
          </AnimatedReveal>
        ) : null}

        <AnimatedReveal variant="fade" delay={80} className="overflow-hidden">
          <h2 className="t-section">{statement.heading}</h2>
        </AnimatedReveal>

        <div className="mt-8 flex flex-col gap-5">
          {statement.body.map((paragraph, index) => (
            <AnimatedReveal
              key={index}
              variant="up"
              delay={160 + index * 90}
              as="p"
              className="t-body text-muted-foreground text-lg"
            >
              {paragraph}
            </AnimatedReveal>
          ))}
        </div>

        {statement.cta ? (
          <AnimatedReveal
            variant="fade"
            delay={280}
            className="mt-12 flex justify-center"
          >
            <Link href={statement.cta.href} className="btn btn-primary">
              {statement.cta.label}
            </Link>
          </AnimatedReveal>
        ) : null}
      </div>

      {/*
       * Full-bleed decorative border — breaks out of the text column to span
       * the full viewport. Compact max-height so it fills the gap without
       * pushing subsequent sections. mix-blend-mode: multiply makes the white
       * areas of the PNG completely transparent.
       */}
      {image ? (
        <AnimatedReveal
          variant="fade"
          delay={360}
          className="mt-8 overflow-hidden"
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginBottom: "calc(-1 * clamp(4rem, 10vw, 9rem) + 2rem)",
          }}
        >
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={2400}
            height={320}
            sizes="100vw"
            className="h-auto w-full"
            style={{
              opacity: 0.30,
            }}
          />
        </AnimatedReveal>
      ) : null}
    </section>
  );
}
