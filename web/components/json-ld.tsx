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

  // Escape "<" so a stray "</script>" in any value can't break out of the tag.
  const serialized = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
