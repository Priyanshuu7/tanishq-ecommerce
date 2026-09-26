export type CtaLink = {
  label: string;
  href: string;
};

export type EditorialStatement = {
  eyebrow?: string;
  heading: string;
  body: string[];
  cta?: CtaLink;
};

export type MediaType = "auto" | "image" | "video";

export type Film = {
  /** Direct link to a video or image file. Local path, Google Drive link, or external URL. */
  src: string;
  /** Optional mobile-specific media source for responsive portrait framing. */
  mobileSrc?: string;
  /** Explicit media type override if not inferred from extension. */
  mediaType?: MediaType;
  /**
   * Still frame, shown before the first frame decodes and *instead* of the
   * video for visitors who ask for reduced motion. Strongly recommended — the
   * poster is what keeps the section from flashing empty on a slow connection.
   */
  poster?: string;
  /**
   * Describes the media for assistive technology. Omit it when a visible
   * caption already names the film; the player then marks itself decorative
   * rather than announcing an unlabelled element.
   */
  label?: string;
  /** Optional custom object position to fine-tune cropping on screen. */
  objectPosition?: string;
};

/** A film that fills a band of the page and carries a title over it. */
export type FilmSection = Film & {
  /**
   * Adds a mute toggle over the film. Only set true when the file genuinely
   * carries an audio track. Playback always *starts* muted regardless — no
   * browser will autoplay sound, so the toggle only works after a real click.
   */
  sound?: boolean;
  title: string;
  cta?: CtaLink;
  desktopDescription?: string[];
  mobileTagline?: string;
};

/** A film in the square 2×2 grid. */
export type GridFilm = Film & {
  /** Optional label laid over the foot of the tile. Off by default. */
  caption?: string;
  /** Makes the whole tile a link. */
  href?: string;
};

export type CustomerReel = {
  id: string;
  videoSrc: string;
  poster?: string;
  productHandle: string;
  tagline?: string;
};

export type AccordionEntry = {
  title: string;
  body: string[];
};

export type FooterColumn = {
  title: string;
  links: CtaLink[];
};

/* -------------------------------------------------------------------------- */
/* Homepage                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Opening full-viewport editorial media (film or image).
 */
export const heroFilm: FilmSection = {
  src:
    process.env.NEXT_PUBLIC_HERO_BANNER_URL ||
    "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/media/hero-banner.png",
  mobileSrc:
    process.env.NEXT_PUBLIC_MOBILE_BANNER_URL ||
    "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/media/mobile-banner.png",
  poster: "",
  sound: false,
  title: "ISHVA",
  desktopDescription: [
    "ISHVA is a tribute to my father the man who shaped my values, my strength, and unknowingly, my journey into fashion. Inspired by memories of beautiful fabrics, his eye for quality, and the discipline he lived by. This collection carries a part of him into my world.",
    "Through rich fabrics, delicate details and timeless silhouettes, ISHVA turns memory into something that can be worn, cherished and carried forward.",
  ],
  mobileTagline: "Turning Traditions into Confidence",
  cta: { label: "Discover", href: "/search" },
};

/**
 * Stands in for the hero until `heroFilm.src` is filled in.
 *
 * This is a genuinely different composition, not a degraded one: a typographic
 * opening on the bone ground, left-aligned, with room for a sentence. Once a
 * film is set it is never shown again, so there is no need to keep it in step.
 */
export const heroFallback = {
  eyebrow: "",
  heading: "The Quiet Opulence",
  subheading:
    "Hand-worked silhouettes for the modern occasion — draped, embroidered, and finished entirely by hand.",
  cta: { label: "Discover", href: "/search" } satisfies CtaLink,
};

export const filmGrid = {
  eyebrow: "In Motion",
  heading: "The season on Film",
  films: [
    {
      src: "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-01.mp4",
      poster:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-01-poster.jpg",
      label: "Lal Pari in Motion",
      caption: "Sahiba",
      href: "/product/sahiba",
    },
    {
      src: "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-03.mp4",
      poster:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-03-poster.jpg",
      label: "Sitara in Motion",
      caption: "Sitara",
      href: "/search",
    },
    {
      src: "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-05.mp4",
      poster:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-05-poster.jpg",
      label: "Ruhani in Motion",
      caption: "Ruhani",
      href: "/search",
    },
    {
      src: "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-07.mp4",
      poster:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/grid/grid-reel-07-poster.jpg",
      label: "RaniSiya in Motion",
      caption: "RaniSiya",
      href: "/product/ranisiya",
    },
  ] satisfies GridFilm[],
};

