"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { SizeGuideTabs } from "./size-guide-tabs";

export type { SizeGuideTab } from "./size-guide-tabs";

export function SizeGuideModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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

              {/* Shared tab UI — compact mode for the modal */}
              <SizeGuideTabs compact />
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
      className={`t-nav inline-flex items-center gap-1.5 text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground cursor-pointer text-[0.6875rem] tracking-wider${className ? ` ${className}` : ""}`}
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
