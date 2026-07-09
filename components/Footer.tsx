import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const WA_LINK =
  "https://wa.me/972524337633?text=" +
  encodeURIComponent("היי משה, הגעתי אליך דרך האתר ואשמח לפרטים נוספים");

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/10">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="font-heading text-xl font-bold text-white">עו״ד משה אמסלם</div>
            <div className="text-gold text-sm mb-4">מקרקעין והתחדשות עירונית</div>
            <p className="text-light-secondary text-sm leading-relaxed max-w-xs">
              ליווי משפטי אישי ומקצועי בעסקאות מקרקעין, התחדשות עירונית, צוואות
              וירושות והסכמי ממון.
            </p>
          </div>

          {/* Quick contact */}
          <div className="space-y-3">
            <div className="font-heading font-bold text-white mb-1">יצירת קשר</div>
            <a href="tel:052-4337633" className="flex items-center gap-3 text-light-secondary hover:text-gold transition-colors text-sm">
              <Phone size={16} /> 052-4337633
            </a>
            <a href="mailto:moshe@ams-law.com" className="flex items-center gap-3 text-light-secondary hover:text-gold transition-colors text-sm">
              <Mail size={16} /> moshe@ams-law.com
            </a>
            <p className="flex items-center gap-3 text-light-secondary text-sm">
              <MapPin size={16} /> דרך מנחם בגין 144, תל אביב
            </p>
          </div>

          {/* Social */}
          <div>
            <div className="font-heading font-bold text-white mb-3">עקבו אחריי</div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/moshiko.amsalem.7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-light-secondary hover:bg-gold hover:text-dark transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/moshiko_amsalem"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-light-secondary hover:bg-gold hover:text-dark transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-light-secondary hover:bg-whatsapp hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-light-tertiary text-sm">
            © {new Date().getFullYear()} עו״ד משה אמסלם. כל הזכויות שמורות.
          </p>
          <a
            href="https://www.fuzionwebz.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-light-tertiary opacity-50 hover:opacity-90 transition-opacity duration-300"
          >
            Built by Fuzion
          </a>
        </div>
      </div>
    </footer>
  );
}
