import Footer from "components/layout/footer";
import { AnimatedReveal } from "components/motion/animated-reveal";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Label Shivranjani Solanki",
  description:
    "Label Shivranjani Solanki is a luxury fashion house where heritage craftsmanship meets modern elegance. Rooted in a deep appreciation for tradition, intricate hand embroidery, and timeless artistry.",
  openGraph: {
    title: "About Us | Label Shivranjani Solanki",
    description:
      "A luxury fashion house where heritage craftsmanship meets modern elegance.",
    type: "website",
  },
};

export default function AboutUsPage() {
  return (
    <>
      <main className="layout-wide max-w-5xl mx-auto section-y">
        <header className="text-center mb-14 md:mb-20">
          {/* <AnimatedReveal variant="fade">
            <p className="t-eyebrow mb-4 text-lg sm:text-xl text-accent">About Us</p>
          </AnimatedReveal> */}

          <AnimatedReveal variant="up" delay={80}>
            <h1 className="t-section">
              Turning Traditions Into Confidence
            </h1>
          </AnimatedReveal>

          <AnimatedReveal variant="fade" delay={160}>
            <div className="mx-auto mt-6 h-px w-16 bg-accent/40" />
          </AnimatedReveal>
        </header>

        <article className="space-y-8 text-foreground/90 leading-relaxed font-sans text-base sm:text-lg">
          <AnimatedReveal variant="up" delay={120}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              <strong className="font-normal text-foreground">Label Shivranjani Solanki</strong> is a
              luxury fashion house where heritage craftsmanship meets modern
              elegance. Rooted in a deep appreciation for tradition, every
              creation is thoughtfully designed with intricate hand embroidery,
              refined detailing, and a commitment to timeless artistry.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={180}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              The label was born from the values I grew up with. My father, a
              businessman with no background in fashion, shaped my understanding
              of dedication, discipline, patience, and excellence. He built
              everything on his own, with a sharp eye for quality and an
              instinct for choosing the finest materials. That sense of
              discernment became a part of me.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={240}>
            <div className="my-10 border-l-2 border-accent/70 pl-6 sm:pl-8 py-3 bg-surface/50">
              <blockquote className="font-display text-lg sm:text-xl text-foreground  leading-relaxed">
                &ldquo;As a child, I would wander through luxury stores, running
                my fingers over beautiful fabrics, quietly observing their
                textures, construction, and craftsmanship. I didn&apos;t simply
                see garments{" "}
                <span className="font-normal not-italic text-accent-deep">
                  I saw the hands, patience, and artistry behind them.
                </span>{" "}
                Even then, I knew that one day I would create a space of my
                own.&rdquo;
              </blockquote>
            </div>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={280}>
            <p className="font-display text-2xl sm:text-3xl text-foreground font-light tracking-wide my-6">
              Today, that dream has become{" "}
              <span className="text-accent-deep font-normal">
                Label Shivranjani Solanki
              </span>
              .
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={320}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Every piece is more than a garment; it is a narrative of skilled
              hands, patient craftsmanship, and a vision brought to life through
              fabric and form. Inspired by the richness of Indian textiles and
              the quiet power of minimal design, the label balances opulence
              with restraint, creating silhouettes that feel distinctive yet
              enduring.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={360}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Designed for the woman who values individuality and effortless
              grace,{" "}
              <strong className="font-medium text-foreground">
                Label Shivranjani Solanki celebrates confidence in its purest form
                subtle, strong, and unapologetically authentic.
              </strong>{" "}
              Each collection is an exploration of mood, texture, and emotion,
              where every detail is intentional and every piece is meant to be
              felt, not simply worn.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="fade" delay={400}>
            <div className="mt-16 p-8 sm:p-12 text-center bg-surface border border-border">
              <p className="t-eyebrow text-accent mb-4">A Legacy</p>
              <p className="font-display text-xl sm:text-2xl text-foreground leading-relaxed ">
                &ldquo;It is a reflection of my father's values,
                <br />
                and my way of making him proud.&rdquo;
              </p>

              <p className="t-caption text-muted-foreground mt-4 tracking-[0.2em] uppercase">
                &mdash;&nbsp;Shivranjani Solanki
              </p>
            </div>
          </AnimatedReveal>

          <AnimatedReveal variant="fade" delay={450}>
            <div className="mt-14 pt-8 text-center border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/search" className="btn btn-primary">
                Explore The Collections
              </Link>
            </div>
          </AnimatedReveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
