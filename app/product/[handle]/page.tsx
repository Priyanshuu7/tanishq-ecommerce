import Footer from "components/layout/footer";
import { AnimatedReveal } from "components/motion/animated-reveal";
import Price from "components/price";
import { Gallery } from "components/product/gallery";
import { ProductCardImage } from "components/product/product-card-image";
import { ProductDescription } from "components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { productPage } from "lib/editorial";
import { getProduct, getProductRecommendations } from "lib/shopify";
import type { Image } from "lib/shopify/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
        images: [
          {
            url,
            width,
            height,
            alt,
          },
        ],
      }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  // `params` is runtime data. Under `cacheComponents` it has to be read inside a
  // Suspense boundary or the route can't be prerendered at all, so the await and
  // the getProduct call live in ProductView below. The frame ships as static
  // HTML; the product streams into it.
  return (
    <>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductView params={props.params} />
      </Suspense>
      <Footer />
    </>
  );
}

async function ProductView({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="layout-wide section-y-sm">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16 xl:gap-24">
          <Gallery
            images={product.images.slice(0, 20).map((image: Image) => ({
              src: image.url,
              altText: image.altText,
              width: image.width,
              height: image.height,
            }))}
          />

          {/* The info column tracks the image stack rather than scrolling out
              of view with it. */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <RelatedProducts id={product.id} />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  // getProductRecommendations has no `if (!endpoint)` guard and throws when
  // Shopify isn't configured. A missing "you may also like" rail should never
  // take the product page down with it.
  let relatedProducts;
  try {
    relatedProducts = await getProductRecommendations(id);
  } catch {
    return null;
  }

  if (!relatedProducts.length) return null;

  return (
    <section className="layout-wide section-y border-t border-border">
      <AnimatedReveal variant="fade">
        <h2 className="t-eyebrow mb-10 text-muted-foreground">
          {productPage.relatedHeading}
        </h2>
      </AnimatedReveal>

      <ul className="no-scrollbar -mx-(--page-gutter) flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--page-gutter) md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
        {relatedProducts.slice(0, 4).map((product, index) => (
          <li
            key={product.handle}
            className="group/card w-[62%] flex-none snap-start sm:w-[38%] md:w-auto"
          >
            <AnimatedReveal variant="fade" delay={index * 90}>
              <Link
                className="block"
                href={`/product/${product.handle}`}
                prefetch={true}
              >
                <ProductCardImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  images={product.images}
                  hoverSrc={product.images?.[1]?.url}
                  fill
                  sizes="(min-width: 768px) 25vw, 62vw"
                />
                <div className="mt-4">
                  <h3 className="t-product-title">{product.title}</h3>
                  <Price
                    className="mt-1 text-muted-foreground"
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={
                      product.priceRange.maxVariantPrice.currencyCode
                    }
                  />
                </div>
              </Link>
            </AnimatedReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Mirrors ProductView's two-column rhythm so the stream-in doesn't reflow. */
function ProductSkeleton() {
  return (
    <div className="layout-wide section-y-sm" aria-hidden="true">
      <div className="grid animate-pulse gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16 xl:gap-24">
        <div className="aspect-[3/4] w-full bg-surface" />
        <div>
          <div className="h-2.5 w-24 bg-surface" />
          <div className="mt-6 h-10 w-4/5 bg-surface" />
          <div className="mt-6 h-4 w-28 bg-surface" />
          <div className="mt-12 h-11 w-full bg-surface" />
          <div className="mt-4 h-14 w-full bg-surface" />
        </div>
      </div>
    </div>
  );
}
