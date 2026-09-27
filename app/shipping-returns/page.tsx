import Footer from "components/layout/footer";
import { AnimatedReveal } from "components/motion/animated-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns | Label Shivranjani Solanki",
  description:
    "Learn about our shipping, delivery timelines, refund policy, and exchange conditions for Label Shivranjani Solanki pieces.",
  openGraph: {
    title: "Shipping & Returns | Label Shivranjani Solanki",
    description:
      "Shipping timelines, return conditions, and exchange policy for our made-to-order pieces.",
    type: "website",
  },
};

export default function ShippingReturnsPage() {
  return (
    <>
      <main className="layout-wide max-w-5xl mx-auto section-y">
        <header className="text-center mb-14 md:mb-20">
          <AnimatedReveal variant="up" delay={80}>
            <h1 className="t-section">Shipping and  Returns</h1>
          </AnimatedReveal>

          <AnimatedReveal variant="fade" delay={160}>
            <div className="mx-auto mt-6 h-px w-16 bg-accent/40" />
          </AnimatedReveal>
        </header>

        <article className="space-y-8 text-foreground/90 leading-relaxed font-sans text-base sm:text-lg">
          {/* ── Shipping & Delivery ── */}
          <AnimatedReveal variant="up" delay={120}>
            <p className="font-display text-2xl sm:text-3xl text-foreground font-light tracking-wide">
              Shipping and{" "}
              <span className="text-accent-deep font-normal">Delivery</span>
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={160}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Each{" "}
              <strong className="font-normal text-foreground">
                Label Shivranjani Solanki
              </strong>{" "}
              piece is prepared with care for the person who will wear it. After
              you place your order, our team may contact you to confirm any
              additional measurements or details.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={200}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Your order is expected to be delivered within{" "}
              <strong className="font-medium text-foreground">
                21 days of measurement confirmation
              </strong>
              . Once it is dispatched, we will share the tracking details with
              you. If a delay arises, our team will keep you informed.
            </p>
          </AnimatedReveal>

          {/* Divider */}
          <AnimatedReveal variant="fade" delay={240}>
            <div className="my-10 h-px w-full bg-border" />
          </AnimatedReveal>

          {/* ── Refunds & Returns ── */}
          <AnimatedReveal variant="up" delay={260}>
            <p className="font-display text-2xl sm:text-3xl text-foreground font-light tracking-wide">
              Refunds and{" "}
              <span className="text-accent-deep font-normal">Returns</span>
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={300}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Since we operate on a make-to-order model, we do not accept
              returns or exchanges once an order is placed. Our talented
              craftsmen begin handcrafting each outfit immediately after your
              order is received.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={340}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              However, products from{" "}
              <strong className="font-medium text-foreground">
                Label Shivranjani Solanki
              </strong>{" "}
              can only be returned or exchanged under the following conditions
              and using a credit note:
            </p>
          </AnimatedReveal>

          {/* ── Condition cards ── */}
          <AnimatedReveal variant="up" delay={380}>
            <div className="space-y-6 mt-2">

              {/* Damaged Pieces */}
              <div className="p-6 sm:p-8 bg-surface border border-border">
                <p className="t-eyebrow text-accent mb-3">Damaged Pieces</p>
                <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
                  Every item is carefully inspected before leaving our shop. If
                  you believe your item is damaged, please notify us{" "}
                  <strong className="font-medium text-foreground">
                    within 7 days of delivery
                  </strong>
                  . Unfortunately, returns cannot be accepted for issues related
                  to handwork, color, or design.
                </p>
              </div>

              {/* Wrong Items */}
              <div className="p-6 sm:p-8 bg-surface border border-border">
                <p className="t-eyebrow text-accent mb-3">Wrong Items</p>
                <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
                  If you receive an item that differs from your original order,
                  please contact us with your order number and name. We will
                  promptly ship the correct item once we receive the incorrectly
                  sent merchandise in its original condition and packaging.
                </p>
              </div>

              {/* Refund */}
              <div className="p-6 sm:p-8 bg-surface border border-border">
                <p className="t-eyebrow text-accent mb-3">Refund</p>
                <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
                  As such, all sales are final, and we do not offer refunds. We
                  encourage you to thoroughly review your order details,
                  including product descriptions, sizes, and customisation
                  options, before completing your purchase.
                </p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Divider */}
          <AnimatedReveal variant="fade" delay={420}>
            <div className="my-10 h-px w-full bg-border" />
          </AnimatedReveal>

          {/* ── Returns & Exchanges ── */}
          <AnimatedReveal variant="up" delay={440}>
            <p className="font-display text-2xl sm:text-3xl text-foreground font-light tracking-wide">
              Returns and{" "}
              <span className="text-accent-deep font-normal">Exchanges</span>
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={480}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              Please note, we do not accept returns. Exchanges are permitted
              only for{" "}
              <strong className="font-medium text-foreground">
                one size up or down
              </strong>
              . If you wish to exchange, please reach out to us, and we&apos;ll
              arrange a complimentary pick-up only in case of damaged or wrong
              products.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={520}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              If there&apos;s damage, please notify us within{" "}
              <strong className="font-medium text-foreground">
                7 days of receiving your product
              </strong>
              . We recommend documenting or photographing the item while
              unpacking.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={540}>
            <div className="my-10 border-l-2 border-accent/70 pl-6 sm:pl-8 py-3 bg-surface/50">
              <blockquote className="font-display text-lg sm:text-xl text-foreground leading-relaxed">
                The exchanged item will undergo quality inspection upon its
                return. Once approved by our QC team, your new product will be
                delivered within{" "}
                <span className="font-normal not-italic text-accent-deep">
                  20 days
                </span>
                . All exchanged items must be in their original condition.
              </blockquote>
            </div>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={560}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              If an order is cancelled, Label Shivranjani Solanki is not responsible for
              shipping or insurance charges. Returned items for exchange must
              include all original labels, tags, and packaging. If any packaging
              is missing, Label Shivranjani Solanki reserves the right to deny the return
              or exchange.
            </p>
          </AnimatedReveal>

          <AnimatedReveal variant="up" delay={580}>
            <p className="t-editorial text-xl sm:text-2xl font-light text-foreground leading-relaxed">
              If you need to change your order, please contact us as soon as
              possible. While we&apos;ll do our best to accommodate your
              request, we cannot guarantee modifications once an order has been
              placed.
            </p>
          </AnimatedReveal>

          {/* ── Closing callout ── */}
          <AnimatedReveal variant="fade" delay={620}>
            <div className="mt-16 p-8 sm:p-12 text-center bg-surface border border-border">
              <p className="t-eyebrow text-accent mb-4">Need Help?</p>
              <p className="font-display text-xl sm:text-2xl text-foreground leading-relaxed">
                &ldquo;We are here to make your experience as seamless as
                possible.&rdquo;
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
