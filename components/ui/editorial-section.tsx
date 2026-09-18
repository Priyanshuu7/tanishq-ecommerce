import clsx from "clsx";
import { AnimatedReveal } from "components/motion/animated-reveal";
import type { EditorialStatement } from "lib/editorial";
import Link from "next/link";

/**
 * A centred statement block — the quiet, text-only beat that separates two
 * image-heavy modules. Copy comes from lib/editorial.ts.
 */
export function EditorialSection({
  statement,
  className,
}: {
  statement: EditorialStatement;
  className?: string;
}) {
  return (
    <section className={clsx("layout-text section-y text-center", className)}>
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
    </section>
  );
}
