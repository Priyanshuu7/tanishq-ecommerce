import clsx from "clsx";

/**
 * `suppressHydrationWarning` is intentional: Intl.NumberFormat with an
 * undefined locale resolves against the server's locale during SSR and the
 * browser's on the client, so the formatted string can legitimately differ.
 */
const Price = ({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
  <p suppressHydrationWarning={true} className={clsx("t-price", className)}>
    {`${new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount))}`}
    <span
      className={clsx(
        "ml-1.5 inline text-[0.9em] opacity-60",
        currencyCodeClassName,
      )}
    >{`${currencyCode}`}</span>
  </p>
);

export default Price;
