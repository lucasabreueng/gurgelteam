import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Swiper 11 é ESM puro; sem transpile o Webpack pode quebrar em runtime
  // (__webpack_modules__[moduleId] is not a function).
  transpilePackages: ["swiper"],
};

export default nextConfig;
