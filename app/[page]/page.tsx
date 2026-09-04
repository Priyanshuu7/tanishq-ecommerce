import type { Metadata } from "next";

import { AnimatedReveal } from "components/motion/animated-reveal";
import Prose from "components/prose";
import { getPage } from "lib/shopify";
import type { Page as ShopifyPage } from "lib/shopify/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  // Unlike getProduct / getCollections / getMenu, getPage has no `if (!endpoint)`
  // guard — it throws outright when Shopify isn't configured. Swallowing that
  // here keeps the build and the route alive before the store is connected; a
  // page that genuinely doesn't exist still 404s below.
  let page: ShopifyPage | undefined;
  try {
    page = await getPage(params.page);
  } catch {
    return {};
  }

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  // `params` is runtime data, so reading it has to happen inside a Suspense
  // boundary or the route can't be prerendered at all under
  // `cacheComponents`. Keeping the await in a child means the page frame ships
  // as static HTML and only the body streams in.
  return (
    <article className="layout-text section-y">
      <Suspense fallback={<PageSkeleton />}>
        <PageBody params={props.params} />
      </Suspense>
    </article>
  );
}

async function PageBody({ params }: { params: Promise<{ page: string }> }) {
  const { page: handle } = await params;

  let page: ShopifyPage | undefined;
  try {
    page = await getPage(handle);
  } catch {
    page = undefined;
  }

  if (!page) return notFound();

  return (
    <>
      <AnimatedReveal variant="fade">
        <p className="t-eyebrow mb-6 text-muted-foreground">Information</p>
      </AnimatedReveal>

      <div className="overflow-hidden">
        <AnimatedReveal variant="mask" as="h1" className="t-section" delay={80}>
          {page.title}
        </AnimatedReveal>
      </div>

      <div className="mt-10 h-px w-16 bg-accent" aria-hidden="true" />

      <AnimatedReveal variant="up" delay={160} className="mt-12">
        <Prose html={page.body} />
      </AnimatedReveal>

      <p className="t-caption mt-16 border-t border-border pt-6">
        {`Last updated ${new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}

/** Matches PageBody's rhythm so the stream-in doesn't shift the layout. */
function PageSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-2.5 w-24 bg-surface" />
      <div className="mt-8 h-12 w-3/4 bg-surface" />
      <div className="mt-10 h-px w-16 bg-surface-deep" />
      <div className="mt-12 space-y-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-3.5 bg-surface"
            style={{ width: `${index % 3 === 2 ? 68 : 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
