import { siteConfig } from "@/lib/site-config";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.shortRole,
    description: siteConfig.description,
    url: siteConfig.url,
    email: `mailto:${siteConfig.links.email}`,
    knowsAbout: siteConfig.knowsAbout,
    address: { "@type": "PostalAddress", addressCountry: "PT", addressLocality: "Vila Real" },
    sameAs: [siteConfig.links.linkedin, siteConfig.links.github, siteConfig.links.x],
    worksFor: {
      "@type": "ProfessionalService",
      name: siteConfig.company,
      areaServed: "Worldwide",
      description:
        "Cloud architecture, platform engineering, DevOps and FinOps consulting.",
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
