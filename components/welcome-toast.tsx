"use client";

import { system } from "lib/editorial";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * First-visit toast.
 *
 * The mechanism is the template's — show once, suppress afterwards with the
 * `welcome-toast` cookie, and skip it entirely on short viewports where it
 * would cover content. Only the contents changed: the Next.js/Vercel promo is
 * gone, replaced with house copy from lib/editorial.ts, and the chrome comes
 * from the <Toaster> classNames in app/layout.tsx so it matches the palette.
 *
 * The toast is deliberately dismiss-only (duration: Infinity) because the
 * cookie is written in onDismiss — auto-hiding would make it reappear on the
 * next page load.
 */
export function WelcomeToast() {
  useEffect(() => {
    if (!system.welcomeToast.enabled) return;
    // Ignore if the screen is too short for the toast to sit out of the way.
    if (window.innerHeight < 650) return;
    if (document.cookie.includes("welcome-toast=2")) return;

    toast(
      <span className="t-nav text-foreground">
        {system.welcomeToast.heading}
      </span>,
      {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: <span className="t-body">{system.welcomeToast.body}</span>,
      },
    );
  }, []);

  return null;
}
