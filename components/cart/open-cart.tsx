import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

/**
 * Cart trigger. Inherits `currentColor` from the header so it stays legible
 * both over hero imagery and against the bone ground.
 */
export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center transition-opacity duration-(--duration-base) hover:opacity-60">
      <ShoppingBagIcon
        strokeWidth={1.2}
        className={clsx("h-[18px] w-[18px]", className)}
      />

      {quantity ? (
        <span className="absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-sans text-[9px] font-normal leading-none tracking-normal text-on-media">
          {quantity}
        </span>
      ) : null}
    </div>
  );
}
