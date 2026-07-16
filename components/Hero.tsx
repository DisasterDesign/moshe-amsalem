import Image from "next/image";
import { Star, MessageCircle } from "lucide-react";

const WA_LINK =
  "https://wa.me/972524337633?text=" +
  encodeURIComponent("היי משה, הגעתי אליך דרך האתר ואשמח לשיחת ייעוץ");

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* soft accent shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container-custom relative grid items-center gap-12 py-14 md:py-24 lg:grid-cols-2">
        {/* Text */}
        <div className="order-2 text-center lg:order-1 lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            עו״ד משה אמסלם · מקרקעין והתחדשות עירונית
          </span>

          <h1 className="heading-xl mt-6 text-ink">
            ליווי משפטי <span className="text-primary">אישי</span>,
            <br className="hidden sm:block" /> מהמשא ומתן ועד המפתח
          </h1>

          <p className="text-body mt-6 max-w-xl mx-auto lg:mx-0">
            עסקאות מקרקעין, פינוי-בינוי ותמ״א 38, צוואות וירושות והסכמי ממון -
            בגובה העיניים, בזמינות אמיתית, ובשקט הנפשי שמגיע לכם.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              שיחת ייעוץ בוואטסאפ
            </a>
            <a href="#contact" className="btn-outline w-full sm:w-auto text-center">
              קביעת פגישה
            </a>
          </div>

          {/* trust strip */}
          <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start text-ink-soft">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium">
              לקוחות ממליצים · ליווי אישי מקצה לקצה
            </span>
          </div>
        </div>

        {/* Portrait */}
        <div className="order-1 relative mx-auto w-full max-w-md lg:order-2">
          <div className="absolute -bottom-5 -left-5 hidden h-28 w-28 rounded-3xl border-2 border-gold/40 sm:block" />
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[2.2rem] shadow-2xl shadow-dark/25"
            style={{
              background:
                "radial-gradient(120% 85% at 50% 0%, #2A6072 0%, #1B3E4E 48%, #153243 100%)",
            }}
          >
            {/* soft top glow */}
            <div className="absolute inset-x-10 top-6 h-40 rounded-full bg-white/10 blur-2xl" />
            <Image
              src="/moshe-cutout.png"
              alt="עו״ד משה אמסלם"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
