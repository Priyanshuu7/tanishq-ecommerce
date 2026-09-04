"use client";

import { system } from "lib/editorial";
import Link from "next/link";

/**
 * Route-level error boundary.
 *
 * `reset()` is React's — it re-renders the segment, which is the only recovery
 * path available here, so it stays wired exactly as the template had it. The
 * rest is the house treatment: centred editorial column on the bone ground,
 * hairline rule, wipe-fill retry beside a quiet way out.
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="layout-text section-y flex min-h-[60svh] flex-col items-center justify-center text-center">
      <p className="t-eyebrow text-accent">{system.error.eyebrow}</p>

      <h1 className="t-section mt-5 text-foreground">{system.error.heading}</h1>

      <div className="mt-7 h-px w-16 bg-accent" aria-hidden="true" />

      <p className="t-body mt-7 max-w-md text-muted-foreground">
        {system.error.body}
      </p>

      <div className="mt-11 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <button className="btn btn-primary" onClick={() => reset()}>
          {system.error.retryLabel}
        </button>

        <Link href="/" className="t-nav link-sweep text-muted-foreground">
          {system.error.homeLabel}
        </Link>
      </div>
    </div>
  );
}
