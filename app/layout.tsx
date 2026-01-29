import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "עו״ד משה אמסלם | מקרקעין והתחדשות עירונית",
  description: "משרד עורכי דין המתמחה במקרקעין, התחדשות עירונית, עסקאות נדל״ן, צוואות וירושות. ליווי משפטי מקצועי ואישי.",
  keywords: "עורך דין, מקרקעין, התחדשות עירונית, תמא 38, פינוי בינוי, צוואות, ירושות, הסכמי ממון",
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
    <html lang="he" dir="rtl">
      <body className={`${rubik.className} antialiased`}>
        <Sidebar />
        <div className="md:mr-72">
          <main className="pt-16 md:pt-0">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