/** The positioning statement that follows the hero. */
export const signatureStatement: EditorialStatement = {
  heading: "Signature Realms Of Style",
  body: [
    "Four decades of drape, distilled. Each garment begins as a length of untouched cloth and ends as something worn once and remembered for years.",
    "We work in ateliers rather than factories, in weeks rather than hours, and in fabrics chosen for how they move rather than how quickly they cut.",
  ],
  cta: { label: "Explore ", href: "/search" },
};

/** The craft statement that sits between the category rail and the banner. */
export const craftStatement: EditorialStatement = {
  eyebrow: "Solanki Shivranjani",
  heading: "Crafted To Perfection",
  body: [
    "Every panel is cut on the bias, every seam finished by hand, every surface embroidered in-house. The result is a garment that holds its architecture without ever holding you.",
  ],
  cta: { label: "Our craft", href: "/search" },
};

/**
 * Shoppable Customer Reels — Worn In Real Life.
 * Displayed in a responsive 4-up carousel right after the collections section.
 * Each video showcases a patron wearing the dress, linked to the matching product.
 */
export const customerReels = {
  eyebrow: "Customer Spotlight",
  heading: "Worn In Real Life",
  description:
    "See our silhouettes in motion, styled by our patrons across celebrations.",
  videos: [
    {
      id: "reel-1",
      videoSrc:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/reels/reel-1-fast.mp4",
      productHandle: "ranisiya",
      tagline: "Wearing RaniSiya",
    },
    {
      id: "reel-2",
      videoSrc:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/reels/reel-2-fast.mp4",
      productHandle: "Maheera",
      tagline: "Wearing Maheera",
    },
    {
      id: "reel-3",
      videoSrc:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/reels/reel-3-v2.mp4",
      productHandle: "90-sedit",
      tagline: "Wearing 90-sedit",
    },
    {
      id: "reel-4",
      videoSrc:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/reels/reel-4-fast.mp4",
      productHandle: "lal-pari",
      tagline: "Wearing lal-pari",
    },
    {
      id: "reel-5",
      videoSrc:
        "https://l0uuhvrkhs7aqiyz.public.blob.vercel-storage.com/reels/reel-5-v2.mp4",
      productHandle: "ranisiya",
      tagline: "Wearing ranisiya",
    },
  ] as CustomerReel[],
};

/**
 * Full-bleed feature film, lower down the page. `sound` is on because this is
 * the slot where an atelier film with room ambience earns a mute toggle — turn
 * it off if your file has no audio track.
 */
export const featureFilm: FilmSection = {
  src: "",
  poster: "",
  sound: true,
  title: "The Philosophy of Craftsmanship",
  cta: { label: "Discover", href: "/search" },
};

/** Stands in for the feature film until `featureFilm.src` is filled in. */
export const featureFallback = {
  eyebrow: "By Appointment",
  heading: "Luxury, Tailored To You",
  body: "Our flagship ateliers offer private fittings, bespoke commissions and one-to-one styling with the design team.",
  primaryCta: { label: "Visit us", href: "/search" } satisfies CtaLink,
  secondaryCta: {
    label: "Book an appointment",
    href: "/search",
  } satisfies CtaLink,
};

/** Heading for the collection rail built from real Shopify collections. */
export const categoryRail = {
  // eyebrow: "Collections",
  heading: "Explore the Collections",
  exploreLabel: "Explore",
};

/** Heading for the featured-products module. */
export const featuredProducts = {
  eyebrow: "Selected",
  heading: "This season's pieces",
};

/* -------------------------------------------------------------------------- */
/* Product detail page                                                         */
/* -------------------------------------------------------------------------- */

export const productPage = {
  /** Fallback eyebrow when a product carries no tags. */
  eyebrowFallback: "The Collection",
  taxNote: "Taxes and duties calculated at checkout.",
  // zoomLabel: "Zoom picture",
  detailsTitle: "Product Details",
  relatedHeading: "You may also like",
};

/**
 * Static PDP accordions. "Product Details" is rendered separately from the
 * real Shopify `descriptionHtml` and is deliberately absent here.
 */
