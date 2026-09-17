export default {
  cacheComponents: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/collections/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};