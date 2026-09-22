"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { Fragment, useState } from "react";

type SizeChartRow = {
  size: string;
  uk: number;
  bustCm: string;
  waistCm: string;
  hipCm: string;
  bustIn: string;
  waistIn: string;
  hipIn: string;
};

const SIZE_CHART: SizeChartRow[] = [
  {
    size: "XS",
    uk: 4,
    bustCm: "81.28",
    waistCm: "66.04",
    hipCm: "91.44",
    bustIn: "32",
    waistIn: "26",
    hipIn: "36",
  },
  {
    size: "S",
    uk: 6,
    bustCm: "86.36",
    waistCm: "71.12",
    hipCm: "96.52",
    bustIn: "34",
    waistIn: "28",
    hipIn: "38",
  },
  {
    size: "M",
    uk: 8,
    bustCm: "91.44",
    waistCm: "76.2",
    hipCm: "101.6",
    bustIn: "36",
    waistIn: "30",
    hipIn: "40",
  },
  {
    size: "L",
    uk: 10,
    bustCm: "96.52",
    waistCm: "81.28",
    hipCm: "106.68",
    bustIn: "38",
    waistIn: "32",
    hipIn: "42",
  },
  {
    size: "XL",
    uk: 12,
    bustCm: "101.6",
    waistCm: "86.36",
    hipCm: "111.76",
    bustIn: "40",
    waistIn: "34",
    hipIn: "44",
  },
  {
    size: "XXL",
    uk: 14,
    bustCm: "106.68",
    waistCm: "91.44",
    hipCm: "116.84",
    bustIn: "42",
    waistIn: "36",
    hipIn: "46",
  },
  {
    size: "3XL",
    uk: 16,
    bustCm: "111.76",
    waistCm: "96.52",
    hipCm: "121.92",
    bustIn: "44",
    waistIn: "38",
    hipIn: "48",
  },
  {
    size: "4XL",
    uk: 18,
    bustCm: "116.84",
    waistCm: "101.6",
    hipCm: "127",
    bustIn: "46",
    waistIn: "40",
    hipIn: "50",
  },
  {
    size: "5XL",
    uk: 20,
    bustCm: "121.92",
    waistCm: "106.68",
    hipCm: "132.08",
    bustIn: "48",
    waistIn: "42",
    hipIn: "52",
  },
  {
    size: "6XL",
    uk: 22,
    bustCm: "127",
    waistCm: "111.76",
    hipCm: "137.16",
    bustIn: "50",
    waistIn: "44",
    hipIn: "54",
  },
];

export type SizeGuideTab = "chart" | "measuring" | "video";

