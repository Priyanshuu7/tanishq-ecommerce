"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { navigation } from "lib/editorial";
import type { Collection, Menu } from "lib/shopify/types";
import Link from "next/link";
import { Fragment, Suspense, useCallback, useEffect, useState } from "react";
import { CloseOnNavigate } from "components/ui/close-on-navigate";
import Search, { SearchSkeleton } from "./search";

/**
 * Mobile navigation drawer. The desktop mega-menu's collection groups are
 * promoted to top level here rather than nested behind an accordion, so the
 * whole catalogue is one tap away.
 */
export default function MobileMenu({
  menu,
  collections,
  accountUrl,
}: {
  menu: Menu[];
  collections: Collection[];
  accountUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Closes the drawer once a link has navigated. */}
      <Suspense fallback={null}>
        <CloseOnNavigate onNavigate={closeMobileMenu} />
      </Suspense>

      <button
        onClick={openMobileMenu}
        aria-label={navigation.menuLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center transition-opacity duration-(--duration-base) hover:opacity-60 md:hidden"
      >
        <Bars3Icon className="h-5 w-5" strokeWidth={1.2} />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-60">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-foreground/30"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] duration-600"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in duration-400"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 flex w-full max-w-md flex-col bg-background">
              <div className="flex items-center justify-between border-b border-border px-(--page-gutter) py-5">
                <Dialog.Title className="t-eyebrow text-muted-foreground">
                  {navigation.menuLabel}
                </Dialog.Title>
                <button
                  onClick={closeMobileMenu}
                  aria-label={navigation.closeLabel}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.2} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-(--page-gutter) pb-14 pt-8">
                <div className="mb-10">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>

                {collections.length ? (
                  <>
                    <p className="t-eyebrow mb-5 text-muted-foreground">
                      {navigation.shopLabel}
                    </p>
                    <ul className="mb-10 flex flex-col">
                      {collections.map((collection) => (
                        <li
                          key={collection.handle || collection.path}
                          className="border-b border-border/60"
                        >
                          <Link
                            href={collection.path}
                            prefetch={true}
                            onClick={closeMobileMenu}
                            className="font-display block py-3.5 text-2xl font-light leading-tight text-foreground transition-colors duration-(--duration-base) hover:text-accent-deep"
                          >
                            {collection.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {menu.length ? (
                  <ul className="mb-10 flex flex-col gap-3">
                    {menu.map((item: Menu) => (
                      <li key={item.title}>
                        <Link
                          href={item.path}
                          prefetch={true}
                          onClick={closeMobileMenu}
                          className="t-body text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <ul className="flex flex-col gap-3">
                  {navigation.editorialLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="t-nav text-sm text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {accountUrl ? (
                  <div className="mt-8 border-t border-border/60 pt-6">
                    <a
                      href={accountUrl}
                      onClick={closeMobileMenu}
                      className="t-nav flex items-center gap-3 text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                    >
                      <UserIcon className="h-4 w-4" strokeWidth={1.2} />
                      <span>Account & Orders</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
