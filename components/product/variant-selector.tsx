"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

/**
 * Option swatches. Instant client-side state + native history.replaceState
 * eliminate server roundtrips, making selection 0ms instant while keeping
 * the URL in sync for sharing and bookmarking.
 */
export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    searchParams.forEach((v, k) => (initial[k] = v));
    return initial;
  });

  useEffect(() => {
    const current: Record<string, string> = {};
    searchParams.forEach((v, k) => (current[k] = v));
    setSelectedOptions(current);
  }, [searchParams]);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return options.map((option) => {
    const optionNameLowerCase = option.name.toLowerCase();
    const selected =
      selectedOptions[optionNameLowerCase] ??
      searchParams.get(optionNameLowerCase);

    return (
      <div key={option.id}>
        <dl className="mb-9">
          <dt className="t-eyebrow mb-4 flex items-baseline gap-2 text-muted-foreground">
            {option.name}
            {selected ? (
              <span className="text-foreground normal-case tracking-normal">
                {selected}
              </span>
            ) : null}
          </dt>
          <dd className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              // Base option params on current selection so we can preserve any other param state.
              const optionParams: Record<string, string> = {
                ...selectedOptions,
              };
              searchParams.forEach((v, k) => {
                if (!(k in optionParams)) optionParams[k] = v;
              });
              optionParams[optionNameLowerCase] = value;

              // Filter out invalid options and check if the option combination is available for sale.
              const filtered = Object.entries(optionParams).filter(
                ([key, val]) =>
                  options.find(
                    (opt) =>
                      opt.name.toLowerCase() === key &&
                      opt.values.includes(val),
                  ),
              );
              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, val]) =>
                    combination[key] === val && combination.availableForSale,
                ),
              );

              // The option is active if it's in the selected options.
              const isActive = selected === value;

              return (
                <button
                  type="button"
                  onClick={() => updateOption(optionNameLowerCase, value)}
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                  className={clsx(
                    "t-nav flex h-11 min-w-[3.25rem] items-center justify-center border px-3.5 transition-colors duration-(--duration-base)",
                    {
                      "cursor-default border-foreground bg-foreground text-background":
                        isActive,
                      "border-border text-foreground hover:border-foreground":
                        !isActive && isAvailableForSale,
                      // Sold out: muted, and struck through with a hairline
                      // drawn corner to corner by the ::before pseudo-element.
                      "relative cursor-not-allowed overflow-hidden border-border/70 text-subtle before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-rotate-[28deg] before:bg-subtle":
                        !isAvailableForSale,
                    },
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
      </div>
    );
  });
}
