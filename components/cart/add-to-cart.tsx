"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { cart as cartCopy } from "lib/editorial";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses = "btn btn-filled w-full";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses)}>
        {cartCopy.soldOutLabel}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses)}
      >
        {cartCopy.selectVariantLabel}
      </button>
    );
  }

  return (
    <button aria-label="Add to cart" className={buttonClasses}>
      {cartCopy.addToCartLabel}
    </button>
  );
}

/**
 * The variant resolution, the `formAction.bind` and the optimistic
 * `addCartItem(finalVariant, product)` inside the form action are all the
 * template's, unchanged. The button chrome is the only thing that moved: the
 * shared `.btn btn-filled` wipe-fill treatment, and the disabled states now say
 * what's actually wrong rather than showing a greyed-out plus icon.
 */
export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
