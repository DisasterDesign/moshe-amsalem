import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { legalLinks } from "@/config/nav";
import { practiceAreas } from "@/content/practiceAreas";
import { siteConfig, waLink, WA_MESSAGES } from "@/config/site";

const quickLinks = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/services", label: "תחומי עיסוק" },
  { href: "/articles", label: "מאמרים" },
  { href: "/projects", label: "פרויקטים" },
  { href: "/contact", label: "צור קשר" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark">
      <div className="container-custom py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="לעמוד הבית">
              <Image
                src="/sinbol.svg"
                alt=""
                width={64}
                height={64}
                className="h-14 w-14 rounded-xl"
              />
              <span className="leading-tight">
                <span className="block font-heading text-lg font-bold text-white">
                  {siteConfig.name}
                </span>
                <span className="block text-sm text-gold">{siteConfig.role}</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-light-secondary">
              ליווי משפטי אישי ומקצועי בעסקאות מקרקעין, התחדשות עירונית, צוואות
              וירושות והסכמי ממון.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-light-secondary transition-all duration-300 hover:bg-gold hover:text-dark"
                aria-label="פייסבוק"
              >
                <Facebook size={18} />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-light-secondary transition-all duration-300 hover:bg-gold hover:text-dark"
                aria-label="אינסטגרם"
              >
                <Instagram size={18} />
              </a>
              <a
                href={waLink(WA_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-light-secondary transition-all duration-300 hover:bg-whatsapp hover:text-white"
                aria-label="וואטסאפ"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="mb-4 font-heading font-bold text-white">
              ניווט
            </h2>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-secondary transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Practice areas */}
          <nav aria-labelledby="footer-areas">
            <h2 id="footer-areas" className="mb-4 font-heading font-bold text-white">
              תחומי עיסוק
            </h2>
            <ul className="space-y-2.5">
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/services/${area.slug}`}
                    className="text-sm text-light-secondary transition-colors hover:text-gold"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="mb-4 font-heading font-bold text-white">יצירת קשר</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 text-sm text-light-secondary transition-colors hover:text-gold"
                >
                  <Phone size={16} className="flex-shrink-0" />
                  <span dir="ltr">{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-sm text-light-secondary transition-colors hover:text-gold"
                >
                  <Mail size={16} className="flex-shrink-0" />
                  <span dir="ltr">{siteConfig.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-light-secondary">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>
                  {siteConfig.address.street}, {siteConfig.address.city}
                  <br />
                  {siteConfig.address.detail}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-light-secondary">
                <Clock size={16} className="flex-shrink-0" />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-light-tertiary transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs leading-relaxed text-light-tertiary/80">
            האמור באתר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי או תחליף לו.
            אין להסתמך על תוכן האתר ללא קבלת ייעוץ פרטני המתאים לנסיבות המקרה.
          </p>

          <div className="mt-5 flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-sm text-light-tertiary">
              © {new Date().getFullYear()} {siteConfig.name}. כל הזכויות שמורות.
            </p>
            <a
              href="https://www.fuzionwebz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-light-tertiary opacity-50 transition-opacity duration-300 hover:opacity-90"
            >
              Built by Fuzion
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
