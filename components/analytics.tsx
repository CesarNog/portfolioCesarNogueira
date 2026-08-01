import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-SQR8VVTFEK';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
// Falls back to the registered site ID so Hotjar is always active even without an env var
const configuredHotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;
const HOTJAR_ID =
  configuredHotjarId && /^[0-9]+$/.test(configuredHotjarId)
    ? configuredHotjarId
    : "173193";

export function Analytics() {
  const gtagId = GA_ID || GOOGLE_ADS_ID;

  return (
    <>
      {/* Vercel Web Analytics */}
      <VercelAnalytics />

      {/* Google Analytics 4 + Google Ads (same gtag.js loader, config'd for whichever IDs are set) */}
      {gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure',
              });` : ""}
              ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
              (window.__cnVitalsQueue || []).splice(0).forEach(function(m){ window.__cnSendVital(m); });
            `}
          </Script>
        </>
      )}

      {/* Core Web Vitals → GA4 performance events */}
      <WebVitalsReporter />

      {/* Hotjar — deferred behind first user interaction or 6 s idle to avoid TBT impact on bounces */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(){
            if(location.protocol!=='https:')return;
            var loaded=false;
            function load(){
              if(loaded)return;loaded=true;
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            }
            ['pointerdown','keydown','scroll','touchstart'].forEach(function(e){
              window.addEventListener(e,load,{once:true,passive:true});
            });
            if(window.requestIdleCallback){requestIdleCallback(load,{timeout:6000});}
            else{setTimeout(load,6000);}
          })();
        `}
      </Script>
    </>
  );
}
