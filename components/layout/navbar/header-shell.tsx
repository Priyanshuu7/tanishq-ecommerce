"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { CloseOnNavigate } from "components/ui/close-on-navigate";
import { navigation } from "lib/editorial";
import type { Collection, Menu } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MegaMenu } from "./mega-menu";
import MobileMenu from "./mobile-menu";
import { SearchOverlay } from "./search-overlay";

/**
 * The header chrome.
 *
 * Transparency is deliberately NOT decided here. This component only reports
 * two booleans as data attributes — whether the hero has scrolled out from
 * behind the header, and whether a panel is open — and `.site-header` in
 * app/globals.css does the rest with `body:has([data-hero])`.
 *
 * Doing it that way solves three problems at once: it needs no `usePathname()`
 * (which blocks prerendering under Cache Components on dynamic routes), the
 * correct state is present in the server-rendered HTML so there's no flash of
 * the wrong colour, and it keeps working across client-side navigation because
 * the selector re-evaluates whenever the hero enters or leaves the DOM.
 *
 * All commerce data arrives as props from the server component — this file
 * fetches nothing.
 */
export function HeaderShell({
  menu,
  collections,
  cart,
  accountUrl,
}: {
  menu: Menu[];
  collections: Collection[];
  cart: ReactNode;
  accountUrl?: string;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasHero, setHasHero] = useState(true);
  const [heroType, setHeroType] = useState<string>("film");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const measure = useCallback(() => {
    const header = headerRef.current;
    const hero = document.querySelector("[data-hero]");

    if (!hero || !header) {
      setHasHero(false);
      setIsScrolled(true);
      return;
    }

    setHasHero(true);
    setHeroType(hero.getAttribute("data-hero") || "film");
    setIsScrolled(hero.getBoundingClientRect().bottom <= header.offsetHeight);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Handle route changes instantly from CloseOnNavigate
  const handleNavigate = useCallback(
    (pathname?: string) => {
      setIsMegaMenuOpen(false);

      if (pathname && pathname !== "/") {
        // Non-home content page: immediately solid, never transparent
        setHasHero(false);
        setIsScrolled(true);
      } else if (pathname === "/") {
        // Navigating back to homepage: immediately transparent over hero, then measure
        setHasHero(true);
        setIsScrolled(false);
      }

      // Re-verify after DOM updates
      requestAnimationFrame(measure);
      setTimeout(measure, 50);
      setTimeout(measure, 150);
    },
    [measure]
  );

  const isTransparent = hasHero && !isScrolled && !isMegaMenuOpen;

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 border-b"
      data-transparent={isTransparent ? "true" : "false"}
      data-scrolled={isScrolled ? "true" : "false"}
      data-menu-open={isMegaMenuOpen ? "true" : "false"}
      data-has-hero={hasHero ? "true" : "false"}
      data-hero-type={heroType}
    >
      <div className="layout-wide relative flex h-(--header-h) items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button (mobile), Brand Title (mobile), and Navigation Links (desktop) */}
        <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2 sm:gap-3 md:gap-4 lg:gap-8 ml-0 md:ml-0 lg:-ml-6 xl:-ml-16">
          <MobileMenu
            menu={menu}
            collections={collections}
            accountUrl={accountUrl}
          />

          {/* Brand Name on Mobile: Shifted to the left side beside the hamburger menu */}
          <Link
            href="/"
            aria-label="Shivranjani Solanki"
            className="site-brand-title inline-block whitespace-nowrap text-[11px] min-[360px]:text-xs min-[390px]:text-sm sm:text-base font-normal tracking-[0.14em] min-[360px]:tracking-[0.16em] sm:tracking-[0.18em] uppercase transition-opacity duration-(--duration-base) hover:opacity-80 md:hidden"
          >
            SHIVRANJANI SOLANKI
          </Link>

          <nav
            aria-label="Main"
            className="hidden items-center gap-4 md:flex lg:gap-8"
          >
            <MegaMenu
              collections={collections}
              isOpen={isMegaMenuOpen}
              onOpenChange={setIsMegaMenuOpen}
            />

            {/* The Shopify header menu, kept exactly as the store defines it. */}
            {menu.map((item: Menu) => (
              <Link
                key={item.title}
                href={item.path}
                prefetch={true}
                className="t-nav link-sweep py-2 text-xs lg:text-sm tracking-[0.14em] lg:tracking-[0.16em]"
              >
                {item.title}
              </Link>
            ))}

            {navigation.editorialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="t-nav link-sweep py-2 text-xs lg:text-sm tracking-[0.14em] lg:tracking-[0.16em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Brand Name on Desktop (Centered mathematically regardless of left/right widths) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden md:block md:max-w-md lg:max-w-xl xl:max-w-2xl">
          <Link
            href="/"
            aria-label="Shivranjani Solanki"
            className="site-brand-title pointer-events-auto inline-block whitespace-nowrap md:text-lg lg:text-2xl xl:text-[26px] font-normal md:tracking-[0.2em] lg:tracking-[0.25em] uppercase transition-opacity duration-(--duration-base) hover:opacity-80"
          >
            SHIVRANJANI SOLANKI
          </Link>
        </div>

        {/* Right Side: Search, Account & Cart with clean spacing on both mobile and desktop */}
        <div className="flex shrink-0 items-center justify-end gap-0.5 min-[360px]:gap-1 sm:gap-1.5 md:gap-2">
          <SearchOverlay />
          {accountUrl ? (
            <a
              href={accountUrl}
              aria-label="Account & Orders"
              title="Account & Orders"
              className="flex h-10 w-10 items-center justify-center transition-opacity duration-(--duration-base) hover:opacity-60"
            >
              <UserIcon className="h-[18px] w-[18px]" strokeWidth={1.2} />
            </a>
          ) : null}
          {cart}
        </div>
      </div>

      {/* Shuts the mega-menu panel and coordinates transparency on navigation. Isolated in Suspense
          because it reads useSearchParams() / usePathname(). */}
      <Suspense fallback={null}>
        <CloseOnNavigate onNavigate={handleNavigate} />
      </Suspense>
    </header>
  );
}
