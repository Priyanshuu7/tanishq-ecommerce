import { AnimatedReveal } from "components/motion/animated-reveal";
import { newsletter } from "lib/editorial";

/**
 * Newsletter band.
 *
 * PRESENTATION ONLY. There is no email backend in this project, so the field
 * accepts input but the submit is disabled and labelled as such — rather than
 * silently discarding addresses.
 *
 * TODO(backend): to activate, add a Server Action that posts to your email
 * provider (Klaviyo / Mailchimp / Shopify Customer API), set it as the form's
 * `action`, drop the `disabled` on the button, and delete `disabledNote` from
 * lib/editorial.ts.
 */
export function Newsletter() {
  return (
    <section className="border-y border-border bg-surface">
      <AnimatedReveal
        as="div"
        variant="fade"
        className="layout-text section-y-sm text-center"
      >
        <h2 className="t-section">{newsletter.heading}</h2>
        <p className="t-body mx-auto mt-5 max-w-md text-muted-foreground">
          {newsletter.body}
        </p>

        <form className="mx-auto mt-10 flex max-w-md items-end gap-4">
          <label className="flex-1 text-left">
            <span className="sr-only">{newsletter.placeholder}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={newsletter.placeholder}
              className="t-nav w-full border-0 border-b border-foreground/25 bg-transparent py-3 tracking-[0.1em] normal-case text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-hidden focus-visible:ring-0"
            />
          </label>
          <button
            type="submit"
            disabled
            title={newsletter.disabledNote}
            className="btn btn-primary px-8 py-3.5"
          >
            {newsletter.submitLabel}
          </button>
        </form>

        <p className="t-caption mt-4">{newsletter.disabledNote}</p>
      </AnimatedReveal>
    </section>
  );
}
