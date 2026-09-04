import Footer from "components/layout/footer";
import { Suspense } from "react";
import ChildrenWrapper from "./children-wrapper";

/**
 * Listing shell. The template's three-column sidebar layout is gone: filters
 * now live in a drawer and sort in a popover, both inside the control bar that
 * ListingHeader renders, so the grid gets the full page width.
 *
 * The Suspense boundary is load-bearing — the pages inside read `searchParams`,
 * which can't be prerendered, and ChildrenWrapper reads `useSearchParams`.
 */
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="layout-wide section-y-sm min-h-[70svh]">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
