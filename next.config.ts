import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fully static output — the whole site prerenders, so it can be hosted as
  // plain files (e.g. on Netlify) with no Next.js server runtime.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
