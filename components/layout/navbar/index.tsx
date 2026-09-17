import CartModal from "components/cart/modal";
import { getCollections, getMenu } from "lib/shopify";
import { Suspense } from "react";
import { HeaderShell } from "./header-shell";

export async function Navbar() {
  // Both of these already return [] when Shopify is unconfigured, so the
  // header renders as a bare logo rather than throwing.
  const [menu, collections] = await Promise.all([
    getMenu("next-js-frontend-header-menu"),
    getCollections(),
  ]);

  const domain =
    process.env.SHOPIFY_STORE_DOMAIN || "https://xvxehh-d0.myshopify.com";
  const accountUrl = `${domain.replace(/\/$/, "")}/account`;

  return (
    <HeaderShell
      menu={menu}
      collections={collections}
      accountUrl={accountUrl}
      cart={
        <Suspense fallback={null}>
          <CartModal />
        </Suspense>
      }
    />
  );
}
