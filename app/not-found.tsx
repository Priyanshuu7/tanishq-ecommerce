import { system } from "lib/editorial";
import Link from "next/link";

/**
 * Branded 404.
 *
 * `notFound()` is called from app/[page]/page.tsx and app/product/[handle],
 * and without this file those calls fell through to Next's default black-on-
 * white page. It is a static server component — no data, no hooks — so it
 * prerenders and costs nothing.
 */
export default function NotFound() {
  return (
    <div className="layout-text section-y flex min-h-[60svh] flex-col items-center justify-center text-center">
      <p className="t-eyebrow text-accent">{system.notFound.eyebrow}</p>

      <h1 className="t-section mt-5 text-foreground">
        {system.notFound.heading}
      </h1>

      <div className="mt-7 h-px w-16 bg-accent" aria-hidden="true" />

      <p className="t-body mt-7 max-w-md text-muted-foreground">
        {system.notFound.body}
      </p>

      <div className="mt-11 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <Link
          href={system.notFound.primaryCta.href}
          className="btn btn-primary"
        >
          {system.notFound.primaryCta.label}
        </Link>

        <Link href="/" className="t-nav link-sweep text-muted-foreground">
          {system.notFound.secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
