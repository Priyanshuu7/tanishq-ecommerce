"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { listing } from "lib/editorial";
import type { ListItem } from ".";
import { FilterItem } from "./item";

/**
 * The "Sort by" popover in the listing control bar.
 *
 * Active-item detection and the click-outside close are the template's. Two
 * presentation-layer corrections: the trigger is a real <button> rather than a
 * clickable <div>, so it is reachable by keyboard, and Escape closes the panel.
 */
export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenSelect(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={openSelect}
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        className="t-nav flex items-center gap-2.5 py-1.5 text-foreground transition-colors duration-(--duration-base) hover:text-accent-deep"
      >
        <span className="hidden text-muted-foreground sm:inline">
          {listing.sortLabel}
        </span>
        <span>{active}</span>
        <ChevronDownIcon
          strokeWidth={1.2}
          className={clsx(
            "h-3.5 w-3.5 transition-transform duration-(--duration-base) ease-[cubic-bezier(0.22,1,0.36,1)]",
            openSelect && "rotate-180",
          )}
        />
      </button>

      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="animate-drawer-in absolute right-0 top-full z-40 mt-3 w-60 border border-border bg-background px-5 py-4 shadow-[0_24px_60px_-32px_rgb(59_43_43/0.4)]"
        >
          <ul>
            {list.map((item: ListItem, i) => (
              <FilterItem key={i} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
