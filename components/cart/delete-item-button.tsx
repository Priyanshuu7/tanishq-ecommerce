"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

/**
 * Remove-line button. The Server Action binding and the optimistic
 * `optimisticUpdate(merchandiseId, "delete")` call are unchanged — this is a
 * restyle only: a text-weight × sitting on the row instead of a grey pill.
 */
export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="t-nav flex items-center gap-1.5 text-muted-foreground transition-colors duration-(--duration-base) hover:text-accent-deep"
      >
        <XMarkIcon className="h-3.5 w-3.5" strokeWidth={1.4} />
        Remove
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
