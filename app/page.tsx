import { CategoryCarousel } from "components/home/category-carousel";
import { FilmGrid } from "components/home/film-grid";
import { FullBleedBanner } from "components/home/full-bleed-banner";
import { Hero } from "components/home/hero";
import { PullQuote } from "components/home/pull-quote";
import Footer from "components/layout/footer";
import { EditorialSection } from "components/ui/editorial-section";
import { craftStatement, signatureStatement } from "lib/editorial";

export const metadata = {
  description:
    "Hand-finished occasion wear — drape, embroidery and made-to-order couture.",
  openGraph: {
    type: "website",
  },
};

/**
 * Homepage rhythm: film, then quiet text, then film again, then the commerce
 * modules. Every product module here either renders real Shopify data or
 * returns null — nothing is padded out with placeholder products.
 *
 * The three film sections (Hero, FilmGrid, FullBleedBanner) read their video
 * from lib/editorial.ts rather than Shopify, and each hides or falls back on
 * its own when no film is configured.
 *
 * All the Shopify calls below are `"use cache"` inside lib/shopify, so no
 * Suspense boundary is required for them under Cache Components.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <EditorialSection statement={signatureStatement} />
      <FilmGrid />
      <CategoryCarousel />
      <EditorialSection statement={craftStatement} />
      {/* <Carousel /> */}
      <PullQuote />
      <FullBleedBanner />
      <Footer />
    </>
  );
}
