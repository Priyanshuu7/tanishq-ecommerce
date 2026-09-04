import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { EmptyState } from "components/layout/search/empty-state";
import { ListingHeader } from "components/layout/search/listing-header";
import { defaultSort, sorting } from "lib/constants";
import { listing } from "lib/editorial";
import { getProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // getProducts has no `if (!endpoint)` guard and throws when Shopify isn't
  // configured or unreachable. Catching it here turns a 500 into the designed
  // empty state below.
  let products: Product[];
  try {
    products = await getProducts({ sortKey, reverse, query: searchValue });
  } catch {
    products = [];
  }

  const resultsText = products.length === 1 ? "result" : "results";

  return (
    <>
      <ListingHeader
        eyebrow={listing.searchEyebrow}
        title={searchValue ? `“${searchValue}”` : listing.allTitle}
        meta={products.length ? `${products.length} ${resultsText}` : undefined}
      />

      {products.length > 0 ? (
        <Grid className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <EmptyState
          heading={
            searchValue ? listing.searchEmptyHeading : listing.emptyHeading
          }
          body={searchValue ? listing.searchEmptyBody : listing.emptyBody}
          cta={searchValue ? listing.emptyCta : undefined}
        />
      )}
    </>
  );
}
