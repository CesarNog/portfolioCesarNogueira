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
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
