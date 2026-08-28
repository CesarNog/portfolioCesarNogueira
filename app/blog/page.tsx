import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { blogPosts } from "@/lib/blog-posts";
import { CaseStudyHeader } from "@/components/case-study-header";
import { SiteFooter } from "@/components/site-footer";
import { BlogIndexBody } from "@/components/blog-index-body";

const title = "Field Notes — Cloud, FinOps & Platform Engineering";
const description = siteConfig.blogDescription;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `${title} · ${siteConfig.name}`,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ${siteConfig.name}`,
    description,
    images: [{ url: "/opengraph-image", alt: title }],
  },
};

export default function BlogIndexPage() {
  const url = `${siteConfig.url}/blog`;
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
        hasPart: blogPosts.map((post) => ({
          "@type": "Article",
          "@id": `${siteConfig.url}/blog/${post.slug}#article`,
          url: `${siteConfig.url}/blog/${post.slug}`,
          headline: post.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Field Notes", item: url },
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
        <BlogIndexBody />
      </main>
      <SiteFooter />
    </>
  );
}
