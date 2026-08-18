import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Star } from "lucide-react";
import HeroLeadForm from "./HeroLeadForm";
import { waLink, WA_MESSAGES } from "@/config/site";
import { heroBenefits } from "@/content/home";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* soft accent shapes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container-custom relative pb-10 pt-12 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Text */}
          <div className="order-1 text-center lg:text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              עו״ד משה אמסלם · מקרקעין והתחדשות עירונית
            </span>

            <h1 className="heading-xl mt-6 text-ink">
              ליווי משפטי <span className="text-primary">אישי</span>,
              <br className="hidden sm:block" /> מהמשא ומתן ועד המפתח
            </h1>

            <p className="text-body mx-auto mt-5 max-w-xl lg:mx-0">
              עסקאות מקרקעין, פינוי-בינוי ותמ״א 38, צוואות וירושות והסכמי ממון -
              בגובה העיניים, בזמינות אמיתית, ובשקט הנפשי שמגיע לכם.
            </p>

            {/* Benefit checklist */}
            <ul className="mx-auto mt-7 max-w-xl space-y-3 text-right lg:mx-0">
              {heroBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gold/15"
                    aria-hidden="true"
                  >
                    <Check className="h-4 w-4 text-gold" strokeWidth={3} />
                  </span>
                  <span className="text-ink-soft">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href={waLink(WA_MESSAGES.consult)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto"
              >
                <MessageCircle size={20} aria-hidden="true" />
                שיחת ייעוץ בוואטסאפ
              </a>
              <Link href="/contact" className="btn-outline w-full text-center sm:w-auto">
                קביעת פגישה
              </Link>
            </div>

            {/* trust strip */}
            <div className="mt-8 flex items-center justify-center gap-3 text-ink-soft lg:justify-start">
              <span className="flex text-gold" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-current" />
                ))}
              </span>
              <span className="text-sm font-medium">
                דירוג 5.0 בגוגל · ליווי אישי מקצה לקצה
              </span>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative order-2 mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
            <div
              className="absolute -bottom-5 -left-5 hidden h-28 w-28 rounded-3xl border-2 border-gold/40 sm:block"
              aria-hidden="true"
            />
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[2.2rem] shadow-2xl shadow-dark/25"
              style={{
                background:
                  "radial-gradient(120% 85% at 50% 0%, #2A6072 0%, #1B3E4E 48%, #153243 100%)",
              }}
            >
              <div
                className="absolute inset-x-10 top-6 h-40 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />
              <Image
                src="/moshe-cutout.png"
                alt="עו״ד משה אמסלם"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
          </div>
        </div>

        {/* Lead form, pinned directly under the hero */}
        <div className="mt-10 lg:mt-14">
          <HeroLeadForm />
        </div>
      </div>
    </section>
  );
}
