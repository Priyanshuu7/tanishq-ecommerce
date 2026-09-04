import CartModal from "components/cart/modal";
import { getCollections, getMenu } from "lib/shopify";
import { Suspense } from "react";
import { HeaderShell } from "./header-shell";

const { SITE_NAME } = process.env;

export async function Navbar() {
  // Both of these already return [] when Shopify is unconfigured, so the
  // header renders as a bare logo rather than throwing.
  const [menu, collections] = await Promise.all([
    getMenu("next-js-frontend-header-menu"),
    getCollections(),
  ]);

  return (
    <HeaderShell
      menu={menu}
      collections={collections}
      siteName={SITE_NAME ?? ""}
      cart={
        <Suspense fallback={null}>
          <CartModal />
        </Suspense>
      }
    />
  );
}
