"use client";

import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { navigation } from "lib/editorial";
import { Fragment, Suspense, useCallback, useState } from "react";
import { CloseOnNavigate } from "components/ui/close-on-navigate";
import Search, { SearchSkeleton } from "./search";

/**
 * Search icon that expands into a full-width overlay.
 *
 * Headless UI's Dialog is already a dependency and gives focus trapping,
 * Escape-to-close and scroll locking, so keyboard behaviour is correct without
 * hand-rolling any of it.
 */
export function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Closes the overlay once a search has actually navigated. */}
      <Suspense fallback={null}>
        <CloseOnNavigate onNavigate={close} />
      </Suspense>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={navigation.searchLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex h-10 w-10 items-center justify-center transition-opacity duration-(--duration-base) hover:opacity-60"
      >
        <MagnifyingGlassIcon className="h-[18px] w-[18px]" strokeWidth={1.2} />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={close} className="relative z-60">
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
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition-transform ease-in duration-400"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <Dialog.Panel className="fixed inset-x-0 top-0 border-b border-border bg-background">
              <div className="layout-wide flex min-h-(--header-h) items-center justify-end py-4">
                <button
                  type="button"
                  onClick={close}
                  aria-label={navigation.closeLabel}
                  className="t-nav flex items-center gap-2 text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                >
                  {navigation.closeLabel}
                  <XMarkIcon className="h-4 w-4" strokeWidth={1.2} />
                </button>
              </div>

              <div className="layout-wide pb-14 pt-2">
                <Dialog.Title className="t-eyebrow mb-6 text-muted-foreground">
                  {navigation.searchLabel}
                </Dialog.Title>
                <Suspense fallback={<SearchSkeleton size="overlay" />}>
                  <Search size="overlay" autoFocus />
                </Suspense>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
