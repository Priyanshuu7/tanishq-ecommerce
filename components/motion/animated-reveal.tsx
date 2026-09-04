"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type RevealVariant = "up" | "fade" | "mask" | "zoom";

type AnimatedRevealProps = {
  /** Element to render. Defaults to a div — pass a semantic tag where one fits. */
  as?: ElementType;
  /**
   * Which motion to use. The movement itself is declared in app/globals.css
   * under `[data-reveal]`, so this component only decides *when* to trigger.
   *
   * - `up`   — rises and fades (default)
   * - `fade` — opacity only
   * - `mask` — wipes up from behind its own baseline; needs an overflow-hidden parent
   * - `zoom` — settles out of a slow scale, for imagery
   */
  variant?: RevealVariant;
  /** Stagger, in milliseconds. Pass `index * 90` for sequences. */
  delay?: number;
  /** Fraction of the element that must be visible before it triggers. */
  threshold?: number;
  /** Trigger early or late relative to the viewport edge. */
  rootMargin?: string;
  /** Set false to re-hide and replay when the element leaves the viewport. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
};

/**
 * Reveals its children when they scroll into view.
 *
 * The whole site shares this one observer implementation so the logic exists
 * in a single place, and so `prefers-reduced-motion` can be handled globally
 * in CSS rather than per-component.
 *
 * Hydration-safe: the server and the client's first render both emit the
 * element without `data-visible`. The attribute is only added in an effect.
 */
export function AnimatedReveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
  className,
  style,
  id,
  children,
}: AnimatedRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Older browsers and non-DOM environments: show the content, skip the motion.
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={variant}
      data-visible={isVisible ? "true" : undefined}
      style={
        delay
          ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties)
          : style
      }
    >
      {/* The mask variant clips an inner span rather than this element.
          Chromium folds clip-path into the rectangle IntersectionObserver
          measures, so clipping the observed node would hold its ratio at 0 and
          the reveal would never trigger. Text children only — see globals.css. */}
      {variant === "mask" ? (
        <span data-reveal-mask="">{children}</span>
      ) : (
        children
      )}
    </Tag>
  );
}