export const productAccordions: AccordionEntry[] = [
  {
    title: "Shipping & Delivery",
    body: [
      "Each piece is thoughtfully made to order with careful attention to detail and will be delivered within 21 days. Once your order is ready and dispatched, the tracking details will be shared with you.",
    ],
  },
  {
    title: "Care & Guide",
    body: [
      "Dry clean only, by a specialist experienced with hand embroidery. Do not wash, wring or tumble dry.",
      "Store flat or on a padded hanger in a breathable cotton bag, away from direct light.",
    ],
  },
  {
    title: "Manufacturer's Details",
    body: [
      "Designed and hand-finished in our own ateliers. Full manufacturer and importer details are printed on the garment label and included with your order.",
    ],
  },
  {
    title: "Disclaimer",
    body: [
      "Hand-worked embroidery and hand-dyed cloth vary piece to piece. Colour on screen may differ from the finished garment; these variations are inherent to the craft, not defects.",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Listing pages                                                               */
/* -------------------------------------------------------------------------- */

export const listing = {
  searchEyebrow: "Search",
  collectionEyebrow: "Collection",
  allTitle: "All Pieces",
  filterLabel: "Filter",
  filterPanelTitle: "Filters",
  applyLabel: "View results",
  clearLabel: "Clear",
  sortLabel: "Sort by",
  collectionsLabel: "Collections",
  emptyHeading: "Nothing here yet",
  emptyBody:
    "This selection is currently empty. Browse the full collection instead.",
  emptyCta: { label: "View all", href: "/search" } satisfies CtaLink,
  searchEmptyHeading: "No matches",
  searchEmptyBody: "We could not find anything for that search.",
};

/* -------------------------------------------------------------------------- */
/* Cart                                                                        */
/* -------------------------------------------------------------------------- */

export const cart = {
  title: "Your bag",
  emptyHeading: "Your bag is empty",
  emptyBody: "Pieces you add will appear here.",
  checkoutLabel: "Proceed to checkout",
  addToCartLabel: "Add to cart",
  maxQuantityLabel: "Maximum 3 units allowed",
  soldOutLabel: "Out of stock",
  selectVariantLabel: "Select a size",
  taxesLabel: "Taxes",
  shippingLabel: "Shipping",
  shippingNote: "Calculated at checkout",
  totalLabel: "Total",
};

/* -------------------------------------------------------------------------- */
/* System states — error, 404, first-visit toast                               */
/* -------------------------------------------------------------------------- */

export const system = {
  error: {
    eyebrow: "Error",
    heading: "Something came undone",
    body: "We could not load this page. It is most likely a passing fault — try once more, and if it persists our atelier team can help.",
    retryLabel: "Try again",
    homeLabel: "Return home",
  },
  notFound: {
    eyebrow: "404",
    heading: "This page has been retired",
    body: "The page you were looking for is no longer here. It may have moved, or the piece may have left the collection.",
    primaryCta: { label: "Browse the collection", href: "/search" },
    secondaryLabel: "Return home",
  },
  /**
   * Shown once per visitor, then suppressed by the `welcome-toast` cookie.
   * Set `welcomeToast.enabled` to false to remove it entirely.
   */
  welcomeToast: {
    enabled: true,
    heading: "Welcome to Shivranjani Solanki ",
    body: "Private previews, atelier notes and invitations to our seasonal showings.",
  },
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const navigation = {
  /** Label for the mega-menu trigger that lists real Shopify collections. */
  shopLabel: "Shop",
  searchPlaceholder: "Search for a piece, a fabric, an occasion",
  searchLabel: "Search",
  closeLabel: "Close",
  menuLabel: "Menu",
  cartLabel: "Bag",
  /**
   * Links shown alongside the collection-driven mega-menu. These are
   * editorial destinations, not commerce data. Point them at real Shopify
   * pages (`app/[page]/page.tsx`) once those pages exist in the store.
   */
  editorialLinks: [
    { label: "About us", href: "/about-us" },
    // { label: "Bespoke", href: "/search" },
    // { label: "Stores", href: "/search" },
  ] satisfies CtaLink[],
};

/** Slow marquee under the header. Set to an empty array to remove the band. */
export const announcements: string[] = [
  "Private appointments available",
  "Hand-finished, made to order",
];

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export const footer = {
  blurb:
    "A house built on drape, embroidery and the belief that clothing should outlast the season it was made for.",
  /**
   * Rendered beside the real Shopify menu column, which is fetched from the
   * `next-js-frontend-footer-menu` menu handle.
   */
  columns: [
    {
      title: "Support",
      links: [
        { label: "Shipping & Returns", href: "/search" },
        { label: "Size Guide", href: "/search" },
        { label: "Care Instructions", href: "/search" },
        { label: "Contact", href: "/search" },
      ],
    },
    {
      title: "Keep in Touch",
      links: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/label.shivranjani.solanki",
        },
      ],
    },
  ] satisfies FooterColumn[],
  contact: [
    { label: "Enquiries", value: "Shivranjanisolankii@gmail.com" },
    { label: "Telephone", value: "+91 6263326569 " },
  ],
};
