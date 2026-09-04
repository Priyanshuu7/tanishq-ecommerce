import clsx from "clsx";

/**
 * Renders Shopify `descriptionHtml` and CMS page bodies.
 *
 * Palette and type come from `.prose-editorial` in app/globals.css; the
 * `prose-*` modifiers here handle the structural spacing that the typography
 * plugin owns.
 */
const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={clsx(
        "prose prose-editorial max-w-none",
        "prose-headings:mt-10 prose-headings:font-light prose-headings:tracking-normal",
        "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base",
        "prose-p:leading-[1.8] prose-p:font-light",
        "prose-a:font-normal prose-a:no-underline hover:prose-a:underline",
        "prose-ol:mt-6 prose-ol:list-decimal prose-ol:pl-5 prose-ul:mt-6 prose-ul:list-disc prose-ul:pl-5",
        "prose-li:marker:text-subtle",
        "prose-img:w-full prose-hr:border-border",
        "prose-blockquote:border-l prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:font-light prose-blockquote:not-italic",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
