import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";
import LogoIcon from "./icons/logo";

export type Props = {
  title?: string;
};

/**
 * Palette values are repeated literally here, which is the one place in the
 * codebase that is allowed to. `next/og` renders through Satori in an isolated
 * pass that never loads app/globals.css, so `var(--color-background)` and
 * Tailwind utilities resolve to nothing. Keep these in step with the @theme
 * block if the palette changes.
 */
const BONE = "#f2f0ed";
const ESPRESSO = "#3b2b2b";
const ACCENT = "#b08c8c";
const BORDER = "#dcd5d1";

/**
 * Shared social card, used by app/opengraph-image.tsx and the [page] /
 * [collection] variants.
 *
 * Uses Rudolphin Oblique web font locally to match the brand identity.
 */
export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.SITE_NAME,
    },
    ...props,
  };

  const file = await readFile(
    join(process.cwd(), "./fonts/Rudolphin Oblique.woff"),
  );
  const font = Uint8Array.from(file).buffer;

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full items-center justify-center"
        style={{ backgroundColor: BONE, fontFamily: "Rudolphin" }}
      >
        {/* Inset hairline frame — the same rule weight the site uses. */}
        <div
          tw="flex flex-1 flex-col items-center justify-center"
          style={{
            margin: 48,
            border: `1px solid ${BORDER}`,
            height: 534,
          }}
        >
          <LogoIcon width="46" height="40" fill={ACCENT} />

          {/* SITE_NAME is unset until the store is configured — without this
              guard the card would ship a rule under a mark and nothing else. */}
          {title ? (
            <>
              <div
                style={{
                  width: 64,
                  height: 1,
                  backgroundColor: ACCENT,
                  marginTop: 44,
                  marginBottom: 44,
                }}
              />

              <p
                style={{
                  margin: 0,
                  maxWidth: 880,
                  color: ESPRESSO,
                  fontSize: 54,
                  lineHeight: 1.15,
                  letterSpacing: 8,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </p>
            </>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Rudolphin",
          data: font,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
