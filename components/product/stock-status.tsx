"use client";

import { getVariantStockAction } from "components/cart/actions";
import { ProductVariant } from "lib/shopify/types";
import { setKnownStock, useKnownStock } from "lib/stock-store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function StockStatus({ variants }: { variants: ProductVariant[] }) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const selectedVariant =
    variants.find((variant) =>
      variant.selectedOptions.every(
        (option) =>
          option.value === searchParams.get(option.name.toLowerCase()),
      ),
    ) ?? (variants.length === 1 ? variants[0] : undefined);

  const knownStock = useKnownStock(selectedVariant?.id);

  useEffect(() => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    if (knownStock !== undefined) return;

    let isMounted = true;
    setIsLoading(true);

    getVariantStockAction(selectedVariant.id)
      .then((qty) => {
        if (isMounted && qty !== null) {
          setKnownStock(selectedVariant.id, qty);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedVariant?.id, selectedVariant?.availableForSale, knownStock]);

  if (!selectedVariant) return null;

  if (!selectedVariant.availableForSale) {
    return (
      <div className="-mt-3 mb-6 flex items-center gap-2 text-xs font-medium tracking-wide text-accent-deep">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-deep" />
        Sold out
      </div>
    );
  }

  if (knownStock !== undefined) {
    if (knownStock <= 5) {
      return (
        <div className="-mt-3 mb-6 flex items-center gap-2.5 text-xs font-medium tracking-wide text-accent-deep">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-deep opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-deep" />
          </span>
          Only {knownStock} left in stock — order soon
        </div>
      );
    }

    return (
      <div className="-mt-3 mb-6 flex items-center gap-2 text-xs text-muted-foreground tracking-wide">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-700/70" />
        In stock ({knownStock} available)
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="-mt-3 mb-6 flex items-center gap-2 text-xs text-muted-foreground/60 animate-pulse">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        Checking stock availability...
      </div>
    );
  }

  return null;
}
