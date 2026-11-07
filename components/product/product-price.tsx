import clsx from "clsx";
import { festiveSale, isFestiveSaleActive } from "lib/editorial";

export function formatPrice(
  amount: string | number,
  currencyCode: string = "INR",
) {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(numericAmount);
}

export type ProductPriceProps = {
  amount: string;
  originalAmount?: string;
  currencyCode: string;
  className?: string;
  currencyCodeClassName?: string;
  showBadge?: boolean;
  size?: "sm" | "base" | "lg";
};

/**
 * Renders product prices with support for:
 * - Festive sale automatic discount (with strikethrough original price & 35% OFF badge)
 * - Shopify compare-at price when present
 * - Normal clean price when no sale is active
 */
export function ProductPrice({
  amount,
  originalAmount,
  currencyCode = "INR",
  className,
  currencyCodeClassName,
  showBadge = true,
  size = "base",
}: ProductPriceProps) {
  const isSaleActive = isFestiveSaleActive();

  let originalPrice = originalAmount
    ? parseFloat(originalAmount)
    : parseFloat(amount);
  let salePrice = parseFloat(amount);
  let discountPercent = festiveSale.discountPercent;
  let isOnSale = false;

  if (originalAmount && originalPrice > salePrice) {
    // Explicit compare-at price from Shopify
    isOnSale = true;
    discountPercent = Math.round(
      ((originalPrice - salePrice) / originalPrice) * 100,
    );
  } else if (isSaleActive && !isNaN(parseFloat(amount))) {
    // Festive sale automatic calculation
    isOnSale = true;
    originalPrice = parseFloat(amount);
    salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
  }

  if (!isOnSale) {
    return (
      <p suppressHydrationWarning className={clsx("t-price", className)}>
        {formatPrice(amount, currencyCode)}
        <span
          className={clsx(
            "ml-1.5 inline text-[0.9em] opacity-60",
            currencyCodeClassName,
          )}
        >
          {currencyCode}
        </span>
      </p>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className={clsx("flex flex-wrap items-baseline gap-2", className)}
    >
      {/* Current Discounted Sale Price */}
      <span
        className={clsx(
          "font-sans font-medium text-foreground tracking-[0.04em]",
          size === "lg"
            ? "text-lg sm:text-xl font-semibold"
            : size === "sm"
              ? "text-xs sm:text-sm"
              : "text-sm sm:text-base",
        )}
      >
        {formatPrice(salePrice, currencyCode)}
      </span>

      {/* Strikethrough Original MRP */}
      <span
        className={clsx(
          "font-sans text-muted-foreground/70 line-through decoration-muted-foreground/50 tracking-wider",
          size === "lg"
            ? "text-sm sm:text-base"
            : size === "sm"
              ? "text-[11px] sm:text-xs"
              : "text-xs sm:text-[13px]",
        )}
      >
        {formatPrice(originalPrice, currencyCode)}
      </span>

      {/* Currency Code */}
      <span
        className={clsx(
          "inline text-[0.85em] text-muted-foreground/60 opacity-60",
          currencyCodeClassName,
        )}
      >
        {currencyCode}
      </span>

      {/* Festive Sale Badge */}
      {showBadge ? (
        <span className="inline-flex items-center rounded-full bg-[#c1995e]/15 px-2 py-0.5 font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#9a7032]">
          {discountPercent}% OFF
        </span>
      ) : null}
    </div>
  );
}
