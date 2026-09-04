"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

/**
 * Option swatches. The selection logic below — combinations, availability
 * filtering, the `formAction` router write that keeps the choice in the URL —
 * is the template's, unchanged. Only the markup and classes are new: squared
 * hairline chips that fill with espresso when active, and a diagonal strike
 * through anything sold out.
 */
export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

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
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => {
    const selected = searchParams.get(option.name.toLowerCase());

    return (
      <form key={option.id}>
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
              const optionNameLowerCase = option.name.toLowerCase();

              // Base option params on current searchParams so we can preserve any other param state.
              const optionParams: Record<string, string> = {};
              searchParams.forEach((v, k) => (optionParams[k] = v));
              optionParams[optionNameLowerCase] = value;

              // Filter out invalid options and check if the option combination is available for sale.
              const filtered = Object.entries(optionParams).filter(
                ([key, value]) =>
                  options.find(
                    (option) =>
                      option.name.toLowerCase() === key &&
                      option.values.includes(value),
                  ),
              );
              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, value]) =>
                    combination[key] === value && combination.availableForSale,
                ),
              );

              // The option is active if it's in the selected options.
              const isActive = searchParams.get(optionNameLowerCase) === value;

              return (
                <button
                  formAction={() => updateOption(optionNameLowerCase, value)}
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
      </form>
    );
  });
}
