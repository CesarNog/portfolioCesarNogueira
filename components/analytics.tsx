import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// Falls back to the registered site ID so Hotjar is always active even without an env var
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID || "173193";

export function Analytics() {
  return (
    <>
      {/* Vercel Web Analytics */}
      <VercelAnalytics />

      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure',
              });
            `}
          </Script>
        </>
      )}

      {/* Hotjar — ID configurable via NEXT_PUBLIC_HOTJAR_ID env var */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
    </>
  );
}
