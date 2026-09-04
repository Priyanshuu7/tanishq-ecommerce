import { SortFilterItem } from "lib/constants";
import { Suspense } from "react";
import { FilterItem } from "./item";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

/**
 * A titled vertical list of filter rows.
 *
 * The desktop/mobile fork the template used to do here is gone: the rows now
 * live inside the filter drawer, and sort has its own popover
 * (`./dropdown.tsx`) in the listing control bar. FilterItem reads
 * `useSearchParams`, so the Suspense boundary stays.
 */
export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <nav>
      {title ? (
        <h3 className="t-eyebrow mb-4 text-muted-foreground">{title}</h3>
      ) : null}
      <ul>
        <Suspense fallback={null}>
          {list.map((item: ListItem, i) => (
            <FilterItem key={i} item={item} />
          ))}
        </Suspense>
      </ul>
    </nav>
  );
}
