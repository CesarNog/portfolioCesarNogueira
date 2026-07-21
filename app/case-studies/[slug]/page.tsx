import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, projects } from "@/lib/site-config";
import { CaseStudyHeader } from "@/components/case-study-header";
import { SiteFooter } from "@/components/site-footer";
import { CaseStudyBody } from "@/components/case-study-body";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

function getProject(slug: string) {
  return projects.find((p) => p.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.title} — Case Study`;
  const description = `${project.outcome} Real ${project.category.toLowerCase()} engagement for ${project.client}, delivered by ${siteConfig.name}.`;
  const url = `${siteConfig.url}/case-studies/${project.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
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
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const url = `${siteConfig.url}/case-studies/${project.id}`;
  const publishedDate = "2026-07-21";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `${project.title} — Case Study`,
        description: project.outcome,
        url,
        datePublished: publishedDate,
        dateModified: publishedDate,
        author: { "@id": `${siteConfig.url}/#person` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        about: project.category,
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteConfig.url}/case-studies` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
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
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
          <Link href="/" className="transition-colors hover:text-[var(--color-fg)]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/case-studies" className="transition-colors hover:text-[var(--color-fg)]">Case Studies</Link>
        </nav>
        <CaseStudyBody project={project} />
      </main>
      <SiteFooter />
    </>
  );
}
