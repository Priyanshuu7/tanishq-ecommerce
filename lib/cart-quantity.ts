import type { Cart } from "lib/shopify/types";

export const MAX_VARIANT_QUANTITY = 3;

export function getVariantQuantity(
  cart: Pick<Cart, "lines"> | undefined,
  merchandiseId: string,
  excludeLineId?: string,
) {
  if (!cart) {
    return 0;
  }

  return cart.lines.reduce((sum, line) => {
    if (line.merchandise.id !== merchandiseId) {
      return sum;
    }

    if (excludeLineId && line.id === excludeLineId) {
      return sum;
    }

    return sum + line.quantity;
  }, 0);
}
