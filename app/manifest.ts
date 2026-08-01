import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "César Nogueira · Principal Cloud Architect",
    short_name: "César Nogueira",
    description: "Principal Cloud Architect & FinOps Consultant — UP2CLOUD",
    start_url: "/",
    display: "standalone",
    background_color: "#08090c",
    theme_color: "#08090c",
    icons: [
      { src: "/icon.svg",       sizes: "any",     type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon0.png",      sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon1.png",      sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon1.png",      sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
