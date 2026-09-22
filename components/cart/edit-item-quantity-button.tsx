"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

function SubmitButton({
  type,
  pending,
}: {
  type: "plus" | "minus";
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "flex h-full w-9 flex-none items-center justify-center text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground cursor-pointer",
        pending && "cursor-wait opacity-60",
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
 * Quantity stepper without inventory capping blocks or alerts.
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
  optimisticUpdate?: any;
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

  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
    lineId: item.id,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      className="h-full"
      action={async () => {
        optimisticUpdate?.(item.merchandise.id, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} pending={isPending} />
      <p aria-live="polite" className="sr-only" role="status">
        {result?.message}
      </p>
    </form>
  );
}