export function SizeGuideModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<SizeGuideTab>("chart");
  const [unit, setUnit] = useState<"in" | "cms">("cms");

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-70">
        {/* Backdrop overlay */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-foreground/45 backdrop-blur-xs"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Floating popup container */}
        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-[cubic-bezier(0.16,1,0.3,1)] duration-400"
            enterFrom="opacity-0 scale-95 translate-y-3"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition-all ease-in duration-250"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="relative w-full max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col border border-border bg-background shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8 sm:py-5">
                <Dialog.Title className="font-serif text-xl sm:text-2xl font-light tracking-wide text-foreground uppercase">
                  Size Guide
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close size guide"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Tabs Bar */}
              <div className="flex border-b border-border bg-surface/30 px-6 sm:px-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("chart")}
                  className={clsx(
                    "t-nav relative py-3.5 pr-6 transition-colors tracking-widest text-[0.6875rem] cursor-pointer",
                    activeTab === "chart"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  SIZE GUIDE
                  {activeTab === "chart" ? (
                    <span className="absolute bottom-0 left-0 right-6 h-0.5 bg-foreground" />
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("measuring")}
                  className={clsx(
                    "t-nav relative py-3.5 px-4 sm:px-6 transition-colors tracking-widest text-[0.6875rem] cursor-pointer",
                    activeTab === "measuring"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  MEASURING GUIDE
                  {activeTab === "measuring" ? (
                    <span className="absolute bottom-0 left-4 sm:left-6 right-4 sm:right-6 h-0.5 bg-foreground" />
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={clsx(
                    "t-nav relative py-3.5 pl-4 sm:pl-6 transition-colors tracking-widest text-[0.6875rem] cursor-pointer",
                    activeTab === "video"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  HOW TO MEASURE
                  {activeTab === "video" ? (
                    <span className="absolute bottom-0 left-4 sm:left-6 right-0 h-0.5 bg-foreground" />
                  ) : null}
                </button>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
                {/* TAB 1: SIZE GUIDE CHART */}
                {activeTab === "chart" && (
                  <div className="space-y-6">
                    {/* Top Row: Title + in/cms Switch */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
                      <div>
                        <h3 className="font-serif text-lg text-foreground font-normal">
                          Size Chart for Women
                        </h3>
                        <p className="t-caption text-xs text-muted-foreground mt-0.5">
                          Garment fits true to standard body measurements
                        </p>
                      </div>

                      {/* Switch Checkbox toggle: in vs cms */}
                      <div className="flex items-center gap-2.5 bg-surface/60 border border-border px-3 py-1.5 rounded-full">
                        <button
                          type="button"
                          onClick={() => setUnit("in")}
                          className={clsx(
                            "t-nav text-[0.6875rem] px-2 py-0.5 transition-colors cursor-pointer",
                            unit === "in"
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          in
                        </button>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={unit === "cms"}
                          aria-label="Toggle inches or centimeters"
                          onClick={() =>
                            setUnit((prev) => (prev === "in" ? "cms" : "in"))
                          }
                          className={clsx(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-border transition-colors duration-200 ease-in-out focus:outline-hidden",
                            unit === "cms"
                              ? "bg-foreground"
                              : "bg-muted-foreground/30",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={clsx(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-xs ring-0 transition duration-200 ease-in-out my-auto ml-0.5 mt-0.5",
                              unit === "cms"
                                ? "translate-x-4 bg-background"
                                : "translate-x-0 bg-foreground",
                            )}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => setUnit("cms")}
                          className={clsx(
                            "t-nav text-[0.6875rem] px-2 py-0.5 transition-colors cursor-pointer",
                            unit === "cms"
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          cms
                        </button>
                      </div>
                    </div>

                    {/* Size Table */}
                    <div className="overflow-x-auto border border-border">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-surface/70 text-muted-foreground">
                            <th className="py-3 px-3.5 sm:px-4 font-semibold text-[0.6875rem] tracking-wider uppercase">
                              Size ({unit === "cms" ? "in cm" : "in inches"})
                            </th>
                            <th className="py-3 px-3 sm:px-4 font-semibold text-[0.6875rem] tracking-wider uppercase">
                              UK
                            </th>
                            <th className="py-3 px-3 sm:px-4 font-semibold text-[0.6875rem] tracking-wider uppercase">
                              Bust
                            </th>
                            <th className="py-3 px-3 sm:px-4 font-semibold text-[0.6875rem] tracking-wider uppercase">
                              Waist
                            </th>
                            <th className="py-3 px-3 sm:px-4 font-semibold text-[0.6875rem] tracking-wider uppercase">
                              Hip
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-sans">
                          {SIZE_CHART.map((row, idx) => (
                            <tr
                              key={row.size}
                              className={clsx(
                                "transition-colors hover:bg-surface/50",
                                idx % 2 === 1
                                  ? "bg-surface/20"
                                  : "bg-background",
                              )}
                            >
                              <td className="py-2.5 px-3.5 sm:px-4 font-medium text-foreground tracking-wide">
                                {row.size}
                              </td>
                              <td className="py-2.5 px-3 sm:px-4 text-foreground/80 tabular-nums">
                                {row.uk}
                              </td>
                              <td className="py-2.5 px-3 sm:px-4 text-foreground tabular-nums">
                                {unit === "cms" ? row.bustCm : `${row.bustIn}"`}
                              </td>
                              <td className="py-2.5 px-3 sm:px-4 text-foreground tabular-nums">
                                {unit === "cms"
                                  ? row.waistCm
                                  : `${row.waistIn}"`}
                              </td>
                              <td className="py-2.5 px-3 sm:px-4 text-foreground tabular-nums">
                                {unit === "cms" ? row.hipCm : `${row.hipIn}"`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Sizing Help Section */}
                    <div className="mt-6 border-t border-border pt-5 space-y-3.5">
                      <div className="flex items-center gap-2 text-foreground">
                        <WhatsAppIcon className="h-5 w-5 text-emerald-700 shrink-0" />
                        <p className="text-xs sm:text-sm font-sans">
                          <span className="font-medium text-foreground">
                            WhatsApp Us at{" "}
                          </span>
                          <a
                            href="https://api.whatsapp.com/send?phone=6263326569&text=Hi!%20Could%20you%20help%20me%20with%20the%20measurement%20of%20the%20product"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-accent-deep underline underline-offset-4 hover:text-foreground transition-colors"
                          >
                            +91 62633 26569
                          </a>{" "}
                          if you are unsure of your size.
                        </p>
                      </div>

                      <p className="t-caption text-[0.75rem] leading-relaxed text-muted-foreground">
                        This is a standard size guide for basic body
                        measurements. Length will vary according to style. There
                        may also be variations in some brands commonly with
                        Indian clothing, so please refer to the product
                        measurements displayed on the product page.
                        Alternatively, you may contact our customer care for
                        specific queries at{" "}
                        <a
                          href="mailto:customercare@perniaspopupshop.com"
                          className="text-foreground underline underline-offset-2 hover:text-accent-deep transition-colors"
                        >
                          Shivranjanisolankii@gmail.com
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: MEASURING GUIDE IMAGE */}
                {activeTab === "measuring" && (
                  <div className="space-y-6">
                    <div className="border-b border-border/60 pb-3">
                      <h3 className="font-serif text-lg text-foreground font-normal">
                        Body Measurement Points
                      </h3>
                      <p className="t-caption text-xs text-muted-foreground mt-0.5">
                        Follow the reference lines below to take accurate body
                        measurements with a soft measuring tape.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-sm bg-surface/30 p-2 sm:p-4 border border-border">
                      <div className="relative w-full max-w-2xl aspect-[1.8/1] overflow-hidden flex items-center justify-center">
                        <Image
                          src="/images/size-guide/women-m-guide.jpg"
                          alt="Women Body Measuring Guide illustration with measurement callouts"
                          fill
                          sizes="(max-width: 768px) 100vw, 700px"
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-surface/40 border border-border">
                        <h4 className="font-medium text-foreground uppercase tracking-wider text-[0.6875rem]">
                          Upper Body
                        </h4>
                        <p className="t-caption text-xs mt-1 text-muted-foreground">
                          Measure Shoulder, Bust apex, Under bust, and Sleeve
                          length in an upright, relaxed posture.
                        </p>
                      </div>
                      <div className="p-3 bg-surface/40 border border-border">
                        <h4 className="font-medium text-foreground uppercase tracking-wider text-[0.6875rem]">
                          Lower Body
                        </h4>
                        <p className="t-caption text-xs mt-1 text-muted-foreground">
                          Measure natural Waist, Lower waist, Hips at the widest
                          contour, and Knee/Ankle length.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: HOW TO MEASURE VIDEO */}
                {activeTab === "video" && (
                  <div className="space-y-6">
                    <div className="border-b border-border/60 pb-3">
                      <h3 className="font-serif text-lg text-foreground font-normal">
                        How to Measure Video
                      </h3>
                      <p className="t-caption text-xs text-muted-foreground mt-0.5">
                        Watch our quick step-by-step masterclass on taking your
                        own body measurements.
                      </p>
                    </div>

                    {/* YouTube Video Player Embed */}
                    <div className="relative w-full aspect-video overflow-hidden border border-border bg-foreground shadow-inner">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/N6rGsleO0H4?rel=0&modestbranding=1"
                        title="How to Measure Body Dimensions for Clothing"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>

                    {/* Measurement Step Guidelines */}
                    <div className="space-y-3 border-t border-border pt-4">
                      <h4 className="t-eyebrow text-foreground">
                        Key Measurement Guidelines
                      </h4>
                      <ul className="space-y-2 text-xs font-sans text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-foreground min-w-[3.5rem]">
                            1. Bust:
                          </span>
                          <span>
                            Measure around the fullest part of your bust while
                            wearing a well-fitting, non-padded bra. Keep tape
                            level across the back.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-foreground min-w-[3.5rem]">
                            2. Waist:
                          </span>
                          <span>
                            Measure around your natural waistline, typically the
                            narrowest point above your belly button. Keep one
                            finger between tape and body.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-semibold text-foreground min-w-[3.5rem]">
                            3. Hips:
                          </span>
                          <span>
                            Stand with feet together and measure around the
                            fullest circumference of your hips and rear, keeping
                            the tape straight.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export function SizeGuideButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "t-nav inline-flex items-center gap-1.5 text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground cursor-pointer text-[0.6875rem] tracking-wider",
        className,
      )}
    >
      <RulerIcon className="h-3.5 w-3.5" />
      <span>Size Guide</span>
    </button>
  );
}

function RulerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.25-4.38c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39 1.54 1.54 2.39 3.59 2.39 5.77 0 4.5-3.66 8.16-8.16 8.16zm4.47-6.11c-.25-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}
