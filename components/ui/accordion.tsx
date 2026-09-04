"use client";

import clsx from "clsx";
import { useId, useState, type ReactNode } from "react";

/**
 * A single collapsible row. Items are independent — several can be open at
 * once, which is how product-detail accordions normally behave.
 *
 * The open/close transition uses the `grid-template-rows: 0fr -> 1fr`
 * technique so the panel animates to its natural height without measuring
 * anything in JavaScript. `visibility` (rather than `display` or `hidden`)
 * keeps the collapsed panel out of the tab order while still being animatable.
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((value) => !value)}
          className="t-nav flex w-full items-center justify-between gap-6 py-5 text-left text-foreground transition-colors duration-(--duration-base) hover:text-accent-deep"
        >
          <span>{title}</span>

          {/* Plus that rotates into a minus. */}
          <span
            aria-hidden="true"
            className="relative h-3 w-3 shrink-0 text-muted-foreground"
          >
            <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
            <span
              className={clsx(
                "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-(--duration-base) ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "rotate-90" : "rotate-0",
              )}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={clsx(
          "grid transition-[grid-template-rows] duration-(--duration-base) ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div
          className={clsx(
            "overflow-hidden transition-[opacity,visibility] duration-(--duration-base)",
            isOpen ? "visible opacity-100" : "invisible opacity-0",
          )}
        >
          <div className="t-body pb-7 text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Convenience wrapper for a stack of accordion rows. */
export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-border">{children}</div>;
}
