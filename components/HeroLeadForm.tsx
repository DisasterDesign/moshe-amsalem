"use client";

import { useRef, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
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

/**
 * Short lead form pinned to the hero. Asks for three things only - name, phone
 * and topic - because a callback needs nothing more. The full contact form
 * lower down is where longer enquiries go.
 */
export default function HeroLeadForm({
  title = "השאירו פרטים ואחזור אליכם",
  subtitle = "שיחת היכרות קצרה, ללא עלות וללא התחייבות",
  source = "טופס מהיר - הירו",
  idPrefix = "hero",
}: {
  title?: string;
  subtitle?: string;
  source?: string;
  idPrefix?: string;
} = {}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [data, setData] = useState({ name: "", phone: "", subject: "", company: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError("יש לאשר את מדיניות הפרטיות");
      return;
    }
    if (TURNSTILE_ENABLED && !token) {
      setError("אנא המתינו לסיום אימות האבטחה");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent,
          source,
          turnstileToken: token,
        }),
      });
      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.detail || payload.error || "שגיאה בשליחה");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בשליחה, נסו שוב");
      setToken(null);
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-xl shadow-dark/10 md:p-6">
      {done ? (
        <div role="status" className="flex items-center justify-center gap-3 py-3 text-center">
          <CheckCircle className="h-8 w-8 flex-none text-primary" aria-hidden="true" />
          <div className="text-right">
            <p className="font-heading font-bold text-ink">קיבלתי את הפרטים</p>
            <p className="text-sm text-ink-soft">אחזור אליכם בהקדם.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} aria-labelledby={`${idPrefix}-form-title`}>
          <div className="mb-4 flex flex-col gap-1 text-center lg:flex-row lg:items-baseline lg:gap-3 lg:text-right">
            <h2 id={`${idPrefix}-form-title`} className="font-heading text-lg font-bold text-ink">
              {title}
            </h2>
            <p className="text-sm text-ink-muted">{subtitle}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <label htmlFor={`${idPrefix}-name`} className="sr-only-focusable">
                שם מלא
              </label>
              <input
                id={`${idPrefix}-name`}
                name="name"
                type="text"
                required
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="input-field"
                placeholder="שם מלא"
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-phone`} className="sr-only-focusable">
                טלפון
              </label>
              <input
                id={`${idPrefix}-phone`}
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="input-field"
                placeholder="טלפון"
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-subject`} className="sr-only-focusable">
                נושא הפנייה
              </label>
              <select
                id={`${idPrefix}-subject`}
                name="subject"
                value={data.subject}
                onChange={(e) => setData({ ...data, subject: e.target.value })}
                className="input-field cursor-pointer"
              >
                <option value="">נושא הפנייה</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  <span>שולח...</span>
                </>
              ) : (
                "לחזרה טלפונית"
              )}
            </button>
          </div>

          {/* Honeypot */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor={`${idPrefix}-company`}>אל תמלאו שדה זה</label>
            <input
              id={`${idPrefix}-company`}
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={data.company}
              onChange={(e) => setData({ ...data, company: e.target.value })}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <ConsentCheckbox id={`${idPrefix}-consent`} checked={consent} onChange={setConsent} />
            <TurnstileField ref={turnstileRef} onToken={setToken} appearance="interaction-only" />
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
