"use client";

import { useRef, useState } from "react";
import { Check, Download, FileText, Loader2 } from "lucide-react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import ConsentCheckbox from "./ConsentCheckbox";
import TurnstileField, { TURNSTILE_ENABLED } from "./TurnstileField";
import { leadMagnet } from "@/content/home";

/**
 * Checklist download gated behind a short form.
 *
 * The PDF itself comes from the client. Until `LEAD_MAGNET_URL` is set on the
 * Pages project the function still captures the lead and emails the requester
 * to say the checklist is on its way, so nothing here ever hands out a dead
 * link. Once the file exists, the success state offers it directly.
 */
export default function LeadMagnet() {
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [data, setData] = useState({ name: "", phone: "", email: "", company: "" });

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
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent, turnstileToken: token }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.detail || payload.error || "שגיאה בשליחה");
      setDownloadUrl(payload.downloadUrl || "");
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
    <section className="section-padding bg-cream-soft">
      <div className="container-custom">
        <div className="grid items-center gap-10 rounded-3xl border border-line bg-white p-6 shadow-sm md:p-10 lg:grid-cols-2 lg:gap-14">
          {/* Pitch */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-ink">
              <FileText size={15} className="text-gold" aria-hidden="true" />
              צ׳קליסט להורדה
            </span>

            <h2 className="heading-lg mt-5 text-ink">{leadMagnet.heading}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{leadMagnet.subheading}</p>

            <ul className="mt-6 space-y-3">
              {leadMagnet.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10"
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                  </span>
                  <span className="text-ink-soft">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-cream-soft p-6">
            {done ? (
              <div role="status" className="py-6 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-7 w-7 text-primary" strokeWidth={3} aria-hidden="true" />
                </span>
                <h3 className="mb-2 font-heading text-lg font-bold text-ink">
                  {leadMagnet.successMessage}
                </h3>
                {downloadUrl ? (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-4 inline-flex items-center gap-2"
                  >
                    <Download size={18} aria-hidden="true" />
                    הורדת הצ׳קליסט
                  </a>
                ) : (
                  <p className="text-sm text-ink-soft">
                    שלחתי את הצ׳קליסט לכתובת הדוא״ל שמסרתם.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={submit} aria-labelledby="lead-magnet-title">
                <h3 id="lead-magnet-title" className="mb-4 font-heading font-bold text-ink">
                  לאן לשלוח את הצ׳קליסט?
                </h3>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="lm-name" className="sr-only-focusable">
                      שם מלא
                    </label>
                    <input
                      id="lm-name"
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
                    <label htmlFor="lm-phone" className="sr-only-focusable">
                      טלפון
                    </label>
                    <input
                      id="lm-phone"
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
                    <label htmlFor="lm-email" className="sr-only-focusable">
                      דוא״ל
                    </label>
                    <input
                      id="lm-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="input-field"
                      placeholder="דוא״ל"
                    />
                  </div>
                </div>

                {/* Honeypot */}
                <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                  <label htmlFor="lm-company">אל תמלאו שדה זה</label>
                  <input
                    id="lm-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={data.company}
                    onChange={(e) => setData({ ...data, company: e.target.value })}
                  />
                </div>

                <div className="mt-4">
                  <ConsentCheckbox id="lm-consent" checked={consent} onChange={setConsent} />
                </div>

                <div className="mt-4">
                  <TurnstileField
                    ref={turnstileRef}
                    onToken={setToken}
                    appearance="interaction-only"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-4 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      <span>שולח...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} aria-hidden="true" />
                      {leadMagnet.buttonLabel}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
