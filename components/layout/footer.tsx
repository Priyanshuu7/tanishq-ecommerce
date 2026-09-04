import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { AnimatedReveal } from "components/motion/animated-reveal";
import { Newsletter } from "components/ui/newsletter";
import { announcements, footer } from "lib/editorial";
import { getMenu } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  "use cache";
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton = "h-4 w-28 animate-pulse bg-surface-deep";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  // The marquee keyframe translates by -100%/3, so the strip is tripled to
  // loop seamlessly.s
  const marqueeItems = announcements.length
    ? [...announcements, ...announcements, ...announcements]
    : [];

  return (
    <footer className="border-t border-border">
      {marqueeItems.length ? (
        <div className="overflow-hidden border-b border-border bg-foreground py-3.5 text-on-media">
          <ul className="flex w-max animate-marquee items-center">
            {marqueeItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="t-eyebrow flex items-center gap-12 px-6 whitespace-nowrap"
                aria-hidden={index >= announcements.length}
              >
                {item}
                <span className="text-accent" aria-hidden="true">
                  &#9670;
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Newsletter />

      <AnimatedReveal
        as="div"
        variant="fade"
        className="layout-wide grid gap-x-12 gap-y-14 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20"
      >
        <div className="lg:pr-8">
          <Link
            className="inline-flex items-center gap-3 text-foreground"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="font-display text-xl leading-none tracking-[0.14em] uppercase">
              {SITE_NAME}
            </span>
          </Link>

          <p className="t-body mt-6 max-w-xs text-muted-foreground">
            {footer.blurb}
          </p>

          <dl className="mt-8 flex flex-col gap-3">
            {footer.contact.map((entry) => (
              <div key={entry.label}>
                <dt className="t-eyebrow text-subtle">{entry.label}</dt>
                <dd className="t-body text-muted-foreground">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The store's own footer menu, straight from Shopify. */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>

        {footer.columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="t-eyebrow mb-6 text-subtle">{column.title}</h2>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="t-body link-sweep text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </AnimatedReveal>

      <div className="border-t border-border">
        <div className="layout-wide flex flex-col items-center gap-2 py-7 md:flex-row md:justify-between">
          <p className="t-caption">
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
          <p className="t-caption">
            Hand-finished in limited quantities. Made to order.
          </p>
        </div>
      </div>
    </footer>
  );
}
