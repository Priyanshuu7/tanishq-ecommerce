"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { MAX_VARIANT_QUANTITY } from "lib/cart-quantity";
import { DEFAULT_OPTION } from "lib/constants";
import { cart as cartCopy } from "lib/editorial";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { createCartAndSetCookie } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

/**
 * Cart drawer with instant checkout and smooth quantity adjustment.
 */
export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  const variantTotals = cart?.lines.reduce<Record<string, number>>(
    (totals, line) => {
      totals[line.merchandise.id] =
        (totals[line.merchandise.id] ?? 0) + line.quantity;
      return totals;
    },
    {},
  );

  useEffect(() => {
    const currentQty = cart?.totalQuantity ?? 0;
    const prevQty = quantityRef.current ?? 0;
    quantityRef.current = currentQty;

    // Only auto-open if quantity increased (e.g. user added an item from product page)
    if (currentQty > prevQty && !isOpen) {
      setIsOpen(true);
    }
  }, [isOpen, cart?.totalQuantity]);

  // Handle browser back button (popstate, BFCache pageshow, focus, tab visibility)
  useEffect(() => {
    const resetRedirecting = () => {
      setIsRedirecting(false);
    };
    window.addEventListener("pageshow", resetRedirecting);
    window.addEventListener("popstate", resetRedirecting);
    window.addEventListener("focus", resetRedirecting);
    document.addEventListener("visibilitychange", resetRedirecting);
    return () => {
      window.removeEventListener("pageshow", resetRedirecting);
      window.removeEventListener("popstate", resetRedirecting);
      window.removeEventListener("focus", resetRedirecting);
      document.removeEventListener("visibilitychange", resetRedirecting);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsRedirecting(false);
    }
  }, [isOpen]);

  const handleCheckout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isRedirecting) return;
    setIsRedirecting(true);

    if (!cart || cart.lines.length === 0) {
      setIsRedirecting(false);
      return;
    }

    if (cart.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      setIsRedirecting(false);
    }
  };

  return (
    <>
      <button
        aria-label="Open cart"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openCart}
      >
        <OpenCart quantity={cart?.totalQuantity} />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-60">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-foreground/30"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] duration-600"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in duration-400"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              onClick={() => {
                if (isRedirecting) setIsRedirecting(false);
              }}
              className="fixed inset-y-0 right-0 flex w-full flex-col border-l border-border bg-background md:w-[26rem]"
            >
              <div className="flex items-center justify-between border-b border-border px-7 py-5">
                <Dialog.Title className="t-eyebrow text-muted-foreground">
                  {cartCopy.title}
                </Dialog.Title>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors duration-(--duration-base) hover:text-foreground"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.2} />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
                  <p className="t-editorial text-foreground">
                    {cartCopy.emptyHeading}
                  </p>
                  <p className="t-body mt-3 text-muted-foreground">
                    {cartCopy.emptyBody}
                  </p>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                  <ul className="grow overflow-y-auto px-7">
                    {[...cart.lines]
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="flex gap-4 border-b border-border py-6"
                          >
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="relative h-28 w-20 flex-none overflow-hidden bg-surface"
                            >
                              <Image
                                className="h-full w-full object-cover"
                                width={80}
                                height={112}
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText || item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col">
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="t-product-title pr-6 leading-snug hover:text-accent-deep"
                              >
                                {item.merchandise.product.title}
                              </Link>

                              {item.merchandise.title !== DEFAULT_OPTION &&
                              !item.attributes?.some(
                                (a) => a.key === "Custom Size",
                              ) ? (
                                <p className="t-caption mt-1">
                                  {item.merchandise.title}
                                </p>
                              ) : null}

                              {item.attributes?.map((attr) => (
                                <p
                                  key={attr.key}
                                  className="t-caption mt-1 text-muted-foreground"
                                >
                                  <span className="text-foreground">
                                    {attr.key}:
                                  </span>{" "}
                                  {attr.value}
                                </p>
                              ))}

                              <Price
                                className="mt-2 text-muted-foreground"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={
                                  item.cost.totalAmount.currencyCode
                                }
                              />

                              <div className="mt-auto flex items-center justify-between pt-4">
                                <div className="flex flex-col gap-1">
                                  <div className="flex h-9 items-center border border-border">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <p className="w-8 text-center font-sans text-xs tabular-nums">
                                      {item.quantity}
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                      maxAvailable={Math.max(
                                        0,
                                        MAX_VARIANT_QUANTITY -
                                          ((variantTotals?.[
                                            item.merchandise.id
                                          ] ?? 0) -
                                            item.quantity),
                                      )}
                                    />
                                  </div>
                                </div>

                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  <div className="border-t border-border px-7 py-6">
                    <dl className="flex flex-col gap-2.5">
                      <div className="flex items-baseline justify-between">
                        <dt className="t-caption">{cartCopy.taxesLabel}</dt>
                        <Price
                          className="text-muted-foreground"
                          amount={cart.cost.totalTaxAmount.amount}
                          currencyCode={cart.cost.totalTaxAmount.currencyCode}
                        />
                      </div>
                      <div className="flex items-baseline justify-between">
                        <dt className="t-caption">{cartCopy.shippingLabel}</dt>
                        <dd className="t-caption">{cartCopy.shippingNote}</dd>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
                        <dt className="t-nav text-foreground">
                          {cartCopy.totalLabel}
                        </dt>
                        <Price
                          className="text-sm tracking-[0.1em] text-foreground"
                          amount={cart.cost.totalAmount.amount}
                          currencyCode={cart.cost.totalAmount.currencyCode}
                        />
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isRedirecting}
                      className={clsx(
                        "btn btn-filled mt-6 flex w-full items-center justify-center text-center",
                        { "pointer-events-none opacity-80": isRedirecting },
                      )}
                    >
                      {isRedirecting ? (
                        <LoadingDots className="bg-background" />
                      ) : (
                        cartCopy.checkoutLabel
                      )}
                    </button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
