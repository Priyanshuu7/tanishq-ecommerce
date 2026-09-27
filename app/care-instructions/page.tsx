import Footer from "components/layout/footer";
import { AnimatedReveal } from "components/motion/animated-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Instructions | Label Shivranjani Solanki",
  description:
    "How to care for your Label Shivranjani Solanki pieces — fabric care, embroidery storage, and garment maintenance guidance.",
  openGraph: {
    title: "Care Instructions | Label Shivranjani Solanki",
    description:
      "Keep your handcrafted pieces looking their best with our garment care guidance.",
    type: "website",
  },
};

export default function CareInstructionsPage() {
  return (
    <>
      <main className="layout-wide max-w-5xl mx-auto section-y">
        {/* ── Header ── */}
        <header className="text-center mb-14 md:mb-20">
          <AnimatedReveal variant="up" delay={80}>
            <h1 className="t-section">Care Instructions</h1>
          </AnimatedReveal>
          <AnimatedReveal variant="fade" delay={160}>
            <div className="mx-auto mt-6 h-px w-16 bg-accent/40" />
          </AnimatedReveal>
        </header>

        <article className="space-y-8 text-foreground/90 leading-relaxed font-sans text-base sm:text-lg">
          <AnimatedReveal variant="up" delay={120}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              The beauty of each piece lies in its details. Follow the care
              label attached to your garment to keep its fabric and finish
              looking their best.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={200}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Our colours are fixed to help prevent bleeding. For pieces with
              hand embroidery, place the garment in a thin poly bag before
              storing. This helps protect the delicate embroidery from catching
              on other garments. Keep perfume away from the fabric and
              embellishments.
            </p>
          </AnimatedReveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
