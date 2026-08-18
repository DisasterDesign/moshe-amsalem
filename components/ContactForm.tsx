"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import ConsentCheckbox from "./ConsentCheckbox";
import TurnstileField, { TURNSTILE_ENABLED } from "./TurnstileField";

const subjects = [
  "עסקת מקרקעין",
  "שכירות",
  "התחדשות עירונית",
  "צוואות וירושות",
  "הסכם ממון",
  "ייפוי כוח מתמשך",
  "אחר",
];

export default function ContactForm({ source = "טופס יצירת קשר" }: { source?: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    // Honeypot. Bots fill every field they find; humans never see this one.
    company: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError("יש לאשר את מדיניות הפרטיות כדי לשלוח את הטופס");
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setError("אנא המתן לסיום אימות האבטחה");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, consent, source, turnstileToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || data.error || "שגיאה בשליחת הטופס");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", phone: "", email: "", subject: "", message: "", company: "" });
        setConsent(false);
        setTurnstileToken(null);
        turnstileRef.current?.reset();
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בשליחת הטופס, נסה שוב");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-line bg-white p-8 text-center shadow-sm"
      >
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" aria-hidden="true" />
        <h3 className="mb-2 font-heading text-xl font-bold text-ink">הטופס נשלח בהצלחה</h3>
        <p className="text-ink-soft">ניצור איתך קשר בהקדם.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-medium text-ink">
            שם מלא <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className="input-field"
            placeholder="הכנס שם מלא"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block font-medium text-ink">
            טלפון <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            inputMode="tel"
            className="input-field"
            placeholder="050-000-0000"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-medium text-ink">
            דוא״ל <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="input-field"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block font-medium text-ink">
            נושא הפנייה
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="input-field cursor-pointer"
          >
            <option value="">בחר נושא</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="mb-2 block font-medium text-ink">
          תוכן ההודעה
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="input-field resize-none"
          placeholder="ספרו לי על הפנייה שלכם..."
        />
      </div>

      {/* Honeypot - hidden from users and assistive tech, visible to naive bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="contact-company">אל תמלאו שדה זה</label>
        <input
          type="text"
          id="contact-company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6">
        <ConsentCheckbox id="contact-consent" checked={consent} onChange={setConsent} />
      </div>

      <div className="mt-6">
        <TurnstileField ref={turnstileRef} onToken={setTurnstileToken} />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span>שולח...</span>
          </>
        ) : (
          <>
            <span>שליחה</span>
            <Send size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
