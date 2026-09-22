"use server";

import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  getFreshCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import type { Cart } from "lib/shopify/types";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type CartActionResult = {
  status: "success" | "warning" | "error";
  message?: string;
  warningCode?: string;
  clampedQuantity?: number;
  merchandiseId?: string;
};

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
): Promise<CartActionResult> {
  if (!selectedVariantId) {
    return { status: "error", message: "Error adding item to cart" };
  }

  try {
    let cartId = (await cookies()).get("cartId")?.value;
    if (!cartId) {
      const cart = await createCart();
      cartId = cart.id!;
      (await cookies()).set("cartId", cartId);
    }
    const result = await addToCart([
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    updateTag(TAGS.cart);

    if (result.warnings && result.warnings.length > 0) {
      const w = result.warnings[0];
      const updatedLine = result.cart.lines.find(
        (l) => l.merchandise.id === selectedVariantId,
      );
      const availableQty = updatedLine?.quantity;
      const msg =
        availableQty !== undefined
          ? `Only ${availableQty} available in stock. Your cart has been updated.`
          : (w?.message ?? "Item quantity adjusted due to availability.");

      return {
        status: "warning",
        message: msg,
        warningCode: w?.code,
        clampedQuantity: availableQty,
        merchandiseId: selectedVariantId,
      };
    }

    if (result.userErrors && result.userErrors.length > 0) {
      const err = result.userErrors[0];
      return {
        status: "error",
        message: err?.message ?? "Error adding item to cart",
      };
    }

    return { status: "success" };
  } catch (e) {
    return { status: "error", message: "Error adding item to cart" };
  }
}

export async function removeItem(
  prevState: any,
  payload: string | { merchandiseId: string; lineId?: string },
) {
  try {
    let lineId: string | undefined;
    if (typeof payload === "object" && payload.lineId) {
      lineId = payload.lineId;
    } else {
      const merchandiseId =
        typeof payload === "string" ? payload : payload.merchandiseId;
      const cart = await getCart();

      if (!cart) {
        return "Error fetching cart";
      }

      const lineItem = cart.lines.find(
        (line) => line.merchandise.id === merchandiseId,
      );
      lineId = lineItem?.id;
    }

    if (lineId) {
      await removeFromCart([lineId]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
    lineId?: string;
  },
): Promise<CartActionResult> {
  const { merchandiseId, quantity, lineId } = payload;

  try {
    let effectiveLineId = lineId;

    if (!effectiveLineId) {
      const cart = await getCart();

      if (!cart) {
        return { status: "error", message: "Error fetching cart" };
      }

      const lineItem = cart.lines.find(
        (line) => line.merchandise.id === merchandiseId,
      );
      effectiveLineId = lineItem?.id;
    }

    if (effectiveLineId) {
      if (quantity === 0) {
        await removeFromCart([effectiveLineId]);
        updateTag(TAGS.cart);
        return { status: "success" };
      } else {
        await updateCart([
          {
            id: effectiveLineId,
            merchandiseId,
            quantity,
          },
        ]);
        updateTag(TAGS.cart);
        return { status: "success" };
      }
    } else if (quantity > 0) {
      await addToCart([{ merchandiseId, quantity }]);
      updateTag(TAGS.cart);
      return { status: "success" };
    }

    return { status: "success" };
  } catch (e) {
    console.error(e);
    return { status: "error", message: "Error updating item quantity" };
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
