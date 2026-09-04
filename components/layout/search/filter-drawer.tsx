"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CloseOnNavigate } from "components/ui/close-on-navigate";
import { listing } from "lib/editorial";
import {
  Fragment,
  Suspense,
  useCallback,
  useState,
  type ReactNode,
} from "react";

/**
 * The "Filter" drawer in the listing control bar.
 *
 * Its contents arrive as a `ReactNode` prop so the collection list can stay an
 * async server component — the same pattern the navbar uses to pass the cart
 * into the client-side header shell. Nothing is fetched here.
 *
 * Note on scope: the only facet this store exposes without new Shopify filter
 * queries is the collection list, so that is what the drawer holds. Gender /
 * size / price facets would need changes to the protected GraphQL layer.
 */
export function FilterDrawer({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* Choosing a collection navigates, which should also dismiss the panel. */}
      <Suspense fallback={null}>
        <CloseOnNavigate onNavigate={close} />
      </Suspense>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="t-nav flex items-center gap-2.5 py-1.5 text-foreground transition-colors duration-(--duration-base) hover:text-accent-deep"
      >
        <AdjustmentsHorizontalIcon className="h-4 w-4" strokeWidth={1.2} />
        {listing.filterLabel}
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
              className="fixed inset-0 bg-foreground/25 backdrop-blur-[2px]"
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
            <Dialog.Panel className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-background">
              <div className="flex items-center justify-between border-b border-border px-(--page-gutter) py-5">
                <Dialog.Title className="t-eyebrow text-muted-foreground">
                  {listing.filterPanelTitle}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.2} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-(--page-gutter) py-8">
                {children}
              </div>

              <div className="border-t border-border px-(--page-gutter) py-5">
                <button
                  type="button"
                  onClick={close}
                  className="btn btn-filled w-full"
                >
                  {listing.applyLabel}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
