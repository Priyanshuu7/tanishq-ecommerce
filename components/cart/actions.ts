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
    const result = await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
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

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
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
  },
): Promise<CartActionResult> {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return { status: "error", message: "Error fetching cart" };
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
        updateTag(TAGS.cart);
        return { status: "success" };
      } else {
        const result = await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
        updateTag(TAGS.cart);

        if (result.warnings && result.warnings.length > 0) {
          const w = result.warnings[0];
          const updatedLine = result.cart.lines.find(
            (l) => l.merchandise.id === merchandiseId,
          );
          const availableQty = updatedLine?.quantity;
          const msg =
            availableQty !== undefined
              ? `Only ${availableQty} available. Your cart has been updated.`
              : (w?.message ?? "Cart quantity adjusted due to availability.");

          return {
            status: "warning",
            message: msg,
            warningCode: w?.code,
            clampedQuantity: availableQty,
            merchandiseId,
          };
        }

        if (result.userErrors && result.userErrors.length > 0) {
          const err = result.userErrors[0];
          return {
            status: "error",
            message: err?.message ?? "Error updating item quantity",
          };
        }

        return { status: "success" };
      }
    } else if (quantity > 0) {
      const result = await addToCart([{ merchandiseId, quantity }]);
      updateTag(TAGS.cart);

      if (result.warnings && result.warnings.length > 0) {
        const w = result.warnings[0];
        const updatedLine = result.cart.lines.find(
          (l) => l.merchandise.id === merchandiseId,
        );
        const availableQty = updatedLine?.quantity;
        return {
          status: "warning",
          message:
            availableQty !== undefined
              ? `Only ${availableQty} available. Your cart has been updated.`
              : (w?.message ?? "Item quantity adjusted due to availability"),
          warningCode: w?.code,
          clampedQuantity: availableQty,
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

export type CheckoutValidationResult = {
  status: "ok" | "inventory_changed" | "error";
  message?: string;
  checkoutUrl?: string;
  freshCart?: Cart;
};

export async function validateCheckoutAction(
  clientLines: { merchandiseId: string; title: string; quantity: number }[],
): Promise<CheckoutValidationResult> {
  try {
    const freshCart = await getFreshCart();
    if (!freshCart) {
      return { status: "error", message: "Cart could not be found." };
    }

    if (freshCart.lines.length === 0) {
      return { status: "error", message: "Your cart is empty." };
    }

    // Check if any client line has a higher quantity than what Shopify fresh cart has
    for (const clientLine of clientLines) {
      const freshLine = freshCart.lines.find(
        (l) => l.merchandise.id === clientLine.merchandiseId,
      );

      const freshQuantity = freshLine ? freshLine.quantity : 0;
      if (freshQuantity < clientLine.quantity) {
        updateTag(TAGS.cart);
        const message =
          freshQuantity > 0
            ? `Only ${freshQuantity} available for "${clientLine.title}". Your cart has been updated.`
            : `"${clientLine.title}" is no longer available and was removed from your cart.`;

        return {
          status: "inventory_changed",
          message,
          freshCart,
        };
      }
    }

    return {
      status: "ok",
      checkoutUrl: freshCart.checkoutUrl,
      freshCart,
    };
  } catch (e) {
    console.error("Error validating checkout inventory:", e);
    return { status: "error", message: "Error validating stock." };
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

export async function getVariantStockAction(
  variantId: string,
): Promise<number | null> {
  if (!variantId) return null;
  try {
    const { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } =
      process.env;
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) return null;

    const endpoint = `${SHOPIFY_STORE_DOMAIN.replace(/\/$/, "")}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;

    const query = `
      mutation checkStock($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            lines(first: 1) {
              edges {
                node {
                  quantity
                }
              }
            }
          }
          warnings {
            code
            message
          }
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: {
          lines: [{ merchandiseId: variantId, quantity: 99999 }],
        },
      }),
      next: { revalidate: 60 },
    });

    const data = await res.json();
    const qty =
      data.data?.cartCreate?.cart?.lines?.edges?.[0]?.node?.quantity;
    return typeof qty === "number" ? qty : null;
  } catch (e) {
    console.error("Error checking variant stock:", e);
    return null;
  }
}


