import { siteConfig } from "@/lib/site-config";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    knowsAbout: siteConfig.knowsAbout,
    sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
    worksFor: {
      "@type": "ProfessionalService",
      name: `${siteConfig.name} Consulting`,
      areaServed: "Worldwide",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
