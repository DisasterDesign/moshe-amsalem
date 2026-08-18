import { MessageCircle, Phone } from "lucide-react";
import HeroLeadForm from "./HeroLeadForm";
import Reveal from "./Reveal";
import { siteConfig, waLink, WA_MESSAGES } from "@/config/site";

/**
 * Mid-page conversion block. The home page previously only offered a form at
 * the very bottom, so anyone who dropped off halfway had nothing to act on.
 */
export default function MidPageCta({
  title = "יש לכם שאלה על עסקה שאתם באמצע?",
  description = "אפשר לשלוח הודעה קצרה בוואטסאפ, להתקשר, או להשאיר פרטים ואחזור אליכם. בלי עלות ובלי התחייבות.",
  source = "טופס אמצע עמוד",
  idPrefix = "mid",
}: {
  title?: string;
  description?: string;
  source?: string;
  idPrefix?: string;
}) {
  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <h2 className="heading-lg text-white">{title}</h2>
            <p className="mt-4 leading-relaxed text-light-secondary">{description}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink(WA_MESSAGES.consult)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto"
              >
                <MessageCircle size={20} aria-hidden="true" />
                וואטסאפ
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2
                           border-white/70 px-6 py-3 font-semibold text-white transition-all
                           duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-dark sm:w-auto"
              >
                <Phone size={18} aria-hidden="true" />
                <span dir="ltr">{siteConfig.phone}</span>
              </a>
            </div>
          </Reveal>

          <Reveal index={1}>
            <HeroLeadForm
              title="מעדיפים שאחזור אליכם?"
              subtitle="השאירו פרטים ואחזור בהקדם"
              source={source}
              idPrefix={idPrefix}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
