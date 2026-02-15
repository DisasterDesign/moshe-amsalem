import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-dark-tertiary py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-light-tertiary text-sm">
            © {new Date().getFullYear()} עו״ד משה אמסלם. כל הזכויות שמורות.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/moshiko.amsalem.7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-tertiary hover:text-primary hover:scale-125 hover:-translate-y-1 transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/moshiko_amsalem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-tertiary hover:text-primary hover:scale-125 hover:-translate-y-1 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://wa.me/972524337633?text=%D7%94%D7%99%D7%99%20%D7%9E%D7%A9%D7%94%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%90%D7%9C%D7%99%D7%9A%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-tertiary hover:text-primary hover:scale-125 hover:-translate-y-1 transition-all duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Credit */}
        <div className="mt-4 text-center">
          <a
            href="https://www.fuzionwebz.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-light-tertiary opacity-40 hover:opacity-80 transition-opacity duration-300"
          >
            Built by Fuzion
          </a>
        </div>
      </div>
    </footer>
  );
}
