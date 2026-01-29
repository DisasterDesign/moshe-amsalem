import { Facebook, Instagram, Linkedin } from "lucide-react";

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
              href="#"
              className="text-light-tertiary hover:text-primary hover:scale-125 hover:-translate-y-1 transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-light-tertiary hover:text-primary hover:scale-125 hover:-translate-y-1 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-light-tertiary hover:text-primary hover:scale-125 hover:-translate-y-1 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
