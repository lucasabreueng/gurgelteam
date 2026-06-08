import type { NextConfig } from "next";

const withBundleAnalyzer = process.env.ANALYZE === "true"
  ? require("@next/bundle-analyzer")({ enabled: true })
  : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Swiper 11 é ESM puro; sem transpile o bundler pode quebrar em runtime.
  transpilePackages: ["swiper"],
  async redirects() {
    return [
      {
        source: "/500",
        destination: "/erro-servidor",
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
