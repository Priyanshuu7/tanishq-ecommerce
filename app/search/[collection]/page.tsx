import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { EmptyState } from "components/layout/search/empty-state";
import { ListingHeader } from "components/layout/search/listing-header";
import { defaultSort, sorting } from "lib/constants";
import { listing } from "lib/editorial";
import type { Collection } from "lib/shopify/types";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  // getCollection throws when Shopify isn't configured, unlike its sibling
  // getCollections. Swallowing that keeps the route renderable before the store
  // is connected; a collection that genuinely doesn't exist still 404s.
  let collection: Collection | undefined;
  try {
    collection = await getCollection(params.collection);
  } catch {
    return {};
  }

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetched in parallel: the title comes from the collection, the grid from its
  // products, and neither depends on the other.
  const [collection, products] = await Promise.all([
    getCollection(params.collection).catch(() => undefined),
    getCollectionProducts({
      collection: params.collection,
      sortKey,
      reverse,
    }),
  ]);

  const resultsText = products.length === 1 ? "piece" : "pieces";

  return (
    <section>
      <ListingHeader
        eyebrow={listing.collectionEyebrow}
        // The reference presents collections by name only — the Shopify
        // description is deliberately not printed here.
        title={collection?.title ?? listing.allTitle}
        meta={products.length ? `${products.length} ${resultsText}` : undefined}
      />

      {products.length > 0 ? (
        <Grid className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <EmptyState
          heading={listing.emptyHeading}
          body={listing.emptyBody}
          cta={listing.emptyCta}
        />
      )}
    </section>
  );
}
