import clsx from "clsx";
import Price from "./price";

/**
 * Caption laid over imagery — used by the homepage feature grid and carousel.
 *
 * The template's version was a floating pill; this sits the type directly on
 * the photograph over a gradient scrim, which is how editorial fashion layouts
 * treat it.
 */
const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div
      className={clsx(
        "media-scrim pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 p-6 pt-16 text-on-media @container/label md:p-8 md:pt-24",
        {
          "md:items-center md:pb-14 md:text-center": position === "center",
        },
      )}
    >
      <h3
        className={clsx(
          "font-display line-clamp-2 font-light leading-tight",
          position === "center" ? "text-2xl md:text-4xl" : "text-lg md:text-xl",
        )}
      >
        {title}
      </h3>
      <Price
        className="t-price text-on-media/80"
        amount={amount}
        currencyCode={currencyCode}
        currencyCodeClassName="hidden @[240px]/label:inline"
      />
    </div>
  );
};

export default Label;
