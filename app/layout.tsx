import type { Metadata } from "next";
import { Assistant, Heebo } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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
  title: "עו״ד משה אמסלם | מקרקעין והתחדשות עירונית",
  description:
    "משרד עורכי דין המתמחה במקרקעין, התחדשות עירונית, עסקאות נדל״ן, צוואות וירושות. ליווי משפטי מקצועי ואישי, פנים אל פנים.",
  keywords:
    "עורך דין, מקרקעין, התחדשות עירונית, תמא 38, פינוי בינוי, צוואות, ירושות, הסכמי ממון",
  icons: {
    icon: "/sinbol.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${heebo.variable}`}>
      <body className="font-sans antialiased bg-cream text-ink">
        <Sidebar />
        <div className="md:mr-72">
          <main className="pt-16 md:pt-0">{children}</main>
          <Footer />
        </div>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
