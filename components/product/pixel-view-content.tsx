"use client";

import { useEffect } from "react";

interface Props {
  productTitle: string;
  productId: string;
  price: string;
  currency: string;
}

/**
 * Fires Meta Pixel ViewContent event when a product page is viewed.
 * This is what Meta's "View Content" conversion event tracks.
 */
export function PixelViewContent({ productTitle, productId, price, currency }: Props) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    window.fbq("track", "ViewContent", {
      content_name: productTitle,
      content_ids: [productId],
      content_type: "product",
      value: parseFloat(price),
      currency: currency,
    });
  }, [productTitle, productId, price, currency]);

  return null;
}
