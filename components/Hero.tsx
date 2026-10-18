import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Star } from "lucide-react";
import { waLink, WA_MESSAGES } from "@/config/site";
import { heroBenefits } from "@/content/home";

export default function Hero() {
  return (
    <section className="bg-cream">
      <div className="container-custom pb-14 pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Text */}
          <div className="order-1 text-center lg:text-right">
            <h1 className="text-ink">
              <span className="block text-base font-semibold text-primary">
                עורך דין משה אמסלם · תל אביב
              </span>{" "}
              <span className="mt-5 block font-heading text-4xl font-bold leading-[1.2] md:text-5xl md:leading-[1.2]">
                ליווי משפטי אישי, מהמשא ומתן ועד המפתח
              </span>
            </h1>

            <p className="text-body mx-auto mt-5 max-w-xl lg:mx-0">
              עסקאות מקרקעין, פינוי-בינוי ותמ״א 38, צוואות, ירושות, הסכמי ממון
              וייפוי כוח מתמשך - בגובה העיניים, בזמינות אמיתית, ובשקט הנפשי שמגיע לכם.
            </p>

            {/* Benefit checklist */}
            <ul className="mx-auto mt-7 max-w-xl space-y-3 text-right lg:mx-0">
              {heroBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex-none text-primary"
                    aria-hidden="true"
                  >
                    <Check className="h-4 w-4" strokeWidth={2} />
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
              <Star size={18} className="flex-none fill-gold text-gold" aria-hidden="true" />
              <span className="text-sm font-medium">
                דירוג 5.0 בגוגל · ליווי אישי מקצה לקצה
              </span>
            </div>
          </div>

          {/* Portrait */}
          <div className="order-2 mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-dark-secondary">
              <Image
                src="/moshe-cutout.png"
                alt="עורך דין משה אמסלם"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
