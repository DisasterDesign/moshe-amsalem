import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "./ContactForm";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { mapsEmbedUrl, siteConfig, waLink, WA_MESSAGES } from "@/config/site";

const contactInfo = [
  {
    icon: Phone,
    title: "טלפון",
    value: siteConfig.phone,
    link: `tel:${siteConfig.phone}`,
    ltr: true,
  },
  {
    icon: MessageCircle,
    title: "וואטסאפ",
    value: "שליחת הודעה מהירה",
    link: waLink(WA_MESSAGES.meeting),
  },
  {
    icon: Mail,
    title: "דוא״ל",
    value: siteConfig.email,
    link: `mailto:${siteConfig.email}`,
    ltr: true,
  },
  {
    icon: MapPin,
    title: "כתובת",
    value: `${siteConfig.address.street}, ${siteConfig.address.city} · ${siteConfig.address.detail}`,
    link: "https://maps.google.com/?q=דרך+מנחם+בגין+144+תל+אביב+מגדל+מידטאון",
  },
  { icon: Clock, title: "שעות פעילות", value: siteConfig.hours, link: null },
];

export default function HomeContact({ source = "טופס יצירת קשר" }: { source?: string }) {
  return (
    <section id="contact" className="section-padding scroll-mt-28 bg-cream">
      <div className="container-custom">
        <SectionHeading
          eyebrow="כאן בשבילכם"
          title="נשמח"
          highlight="לשמוע מכם"
          description="השאירו פרטים ואחזור אליכם בהקדם, או דברו איתי ישירות בוואטסאפ."
        />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact info */}
          <Reveal className="lg:col-span-1">
            <div className="space-y-5">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10"
                    aria-hidden="true"
                  >
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 font-medium text-ink">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith("http") ? "_blank" : undefined}
                        rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        dir={info.ltr ? "ltr" : undefined}
                        className="inline-block text-ink-soft transition-colors hover:text-primary"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-ink-soft">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-line">
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום המשרד במפת גוגל"
              />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal index={1} className="lg:col-span-2">
            <ContactForm source={source} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
