import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter_Tight, Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { MotionProvider } from "@/components/motion-provider";
import { siteConfig, certifications, capabilities } from "@/lib/site-config";
import { Analytics } from "@/components/analytics";
import { ConsoleGreeting } from "@/components/ui/console-greeting";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap", weight: ["400", "500", "600"] });

const OG_TITLE = `${siteConfig.name} — ${siteConfig.shortRole}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: OG_TITLE,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    ...siteConfig.keywords,
    "Cloud Architect Portugal",
    "FinOps Consultant Europe",
    "Principal Cloud Engineer",
    "GCP Certified Architect",
    "Platform Engineering Remote",
    "UP2CLOUD",
    "César Nogueira",
    "Cesar Augusto Nogueira",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.company,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR", "es_ES", "fr_FR", "zh_CN"],
    url: siteConfig.url,
    title: OG_TITLE,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: OG_TITLE,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cesarnog_eu",
    creator: "@cesarnog_eu",
    title: OG_TITLE,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image.png", alt: OG_TITLE }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en": siteConfig.url,
      "pt-BR": siteConfig.url,
      "es": siteConfig.url,
      "fr": siteConfig.url,
      "zh": siteConfig.url,
      "x-default": siteConfig.url,
    },
  },
};

export const viewport = { themeColor: "#08090c" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${interTight.variable} ${hanken.variable} tracking-tight-body antialiased`}
        suppressHydrationWarning
      >
        {/* Tab visibility — pauses aurora/canvas when page hidden, saves battery */}
        <Script id="tab-visibility" strategy="afterInteractive">
          {`(function(){var b=document.body;document.addEventListener('visibilitychange',function(){b.classList.toggle('tab-hidden',document.hidden);});})();`}
        </Script>

        {/* JSON-LD structured data — Person + WebSite + ProfessionalService graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${siteConfig.url}/#person`,
                  name: siteConfig.name,
                  alternateName: "Cesar Nogueira",
                  url: siteConfig.url,
                  email: `mailto:${siteConfig.links.email}`,
                  telephone: siteConfig.links.phone,
                  jobTitle: "Principal Cloud Architect",
                  description: siteConfig.description,
                  image: `${siteConfig.url}/portrait.webp`,
                  knowsLanguage: ["en", "pt", "es"],
                  sameAs: [
                    siteConfig.links.linkedin,
                    siteConfig.links.github,
                    siteConfig.links.x,
                  ],
                  worksFor: { "@id": `${siteConfig.url}/#organization` },
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Vila Real",
                    addressCountry: "PT",
                  },
                  knowsAbout: siteConfig.knowsAbout,
                  hasCredential: certifications.flatMap((group) =>
                    group.items.map((item) => ({
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "certification",
                      name: item.name,
                      recognizedBy: { "@type": "Organization", name: group.group },
                    })),
                  ),
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}/#website`,
                  url: siteConfig.url,
                  name: siteConfig.name,
                  description: siteConfig.description,
                  inLanguage: ["en", "pt-BR", "es", "fr", "zh"],
                  publisher: { "@id": `${siteConfig.url}/#person` },
                },
                {
                  "@type": "ProfessionalService",
                  "@id": `${siteConfig.url}/#organization`,
                  name: siteConfig.company,
                  url: siteConfig.url,
                  description:
                    "Independent Principal Cloud Architect and FinOps consultancy — multi-cloud architecture, Platform Engineering, DevOps and cloud cost optimization for enterprise teams worldwide.",
                  image: `${siteConfig.url}/opengraph-image.png`,
                  email: `mailto:${siteConfig.links.email}`,
                  telephone: siteConfig.links.phone,
                  founder: { "@id": `${siteConfig.url}/#person` },
                  areaServed: "Worldwide",
                  priceRange: "$$",
                  knowsAbout: siteConfig.knowsAbout,
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Cloud Engineering Services",
                    itemListElement: capabilities.map((cap) => ({
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: cap.area,
                        description: cap.note,
                      },
                    })),
                  },
                },
              ],
            }),
          }}
        />

        <Analytics />
        <ConsoleGreeting />

        <ThemeProvider>
          <I18nProvider>
            <MotionProvider>{children}</MotionProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
