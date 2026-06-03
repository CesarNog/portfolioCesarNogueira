import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight, Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { MotionProvider } from "@/components/motion-provider";
import { siteConfig } from "@/lib/site-config";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.shortRole}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.shortRole}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.shortRole}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.shortRole}`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
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
        {/* Tab visibility script — pauses canvas loop when tab hidden */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var b=document.body;document.addEventListener('visibilitychange',function(){b.classList.toggle('tab-hidden',document.hidden);});})();` }} />
        {/* Hidden Netlify form declaration — required for static export form detection */}
        <form name="contact" data-netlify="true" hidden aria-hidden="true">
          <input type="hidden" name="form-name" value="contact" />
          <input name="name" type="text" />
          <input name="email" type="email" />
          <input name="subject" type="text" />
          <textarea name="message" />
        </form>
        <Analytics />
        <ThemeProvider>
          <I18nProvider>
            <MotionProvider>{children}</MotionProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
