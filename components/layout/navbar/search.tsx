"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { navigation } from "lib/editorial";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

/**
 * Search field. Still a `next/form`, so it submits to /search as a plain GET
 * even before hydration — do not swap this for an onSubmit handler.
 */
export default function Search({
  size = "inline",
  autoFocus = false,
}: {
  size?: "inline" | "overlay";
  autoFocus?: boolean;
}) {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-full">
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder={navigation.searchPlaceholder}
        aria-label={navigation.searchLabel}
        autoComplete="off"
        autoFocus={autoFocus}
        defaultValue={searchParams?.get("q") || ""}
        className={clsx(
          "w-full border-0 border-b border-border bg-transparent pr-10 text-foreground placeholder:text-subtle focus:border-accent focus:outline-hidden focus-visible:ring-0",
          "transition-colors duration-(--duration-base)",
          {
            "t-nav py-3 tracking-[0.1em] normal-case": size === "inline",
            "font-display py-5 text-2xl font-light md:text-4xl":
              size === "overlay",
          },
        )}
      />
      <button
        type="submit"
        aria-label={navigation.searchLabel}
        className="absolute right-0 top-0 flex h-full items-center text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
      >
        <MagnifyingGlassIcon
          className={size === "overlay" ? "h-6 w-6" : "h-4 w-4"}
        />
      </button>
    </Form>
  );
}

export function SearchSkeleton({
  size = "inline",
}: {
  size?: "inline" | "overlay";
}) {
  return (
    <form className="relative w-full">
      <input
        placeholder={navigation.searchPlaceholder}
        className={clsx(
          "w-full border-0 border-b border-border bg-transparent pr-10 text-foreground placeholder:text-subtle",
          {
            "t-nav py-3 tracking-[0.1em] normal-case": size === "inline",
            "font-display py-5 text-2xl font-light md:text-4xl":
              size === "overlay",
          },
        )}
      />
      <div className="absolute right-0 top-0 flex h-full items-center text-muted-foreground">
        <MagnifyingGlassIcon
          className={size === "overlay" ? "h-6 w-6" : "h-4 w-4"}
        />
      </div>
    </form>
  );
}
