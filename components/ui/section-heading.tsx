import clsx from "clsx";
import { AnimatedReveal } from "components/motion/animated-reveal";
import type { CtaLink } from "lib/editorial";
import Link from "next/link";

/**
 * Eyebrow + heading + optional call to action. Every section on the site uses
 * this so the vertical rhythm above a module is identical everywhere.
 */
export function SectionHeading({
  eyebrow,
  heading,
  cta,
  align = "start",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  heading: string;
  cta?: CtaLink;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <AnimatedReveal variant="fade" className="overflow-hidden">
        {eyebrow ? (
          <p className="t-eyebrow mb-4 text-muted-foreground">{eyebrow}</p>
        ) : null}
        <Tag className="t-section max-w-2xl">{heading}</Tag>
      </AnimatedReveal>

      {cta ? (
        <AnimatedReveal variant="fade" delay={120} className="shrink-0">
          <Link
            href={cta.href}
            className="t-nav link-sweep link-retract text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
          >
            {cta.label}
          </Link>
        </AnimatedReveal>
      ) : null}
    </div>
  );
}
