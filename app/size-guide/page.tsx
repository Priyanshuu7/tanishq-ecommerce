import Footer from "components/layout/footer";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { SizeGuideTabs } from "components/product/size-guide-tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide | Label Shivranjani Solanki",
  description:
    "Find your perfect fit with our women's size chart, body measurement guide, and how-to-measure video from Label Shivranjani Solanki.",
  openGraph: {
    title: "Size Guide | Label Shivranjani Solanki",
    description:
      "Women's size chart, measuring guide, and fit advice for our made-to-order pieces.",
    type: "website",
  },
};

export default function SizeGuidePage() {
  return (
    <>
      <main className="layout-wide max-w-5xl mx-auto section-y">
        {/* ── Header ── */}
        <header className="text-center mb-14 md:mb-20">
          <AnimatedReveal variant="up" delay={80}>
            <h1 className="t-section">Size Guide</h1>
          </AnimatedReveal>
          <AnimatedReveal variant="fade" delay={160}>
            <div className="mx-auto mt-6 h-px w-16 bg-accent/40" />
          </AnimatedReveal>
        </header>

        <article className="space-y-8 text-foreground/90 leading-relaxed font-sans text-base sm:text-lg">
          {/* Intro */}
          <AnimatedReveal variant="up" delay={120}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Finding your perfect fit is at the heart of what we do. Use the
              guide below to discover your size across our collections. Every
              garment is made to order — if you are between sizes, our team is
              happy to advise.
            </p>
          </AnimatedReveal>

          {/* Shared tab UI — full-page mode (compact=false by default) */}
          <AnimatedReveal variant="up" delay={200}>
            <div className="border border-border bg-surface/30">
              <SizeGuideTabs />
            </div>
          </AnimatedReveal>

          {/* ── Closing callout ── */}
          <AnimatedReveal variant="fade" delay={300}>
            <div className="mt-10 p-8 sm:p-12 text-center bg-surface border border-border">
              <p className="t-eyebrow text-accent mb-4">Need Help?</p>
              <p className="font-display text-xl sm:text-2xl text-foreground leading-relaxed">
                &ldquo;Our team is always happy to guide you to your perfect
                fit.&rdquo;
              </p>
              <p className="t-caption text-muted-foreground mt-4 tracking-[0.2em] uppercase">
                &mdash;&nbsp;Shivranjanisolankii@gmail.com
              </p>
            </div>
          </AnimatedReveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
