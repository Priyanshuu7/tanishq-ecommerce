import { sorting } from "lib/constants";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { Suspense, type ReactNode } from "react";
import Collections from "./collections";
import FilterItemDropdown from "./filter/dropdown";
import { FilterDrawer } from "./filter-drawer";

/**
 * Shared masthead for both listing routes: title, optional result count, and
 * the Filter / Sort control bar between two hairlines.
 *
 * Both /search and /search/[collection] render this so the bar can't drift
 * between them. The title has to come from the page — one has a collection to
 * name, the other has a query.
 */
export function ListingHeader({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-12 md:mb-16">
      <AnimatedReveal variant="fade">
        <p className="t-eyebrow text-muted-foreground">{eyebrow}</p>
      </AnimatedReveal>

      <div className="overflow-hidden">
        <AnimatedReveal
          variant="mask"
          as="h1"
          className="t-section mt-3"
          delay={80}
        >
          {title}
        </AnimatedReveal>
      </div>

      {meta ? <div className="t-caption mt-4">{meta}</div> : null}

      <div className="mt-10 flex items-center justify-between gap-4 border-y border-border py-3.5">
        <FilterDrawer>
          <Collections />
        </FilterDrawer>

        {/* Reads useSearchParams to mark the active sort. */}
        <Suspense fallback={null}>
          <FilterItemDropdown list={sorting} />
        </Suspense>
      </div>
    </header>
  );
}
