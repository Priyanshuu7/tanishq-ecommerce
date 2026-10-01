import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} | Official `,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Label Shivranjani Solanki is a contemporary Indian fashion label where timeless craftsmanship meets modern silhouettes, expressed through sumptuous textures, evocative colours, and the quiet artistry of meticulous handwork.",
  keywords: [
    "Shivranjani Solanki",
    "shivranjanisolanki",
    "Shivranjani Solanki designer",
    "Shivranjani Solanki fashion",
    "Shivranjani Solanki couture",
    "Indian fashion designer",
    "occasion wear",
    "made to order couture",
    "drape embroidery fashion",
  ],
  authors: [{ name: "Shivranjani Solanki", url: baseUrl }],
  creator: "Shivranjani Solanki",
  publisher: "Shivranjani Solanki",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Official`,
    description:
      "Label Shivranjani Solanki is a contemporary Indian fashion label where timeless craftsmanship meets modern silhouettes, expressed through sumptuous textures, evocative colours, and the quiet artistry of meticulous handwork.",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Shivranjani Solanki — Official Designer Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Official Designer Website`,
    description:
      "Label Shivranjani Solanki is a contemporary Indian fashion label where timeless craftsmanship meets modern silhouettes, expressed through sumptuous textures, evocative colours, and the quiet artistry of meticulous handwork.",
    images: [`${baseUrl}/opengraph-image`],
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification token here once you have it
    // google: "your-verification-token",
  },
};

// JSON-LD structured data — this is the main reason Instagram/LinkedIn
// outrank brand websites: social platforms inject Person/Organization schema
// automatically. Adding it here gives Google the same signal.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: "Shivranjani Solanki",
      alternateName: "shivranjanisolanki",
      description:
        "Label Shivranjani Solanki is a contemporary Indian fashion label where timeless craftsmanship meets modern silhouettes, expressed through sumptuous textures, evocative colours, and the quiet artistry of meticulous handwork.",
      url: baseUrl,
      sameAs: [
        "https://www.instagram.com/label.shivranjani.solanki/",
        "https://www.linkedin.com/in/shivranjani-solanki",
      ],
    },
    {
      "@type": "ClothingStore",
      "@id": `${baseUrl}/#organization`,
      name: "Shivranjani Solanki",
      alternateName: "shivranjanisolanki",
      url: baseUrl,
      founder: { "@id": `${baseUrl}/#person` },
      description:
        "Label Shivranjani Solanki is a contemporary Indian fashion label where timeless craftsmanship meets modern silhouettes, expressed through sumptuous textures, evocative colours, and the quiet artistry of meticulous handwork.",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
      sameAs: [
        "https://www.instagram.com/label.shivranjani.solanki/",
        "https://www.linkedin.com/in/shivranjani-solanki",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Shivranjani Solanki",
      publisher: { "@id": `${baseUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

/**
 * Junge (display/serif) + Ubuntu & Jost (sans) loaded via Google Fonts link tag.
 */
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Junge&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Jost:wght@300;400;500&display=swap";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* React hoists these into <head> itself. `precedence` is what makes
            that legal for the stylesheet — without it React refuses to move a
            stylesheet rendered outside the document head, and a <link> as a
            direct child of <html> is invalid HTML that trips hydration. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preload the font CSS so it fetches in parallel and doesn't block
            the initial render — saves ~200 ms desktop, ~1,750 ms mobile. */}
        <link
          rel="preload"
          as="style"
          href={GOOGLE_FONTS_HREF}
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
