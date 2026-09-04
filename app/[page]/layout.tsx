import Footer from "components/layout/footer";

/**
 * Shell for the Shopify CMS pages. The measure and vertical rhythm now live on
 * the <article> in page.tsx, so this only supplies the footer.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
