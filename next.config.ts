export default {
  cacheComponents: true,

  experimental: {
    optimizePackageImports: ["@headlessui/react", "@heroicons/react"],
  },

  images: {
    dangerouslyAllowLocalIP: true,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "media.w3.org",
      },

      // ADD THIS
      {
        protocol: "https",
        hostname: "cdn.shivranjanisolanki.com",
        pathname: "/**",
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
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
    ];
  },
};
