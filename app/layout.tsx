import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

/**
 * Cormorant Garamond (display) + Jost (sans), mapped to --font-display and
 * --font-sans in app/globals.css.
 *
 * Loaded with plain <link> tags rather than next/font/google because
 * next/font fetches the font files at build time, which needs network access
 * during `next build`. React 19 hoists these into <head> automatically.
 *
 * To self-host later: delete these three links, then
 *   import { Cormorant_Garamond, Jost } from "next/font/google";
 * and point --font-display / --font-sans at the generated CSS variables.
 */
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* React hoists these into <head> itself. `precedence` is what makes
            that legal for the stylesheet — without it React refuses to move a
            stylesheet rendered outside the document head, and a <link> as a
            direct child of <html> is invalid HTML that trips hydration. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} precedence="default" />

        {/* Scroll reveals start hidden and are switched on by an
            IntersectionObserver. Without JavaScript that never happens, so
            neutralise them entirely. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-mask]{clip-path:none!important}`}</style>
        </noscript>
        <CartProvider cartPromise={cart}>
          <Navbar />
          {/* The header is fixed, so content is offset by its height. The
              homepage hero cancels this out with a negative margin so it can
              sit underneath a transparent header. */}
          <main className="pt-(--header-h)">
            {children}
            <Toaster
              closeButton
              toastOptions={{
                classNames: {
                  toast:
                    "!rounded-none !border !border-border !bg-background !font-sans !text-foreground !shadow-none",
                  description: "!text-muted-foreground",
                },
              }}
            />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
