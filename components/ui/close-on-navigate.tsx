"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Calls `onNavigate` whenever the route or query string changes — used to shut
 * the search overlay, the mobile drawer, the mega-menu panel and the filter
 * drawer once a link has actually navigated.
 *
 * This exists as its own component purely to contain `useSearchParams()`.
 * That hook blocks prerendering under Cache Components, so it has to sit inside
 * a `<Suspense>` boundary; isolating it here keeps the surrounding chrome
 * (the search, menu and filter buttons) in the static shell instead of dropping
 * it into the fallback.
 *
 * `onNavigate` must be referentially stable — wrap it in `useCallback`.
 */
export function CloseOnNavigate({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onNavigate();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, onNavigate]);

  return null;
}
