"use client";

import Price from "components/price";
import { Product } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";

export function SelectedVariantPrice({ product }: { product: Product }) {
  const searchParams = useSearchParams();

  const selectedVariant = product.variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );

  const displayPrice =
    selectedVariant?.price ?? product.priceRange.minVariantPrice;

  return (
    <Price
      className="text-base tracking-[0.1em] text-foreground"
      amount={displayPrice.amount}
      currencyCode={displayPrice.currencyCode}
    />
  );
}
