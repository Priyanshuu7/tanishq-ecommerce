"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "flex h-full w-9 flex-none items-center justify-center text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground",
        // Hairline divider between the control and the quantity readout.
        type === "plus" ? "border-l border-border" : "border-r border-border",
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-3.5 w-3.5" strokeWidth={1.4} />
      ) : (
        <MinusIcon className="h-3.5 w-3.5" strokeWidth={1.4} />
      )}
    </button>
  );
}

/**
 * Quantity stepper. The action binding and the optimistic
 * `optimisticUpdate(payload.merchandiseId, type)` call are the template's,
 * unchanged; only the chrome is new.
 */
export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      className="h-full"
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
