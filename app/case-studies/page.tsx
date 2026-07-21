import type { Metadata } from "next";
import { siteConfig, projects } from "@/lib/site-config";
import { CaseStudyHeader } from "@/components/case-study-header";
import { SiteFooter } from "@/components/site-footer";
import { CaseStudiesIndexBody } from "@/components/case-studies-index-body";

const title = "Case Studies";
const description =
  "Real cloud, FinOps, and platform engineering engagements — FinOps automation, big data platforms, and regulated multi-cloud banking infrastructure — delivered by César Nogueira.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/case-studies` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/case-studies`,
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

export default function CaseStudiesIndexPage() {
  const url = `${siteConfig.url}/case-studies`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#person` },
        hasPart: projects.map((p) => ({
          "@type": "Article",
          "@id": `${siteConfig.url}/case-studies/${p.id}#article`,
          url: `${siteConfig.url}/case-studies/${p.id}`,
          headline: `${p.title} — Case Study`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Case Studies", item: url },
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
      <main className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <h1 className="font-display text-[clamp(2rem,4vw+0.5rem,3.25rem)] leading-[1.1] text-[var(--color-fg)] [text-wrap:balance]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-[17px]">
          Real engagements, real numbers — the outcomes behind the résumé.
        </p>
        <CaseStudiesIndexBody />
      </main>
      <SiteFooter />
    </>
  );
}
