"use client";

import clsx from "clsx";
import type { SortFilterItem } from "lib/constants";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListItem, PathFilterItem } from ".";

/**
 * A single filter row. The URL construction in both variants — including
 * dropping `q` when switching collection and preserving it when switching sort,
 * and swapping the anchor for a plain <p> once active — is the template's,
 * unchanged. Only the classes are new.
 */
const rowClassName =
  "t-body block w-full py-2.5 transition-colors duration-(--duration-base)";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");

  return (
    <li className="border-b border-border/60" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        aria-current={active ? "page" : undefined}
        className={clsx(rowClassName, {
          "text-accent-deep": active,
          "text-muted-foreground hover:text-foreground": !active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  );
  const DynamicTag = active ? "p" : Link;

  return (
    <li key={item.title}>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        aria-current={active ? "true" : undefined}
        className={clsx(rowClassName, {
          "text-accent-deep": active,
          "text-muted-foreground hover:text-foreground": !active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
