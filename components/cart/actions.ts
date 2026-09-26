"use server";

import { MAX_VARIANT_QUANTITY, getVariantQuantity } from "lib/cart-quantity";
import { TAGS } from "lib/constants";
import {
    addToCart,
    createCart,
    getCart,
    removeFromCart,
    updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function safeUpdateCartTag() {
  try {
    updateTag(TAGS.cart);
  } catch {
    // updateTag is only allowed in Server Action context; safe to ignore in route handlers or tests
  }
}

export type CartActionResult = {
  status: "success" | "warning" | "error";
  message?: string;
  warningCode?: string;
  clampedQuantity?: number;
  merchandiseId?: string;
};

export type AddItemPayload =
  | string
  | {
      selectedVariantId: string | undefined;
      customSize?: string;
      quantity?: number;
    };

export async function addItem(
  prevState: any,
  payload: AddItemPayload,
): Promise<CartActionResult> {
  const selectedVariantId =
    typeof payload === "string" ? payload : payload?.selectedVariantId;
  const customSize =
    typeof payload === "object" ? payload?.customSize : undefined;
  const requestedQuantity =
    typeof payload === "object" ? Math.max(1, payload.quantity ?? 1) : 1;

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

    const existingCart = await getCart();
    const currentVariantQty = getVariantQuantity(
      existingCart,
      selectedVariantId,
    );

    if (currentVariantQty >= MAX_VARIANT_QUANTITY) {
      return {
        status: "error",
        message: "Maximum 3 units allowed per customer.",
        merchandiseId: selectedVariantId,
        clampedQuantity: currentVariantQty,
      };
    }

    const quantityToAdd = Math.min(
      requestedQuantity,
      MAX_VARIANT_QUANTITY - currentVariantQty,
    );

    if (quantityToAdd <= 0) {
      return {
        status: "error",
        message: "Maximum 3 units allowed per customer.",
        merchandiseId: selectedVariantId,
        clampedQuantity: currentVariantQty,
      };
    }

    const attributes = customSize?.trim()
      ? [{ key: "Custom Size", value: customSize.trim() }]
      : undefined;

    const result = await addToCart([
      {
        merchandiseId: selectedVariantId,
        quantity: quantityToAdd,
        ...(attributes ? { attributes } : {}),
      },
    ]);
    safeUpdateCartTag();

    if (result.userErrors && result.userErrors.length > 0) {
      const err = result.userErrors[0];
      return {
        status: "error",
        message: err?.message ?? "Error adding item to cart",
      };
    }

    const warning = result.warnings?.[0];
    const updatedLine = result.cart.lines.find(
      (line) => line.merchandise.id === selectedVariantId,
    );
    const updatedQuantity = updatedLine?.quantity ?? 0;

    if (
      warning?.code === "MERCHANDISE_OUT_OF_STOCK" ||
      (updatedLine?.id && updatedQuantity <= 0)
    ) {
      if (updatedLine?.id && updatedQuantity <= 0) {
        await removeFromCart([updatedLine.id]);
        safeUpdateCartTag();
      }

      return {
        status: "error",
        message: warning?.message ?? "The product is already sold out.",
        warningCode: warning?.code,
        clampedQuantity: currentVariantQty,
        merchandiseId: selectedVariantId,
      };
    }

    if (quantityToAdd < requestedQuantity) {
      return {
        status: "warning",
        message: `Maximum 3 units allowed per customer. Added ${quantityToAdd} to reach the limit of 3.`,
        clampedQuantity: currentVariantQty + quantityToAdd,
        merchandiseId: selectedVariantId,
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
    const cart = await getCart();

    if (!cart) {
      return { status: "error", message: "Error fetching cart" };
    }

    const currentVariantLines = cart.lines.filter(
      (line) => line.merchandise.id === merchandiseId,
    );
    const effectiveLine =
      lineId !== undefined
        ? currentVariantLines.find((line) => line.id === lineId)
        : currentVariantLines[0];

    const currentLineQuantity = effectiveLine?.quantity ?? 0;
    const otherVariantQuantity = getVariantQuantity(
      cart,
      merchandiseId,
      effectiveLine?.id,
    );
    const maxAllowedForLine = Math.max(
      0,
      MAX_VARIANT_QUANTITY - otherVariantQuantity,
    );
    const finalQuantity = Math.min(Math.max(0, quantity), maxAllowedForLine);

    if (
      quantity > currentLineQuantity &&
      finalQuantity === currentLineQuantity
    ) {
      return {
        status: "error",
        message: "Maximum 3 units allowed per customer.",
        merchandiseId,
        clampedQuantity: currentLineQuantity + otherVariantQuantity,
      };
    }

    if (effectiveLine?.id) {
      if (finalQuantity === 0) {
        await removeFromCart([effectiveLine.id]);
        safeUpdateCartTag();
        return { status: "success" };
      }

      const result = await updateCart([
        {
          id: effectiveLine.id,
          merchandiseId,
          quantity: finalQuantity,
        },
      ]);
      safeUpdateCartTag();

      if (result.userErrors && result.userErrors.length > 0) {
        const err = result.userErrors[0];
        return {
          status: "error",
          message: err?.message ?? "Error updating item quantity",
        };
      }

      const warning = result.warnings?.[0];
      const updatedLine = result.cart.lines.find(
        (line) => line.merchandise.id === merchandiseId,
      );
      const updatedQuantity = updatedLine?.quantity ?? 0;

      if (
        warning?.code === "MERCHANDISE_OUT_OF_STOCK" ||
        (updatedLine?.id && updatedQuantity <= 0)
      ) {
        if (updatedLine?.id && updatedQuantity <= 0) {
          await removeFromCart([updatedLine.id]);
          safeUpdateCartTag();
        }

        return {
          status: "error",
          message: warning?.message ?? "The product is already sold out.",
          warningCode: warning?.code,
          clampedQuantity: currentLineQuantity,
          merchandiseId,
        };
      }

      if (finalQuantity < quantity) {
        return {
          status: "warning",
          message: `Maximum 3 units allowed per customer. Updated to ${finalQuantity}.`,
          clampedQuantity: finalQuantity,
          merchandiseId,
        };
      }

      return { status: "success" };
    }

    if (finalQuantity > 0) {
      const result = await addToCart([
        { merchandiseId, quantity: finalQuantity },
      ]);
      safeUpdateCartTag();

      if (result.userErrors && result.userErrors.length > 0) {
        const err = result.userErrors[0];
        return {
          status: "error",
          message: err?.message ?? "Error updating item quantity",
        };
      }

      const warning = result.warnings?.[0];
      const updatedLine = result.cart.lines.find(
        (line) => line.merchandise.id === merchandiseId,
      );
      const updatedQuantity = updatedLine?.quantity ?? 0;

      if (
        warning?.code === "MERCHANDISE_OUT_OF_STOCK" ||
        (updatedLine?.id && updatedQuantity <= 0)
      ) {
        if (updatedLine?.id && updatedQuantity <= 0) {
          await removeFromCart([updatedLine.id]);
          safeUpdateCartTag();
        }

        return {
          status: "error",
          message: warning?.message ?? "The product is already sold out.",
          warningCode: warning?.code,
          clampedQuantity: 0,
          merchandiseId,
        };
      }

      if (finalQuantity < quantity) {
        return {
          status: "warning",
          message: `Maximum 3 units allowed per customer. Updated to ${finalQuantity}.`,
          clampedQuantity: finalQuantity,
          merchandiseId,
        };
      }

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
