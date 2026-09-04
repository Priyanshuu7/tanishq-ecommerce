import { AnimatedReveal } from "components/motion/animated-reveal";
import Link from "next/link";
import type { CtaLink } from "lib/editorial";

/**
 * Designed empty result state. Shown when a collection has nothing in it, a
 * search matches nothing, or Shopify is unreachable — all three should read as
 * a considered page rather than a blank column or a 500.
 */
export function EmptyState({
  heading,
  body,
  cta,
}: {
  heading: string;
  body: string;
  cta?: CtaLink;
}) {
  return (
    <AnimatedReveal
      variant="fade"
      className="flex flex-col items-center border border-border px-8 py-24 text-center md:py-32"
    >
      <h2 className="t-editorial max-w-md text-foreground">{heading}</h2>
      <p className="t-body mt-4 max-w-sm text-muted-foreground">{body}</p>
      {cta ? (
        <Link href={cta.href} className="btn btn-primary mt-10">
          {cta.label}
        </Link>
      ) : null}
    </AnimatedReveal>
  );
}
