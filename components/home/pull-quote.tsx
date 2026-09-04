import { AnimatedReveal } from "components/motion/animated-reveal";
import { pullQuote } from "lib/editorial";

/** Designer pull quote — the quietest beat on the page. */
export function PullQuote() {
  return (
    <section className="border-y border-border bg-surface">
      <figure className="layout-text section-y text-center">
        <AnimatedReveal variant="fade">
          <span
            aria-hidden="true"
            className="font-display mx-auto mb-6 block text-5xl leading-none text-accent"
          >
            &rdquo;
          </span>
        </AnimatedReveal>

        <AnimatedReveal variant="up" delay={100} as="blockquote">
          <p className="t-editorial italic">{pullQuote.quote}</p>
        </AnimatedReveal>

        <AnimatedReveal variant="fade" delay={260} as="figcaption">
          <p className="t-eyebrow mt-10 text-muted-foreground">
            &mdash;&nbsp;&nbsp;{pullQuote.attribution}
          </p>
        </AnimatedReveal>
      </figure>
    </section>
  );
}
