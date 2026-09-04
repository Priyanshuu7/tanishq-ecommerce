"use client";

import clsx from "clsx";
import { navigation } from "lib/editorial";
import type { Collection } from "lib/shopify/types";
import Link from "next/link";
import { useEffect, useRef } from "react";

/** Split a flat list into at most `count` roughly even columns. */
function toColumns<T>(items: T[], count: number): T[][] {
  if (!items.length) return [];
  const perColumn = Math.ceil(items.length / count);
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += perColumn) {
    columns.push(items.slice(i, i + perColumn));
  }
  return columns;
}

/**
 * Desktop "Shop" dropdown. Every link is a real Shopify collection from
 * getCollections() — nothing here is hardcoded merchandising.
 *
 * Controlled by the header shell, which needs to know when the panel is open
 * so it can drop out of its transparent state over the hero. The shell also
 * owns close-on-navigate, so this file needs no router hooks.
 *
 * Opens on hover and on click/Enter; closes on Escape and when focus leaves the
 * wrapper, so it works by keyboard as well as pointer.
 */
export function MegaMenu({
  collections,
  isOpen,
  onOpenChange,
}: {
  collections: Collection[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // A short grace period stops the panel flickering shut when the pointer
  // crosses the gap between the trigger and the panel.
  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    onOpenChange(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => onOpenChange(false), 140);
  };

  if (!collections.length) return null;

  const columns = toColumns(collections, 3);

  return (
    <div
      ref={wrapperRef}
      className="hidden md:block"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
          onOpenChange(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mega-menu-panel"
        onClick={() => onOpenChange(!isOpen)}
        data-active={isOpen ? "true" : undefined}
        className="t-nav link-sweep py-2"
      >
        {navigation.shopLabel}
      </button>

      <div
        id="mega-menu-panel"
        // Kept mounted so the links stay crawlable and the panel has something
        // to transition; made inert with pointer-events and tabIndex when shut.
        className={clsx(
          "absolute inset-x-0 top-full border-b border-border bg-background text-foreground",
          "transition-[opacity,transform] duration-(--duration-base) ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <div className="layout-wide grid gap-x-12 gap-y-10 py-12 lg:grid-cols-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex}>
              <p
                className={clsx(
                  "t-eyebrow mb-6 text-muted-foreground",
                  columnIndex !== 0 && "opacity-0",
                )}
                aria-hidden={columnIndex !== 0}
              >
                {navigation.shopLabel}
              </p>
              <ul className="flex flex-col gap-3.5">
                {column.map((collection) => (
                  <li key={collection.handle || collection.path}>
                    <Link
                      href={collection.path}
                      prefetch={true}
                      tabIndex={isOpen ? undefined : -1}
                      className="font-display text-lg font-light leading-none transition-colors duration-(--duration-base) hover:text-accent-deep"
                    >
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="t-eyebrow mb-6 text-muted-foreground">The House</p>
            <ul className="flex flex-col gap-3.5">
              {navigation.editorialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    tabIndex={isOpen ? undefined : -1}
                    className="t-body text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
