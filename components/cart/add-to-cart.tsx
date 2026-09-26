"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import LoadingDots from "components/loading-dots";
import { cart as cartCopy } from "lib/editorial";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  hasSelection,
  limitReached,
}: {
  availableForSale: boolean;
  hasSelection: boolean;
  limitReached: boolean;
}) {
  const { pending } = useFormStatus();
  const buttonClasses = "btn btn-filled w-full";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses)}>
        {cartCopy.soldOutLabel}
      </button>
    );
  }

  if (!hasSelection) {
    return (
      <button
        aria-label="Please select a size or enter custom measurements"
        disabled
        className={clsx(buttonClasses)}
      >
        {cartCopy.selectVariantLabel}
      </button>
    );
  }

  if (limitReached) {
    return (
      <button disabled className={clsx(buttonClasses)}>
        {cartCopy.maxQuantityLabel}
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      disabled={pending}
      className={clsx(buttonClasses, {
        "cursor-not-allowed opacity-80": pending,
      })}
    >
      {pending ? (
        <LoadingDots className="bg-background" />
      ) : (
        cartCopy.addToCartLabel
      )}
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
  const { variants, availableForSale, options } = product;
  const { cart, addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [result, formAction] = useActionState(addItem, null);
  const [customSize, setCustomSize] = useState("");
  const [activeParams, setActiveParams] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      searchParams.forEach((v, k) => (initial[k] = v));
      return initial;
    },
  );

  useEffect(() => {
    const current: Record<string, string> = {};
    searchParams.forEach((v, k) => (current[k] = v));
    setActiveParams(current);
  }, [searchParams]);

  useEffect(() => {
    const handlePopState = () => {
      const current: Record<string, string> = {};
      const params = new URLSearchParams(window.location.search);
      params.forEach((v, k) => (current[k] = v));
      setActiveParams(current);

      // If an option was selected in the URL, clear any custom size
      const hasAnySelected = options.some((opt) =>
        params.has(opt.name.toLowerCase()),
      );
      if (hasAnySelected) {
        setCustomSize("");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [options]);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === activeParams[option.name.toLowerCase()],
    ),
  );

  const hasCustomSize = Boolean(customSize.trim());
  const hasMultipleSizes = options.some((opt) => opt.values.length > 1);
  const fallbackVariant =
    variants.find((v) => v.availableForSale) || variants[0];
  const finalVariant =
    variant ||
    (hasCustomSize
      ? fallbackVariant
      : variants.length === 1
        ? variants[0]
        : undefined);
  const effectiveVariantId = finalVariant?.id;
  const currentVariantQuantity =
    cart?.lines.reduce((sum, line) => {
      if (line.merchandise.id !== effectiveVariantId) {
        return sum;
      }

      return sum + line.quantity;
    }, 0) ?? 0;
  const hasSelection = Boolean(
    variant ||
      (variants.length === 1 && variants[0]?.availableForSale) ||
      hasCustomSize,
  );
  const limitReached = currentVariantQuantity >= 3;

  const addItemAction = formAction.bind(null, {
    selectedVariantId: effectiveVariantId,
    customSize,
  });

  useEffect(() => {
    if (result?.status === "warning" && result?.message) {
      toast.warning(result.message, { id: `add-cart-${effectiveVariantId}` });
    } else if (result?.status === "error" && result?.message) {
      toast.error(result.message, {
        id: `add-cart-error-${effectiveVariantId}`,
      });
    }
  }, [result, effectiveVariantId]);

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomSize(val);

    // If entering custom size, deselect any active standard size options in URL
    if (val.trim()) {
      const params = new URLSearchParams(window.location.search);
      let changed = false;
      options.forEach((opt) => {
        const key = opt.name.toLowerCase();
        if (params.has(key)) {
          params.delete(key);
          changed = true;
        }
      });
      if (changed) {
        const newUrl = params.toString()
          ? `?${params.toString()}`
          : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
        window.dispatchEvent(new Event("popstate"));
      }
    }
  };

  return (
    <form
      action={async () => {
        if (!hasSelection || !finalVariant || !effectiveVariantId) {
          toast.error("Please select a size or enter custom measurements");
          return;
        }
        addCartItem(finalVariant, product, customSize);
        await addItemAction();
      }}
    >
      <div className="mb-6">
        {hasMultipleSizes ? (
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 t-caption text-muted-foreground uppercase tracking-widest text-[11px]">
              or enter custom size
            </span>
          </div>
        ) : null}

        <label
          htmlFor="custom-size-input"
          className="t-eyebrow mb-2.5 flex items-baseline justify-between text-muted-foreground"
        >
          <span>Custom Size / Measurements</span>
        </label>
        <input
          id="custom-size-input"
          name="customSize"
          type="text"
          value={customSize}
          onChange={handleCustomSizeChange}
          placeholder="e.g. Chest 38, Waist 32, Length 44 or custom fit"
          className="h-11 w-full border border-border bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-foreground focus:outline-none"
        />
        <p className="t-caption mt-1.5 text-muted-foreground">
          Enter your specific sizing or measurements for bespoke tailoring.
        </p>
      </div>

      <SubmitButton
        availableForSale={availableForSale}
        hasSelection={hasSelection}
        limitReached={limitReached}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {result?.message}
      </p>
    </form>
  );
}
