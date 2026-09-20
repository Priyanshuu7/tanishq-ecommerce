"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { setKnownStock, useKnownStock } from "lib/stock-store";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

function SubmitButton({
  type,
  disabled,
  pending,
}: {
  type: "plus" | "minus";
  disabled?: boolean;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-disabled={disabled || pending}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "flex h-full w-9 flex-none items-center justify-center text-muted-foreground transition-colors duration-(--duration-base)",
        disabled
          ? "cursor-not-allowed opacity-25"
          : "hover:text-foreground",
        pending && "cursor-wait opacity-60",
        // Hairline divider between the control and the quantity readout.
        type === "plus" ? "border-l border-border" : "border-r border-border",
      )}
    >
      {pending ? (
        <svg
          className="h-3 w-3 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : type === "plus" ? (
        <PlusIcon className="h-3.5 w-3.5" strokeWidth={1.4} />
      ) : (
        <MinusIcon className="h-3.5 w-3.5" strokeWidth={1.4} />
      )}
    </button>
  );
}

/**
 * Quantity stepper with instant inventory capping, persistent stock awareness,
 * and loading indicator during Shopify verification.
 */
export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
  maxAvailable,
  onStockWarning,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
  maxAvailable?: number;
  onStockWarning?: (
    merchandiseId: string,
    maxQuantity: number,
    message: string,
  ) => void;
}) {
  const [result, formAction, isPending] = useActionState(
    updateItemQuantity,
    null,
  );
  const lastResultRef = useRef<any>(null);
  const onStockWarningRef = useRef(onStockWarning);

  // Sync with persistent known stock limits
  const globalStock = useKnownStock(item.merchandise.id);
  const effectiveMax = maxAvailable ?? globalStock;

  useEffect(() => {
    onStockWarningRef.current = onStockWarning;
  }, [onStockWarning]);

  const isDisabled =
    type === "plus" &&
    effectiveMax !== undefined &&
    item.quantity >= effectiveMax;

  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  useEffect(() => {
    if (!result || lastResultRef.current === result) return;
    lastResultRef.current = result;

    if (result.status === "warning" && result.message) {
      toast.warning(result.message, {
        id: `cart-stock-${item.merchandise.id}`,
      });
      if (result.clampedQuantity !== undefined) {
        // Persist max stock in global store so subsequent clicks are blocked with 0ms delay
        setKnownStock(item.merchandise.id, result.clampedQuantity);
        if (onStockWarningRef.current) {
          onStockWarningRef.current(
            item.merchandise.id,
            result.clampedQuantity,
            result.message,
          );
        }
      }
    } else if (result.status === "error" && result.message) {
      toast.error(result.message, {
        id: `cart-error-${item.merchandise.id}`,
      });
    }
  }, [result, item.merchandise.id]);

  return (
    <form
      className="h-full"
      action={async () => {
        if (isDisabled) {
          toast.warning(
            `Only ${effectiveMax} available in stock. Your cart has been updated.`,
            { id: `cart-stock-${item.merchandise.id}` },
          );
          return;
        }
        updateItemQuantityAction();
      }}
    >
      <SubmitButton
        type={type}
        disabled={isDisabled}
        pending={isPending}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {result?.message}
      </p>
    </form>
  );
}
