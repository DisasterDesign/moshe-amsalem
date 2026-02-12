"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const subjects = [
  "עסקת מקרקעין",
  "שכירות",
  "התחדשות עירונית",
  "צוואות וירושות",
  "הסכם ממון",
  "ייפוי כוח מתמשך",
  "אחר",
];

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "שגיאה בשליחת הטופס");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בשליחת הטופס, נסה שוב");
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-secondary border border-dark-tertiary rounded-lg p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-light mb-2">הטופס נשלח בהצלחה!</h3>
        <p className="text-light-secondary">ניצור איתך קשר בהקדם.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 md:p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-light mb-2">
            שם מלא <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-dark border border-dark-tertiary rounded-lg px-4 py-3 text-light placeholder:text-light-tertiary focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
            placeholder="הכנס שם מלא"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-light mb-2">
            טלפון <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full bg-dark border border-dark-tertiary rounded-lg px-4 py-3 text-light placeholder:text-light-tertiary focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
            placeholder="050-XXX-XXXX"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-light mb-2">
            דוא״ל <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-dark border border-dark-tertiary rounded-lg px-4 py-3 text-light placeholder:text-light-tertiary focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all duration-300"
            placeholder="example@email.com"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-light mb-2">
            נושא הפנייה
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-dark border border-dark-tertiary rounded-lg px-4 py-3 text-light focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 cursor-pointer"
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

      {/* Message */}
      <div className="mt-6">
        <label htmlFor="message" className="block text-light mb-2">
          תוכן ההודעה
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full bg-dark border border-dark-tertiary rounded-lg px-4 py-3 text-light placeholder:text-light-tertiary focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 resize-none"
          placeholder="ספר/י לנו על הפנייה שלך..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>שולח...</span>
          </>
        ) : (
          <>
            <span>שליחה</span>
            <Send size={18} />
          </>
        )}
      </button>
    </motion.form>
  );
}
