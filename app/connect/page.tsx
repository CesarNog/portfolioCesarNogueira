import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { CaseStudyHeader } from "@/components/case-study-header";
import { SiteFooter } from "@/components/site-footer";
import { ConnectBody } from "@/components/connect-body";

const title = "Connect via MCP";
const description =
  `Add ${siteConfig.name}'s portfolio as an MCP connector — let your AI agent check his resume, case studies, availability, and book a project intro directly.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/connect` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/connect`,
    title: `${title} · ${siteConfig.name}`,
    description,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ${siteConfig.name}`,
    description,
    images: [{ url: "/opengraph-image.png", alt: title }],
  },
};

export default function ConnectPage() {
  const url = `${siteConfig.url}/connect`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Connect", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyHeader />
      <main className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <ConnectBody />
      </main>
      <SiteFooter />
    </>
  );
}
