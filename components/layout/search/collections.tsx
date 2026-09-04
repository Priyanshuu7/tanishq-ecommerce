import clsx from "clsx";
import { Suspense } from "react";

import { listing } from "lib/editorial";
import { getCollections } from "lib/shopify";
import FilterList from "./filter";

async function CollectionList() {
  const collections = await getCollections();

  if (!collections.length) return null;

  return <FilterList list={collections} title={listing.collectionsLabel} />;
}

const skeleton = "mb-3 h-3.5 animate-pulse";

/** Real Shopify collections, rendered inside the filter drawer. */
export default function Collections() {
  return (
    <Suspense
      fallback={
        <div aria-hidden="true">
          <div className={clsx(skeleton, "w-24 bg-surface-deep")} />
          <div className="mt-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={clsx(skeleton, "bg-surface")}
                style={{ width: `${index % 3 === 1 ? 62 : 84}%` }}
              />
            ))}
          </div>
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
