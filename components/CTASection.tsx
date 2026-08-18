import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import { waLink, WA_MESSAGES } from "@/config/site";

export default function CTASection({
  title = "מחפשים",
  highlight = "ליווי משפטי",
  titleSuffix = "שרואה אתכם?",
  description = "פגישת ייעוץ ראשונית ללא התחייבות. נשמח ללוות אתכם בכל שלבי העסקה - באופן אישי, זמין וברור.",
}: {
  title?: string;
  highlight?: string;
  titleSuffix?: string;
  description?: string;
}) {
  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="heading-lg mb-6 text-white">
            {title} <span className="text-gold">{highlight}</span> {titleSuffix}
          </h2>
          <p className="mb-8 text-lg text-light-secondary">{description}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={waLink(WA_MESSAGES.meeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <MessageCircle size={20} aria-hidden="true" />
              שיחה מהירה בוואטסאפ
            </a>
            <Link
              href="/contact"
              className="w-full rounded-lg border-2 border-white/70 px-6 py-3 text-center font-semibold text-white
                         transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-dark sm:w-auto"
            >
              השארת פרטים
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
