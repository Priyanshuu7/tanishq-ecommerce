"use client";

import { ProductPrice } from "components/product/product-price";
import { festiveSale, isFestiveSaleActive } from "lib/editorial";
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
    <div className="flex flex-col gap-1.5">
      <ProductPrice
        size="lg"
        amount={displayPrice.amount}
        currencyCode={displayPrice.currencyCode}
      />
      {isFestiveSaleActive() ? (
        <p className="font-sans text-xs tracking-wide text-[#9a7032]">
           Festive Sale: {festiveSale.discountPercent}% OFF applied at checkout
        </p>
      ) : null}
    </div>
  );
}
