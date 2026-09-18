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
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    // Browsers already coalesce scroll events to once per frame, so this reads
    // one rect per frame at worst. An extra requestAnimationFrame wrapper would
    // only add a path where a pending frame swallows later scroll events and
    // leaves the header on a stale colour.
    const measure = () => {
      const header = headerRef.current;
      // Re-queried every time rather than captured once, so this keeps working
      // when a client-side navigation swaps a hero in or out.
      const hero = document.querySelector("[data-hero]");

      if (!hero || !header) {
        setIsScrolled(window.scrollY > 24);
        return;
      }

      // The transparent state belongs to the hero, so it lasts exactly as long
      // as the hero is behind the header — solid the moment the hero's last
      // pixel passes under it, rather than after an arbitrary scroll distance.
      setIsScrolled(hero.getBoundingClientRect().bottom <= header.offsetHeight);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    // The hero is sized in svh, so its height moves when mobile browser chrome
    // collapses or the window is resized.
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Stable identity so MegaMenu's effects don't re-run on every render.
  const closeMegaMenu = useCallback(() => setIsMegaMenuOpen(false), []);

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 border-b"
      data-scrolled={isScrolled ? "true" : "false"}
      data-menu-open={isMegaMenuOpen ? "true" : "false"}
    >
      <div className="layout-wide flex h-(--header-h) items-center justify-between gap-4 md:gap-6 lg:gap-10">
        <div className="flex shrink-0 items-center gap-2 md:min-w-[180px]">
          <MobileMenu
            menu={menu}
            collections={collections}
            accountUrl={accountUrl}
          />

          <Link
            href="/"
            aria-label="Solanki Shivranjani"
            className="flex shrink-0 items-center ml-0 md:-ml-4 lg:-ml-24"
          >
            <Image
              src="/logo.png"
              alt="Solanki Shivranjani"
              width={540}
              height={200}
              priority
              className="brand-logo h-8 min-[360px]:h-9 min-[390px]:h-10 sm:h-12 md:h-16 lg:h-[68px] w-auto object-contain transition-opacity duration-(--duration-base) hover:opacity-80" />
          </Link>
        </div>

        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-center gap-8 md:flex lg:gap-10"
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
              className="t-nav link-sweep py-2"
            >
              {item.title}
            </Link>
          ))}

          {navigation.editorialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="t-nav link-sweep hidden py-2 lg:inline-block"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-0.5 min-[360px]:gap-1 md:min-w-[180px]">
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

      {/* Shuts the mega-menu panel after a navigation. Isolated in Suspense
          because it reads useSearchParams(). */}
      <Suspense fallback={null}>
        <CloseOnNavigate onNavigate={closeMegaMenu} />
      </Suspense>
    </header>
  );
}
