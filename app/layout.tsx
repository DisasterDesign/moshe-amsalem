import type { Metadata } from "next";
import { Assistant, Heebo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import GoogleReviewsBadge from "@/components/GoogleReviewsBadge";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import CookieBanner from "@/components/CookieBanner";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { practiceAreas } from "@/content/practiceAreas";
import { siteConfig } from "@/config/site";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "עו״ד משה אמסלם | מקרקעין והתחדשות עירונית",
    template: "%s | עו״ד משה אמסלם",
  },
  description:
    "משרד עורכי דין המתמחה במקרקעין, התחדשות עירונית, עסקאות נדל״ן, צוואות וירושות. ליווי משפטי מקצועי ואישי, פנים אל פנים.",
  keywords:
    "עורך דין מקרקעין, התחדשות עירונית, תמא 38, פינוי בינוי, עסקאות נדלן, צוואות וירושות, הסכם ממון, ייפוי כוח מתמשך, עורך דין תל אביב",
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  icons: { icon: "/sinbol.svg" },
  robots: { index: true, follow: true },
};

// Marks JS as available so the scroll-reveal CSS can arm itself. Without this
// the page would render with everything hidden if the bundle ever fails.
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${heebo.variable}`}
      // The inline script below adds `js` before hydration, and the
      // accessibility widget adds a11y-* classes on mount.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="font-sans antialiased bg-cream text-ink">
        <a
          href="#main"
          className="sr-only-focusable fixed right-4 top-4 z-[80] rounded-lg bg-gold px-5 py-3 font-semibold text-dark"
        >
          דילוג לתוכן המרכזי
        </a>

        <Header />

        {/* Offsets the fixed header (h-20 mobile / h-24 desktop). */}
        <main id="main" className="pt-20 md:pt-24">
          {children}
        </main>

        <Footer />

        <GoogleReviewsBadge />
        <FloatingWhatsApp />
        <AccessibilityWidget />
        <CookieBanner />

        <OrganizationJsonLd areaNames={practiceAreas.map((a) => a.name)} />
      </body>
    </html>
  );
}
