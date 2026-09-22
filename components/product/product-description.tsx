import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Accordion, AccordionItem } from "components/ui/accordion";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { productAccordions, productPage } from "lib/editorial";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  // The product fragment has no `vendor` or `productType` field, and adding one
  // would mean editing the protected GraphQL. Tags are already fetched, so the
  // first visible tag stands in as the eyebrow.
  const eyebrow =
    product.tags.find((tag) => tag !== HIDDEN_PRODUCT_TAG) ??
    productPage.eyebrowFallback;

  return (
    <>
      <h1 className="t-section mt-4">{product.title}</h1>
      <br />
      <p className="t-eyebrow text-muted-foreground">{eyebrow}</p>
      <div className="mt-6 flex items-baseline gap-3">
        <Price
          className="text-base tracking-[0.1em] text-foreground"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
        {!product.availableForSale ? (
          <span className="t-eyebrow text-accent-deep">Sold out</span>
        ) : null}
      </div>

      <p className="t-caption mt-2">{productPage.taxNote}</p>

      <div className="mt-10 h-px w-full bg-border" aria-hidden="true" />

      <div className="mt-10">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
        <AddToCart product={product} />
      </div>

      <div className="mt-14">
        <Accordion>
          {product.descriptionHtml || product.specifications?.length ? (
            <AccordionItem title={productPage.detailsTitle} defaultOpen>
              {product.descriptionHtml ? (
                <Prose html={product.descriptionHtml} />
              ) : null}

              {product.specifications?.length ? (
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
                  {product.specifications.map((spec) => (
                    <div key={spec.name}>
                      <dt className="t-eyebrow text-muted-foreground">
                        {spec.name}
                      </dt>
                      <dd className="mt-1 font-serif text-sm tracking-wide text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </AccordionItem>
          ) : null}

          {productAccordions.map((entry) => (
            <AccordionItem key={entry.title} title={entry.title}>
              {entry.body.map((paragraph) => (
                <p key={paragraph} className="not-first:mt-4">
                  {paragraph}
                </p>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
