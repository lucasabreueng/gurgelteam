import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Swiper 11 é ESM puro; sem transpile o bundler pode quebrar em runtime.
  transpilePackages: ["swiper"],
};

export default nextConfig;
