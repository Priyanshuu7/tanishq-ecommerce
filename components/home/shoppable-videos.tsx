import { customerReels } from "lib/editorial";
import { getProduct } from "lib/shopify";
import { ShoppableVideosCarousel } from "./shoppable-videos-carousel";

export async function ShoppableVideos() {
  const { videos, eyebrow, heading, description } = customerReels;
  if (!videos || videos.length === 0) return null;

  // Fetch real Shopify products in parallel so thumbnail, title, and live price match
  const videosWithProducts = await Promise.all(
    videos.map(async (reel) => {
      let product = null;
      try {
        product = await getProduct(reel.productHandle);
      } catch (e) {
        console.error(`Failed to load product '${reel.productHandle}' for reel`, e);
      }
      return {
        ...reel,
        product: product ?? null,
      };
    }),
  );

  return (
    <ShoppableVideosCarousel
      videos={videosWithProducts}
      eyebrow={eyebrow}
      heading={heading}
      description={description}
    />
  );
}
