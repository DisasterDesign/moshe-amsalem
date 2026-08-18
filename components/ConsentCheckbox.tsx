import Link from "next/link";

/**
 * Privacy consent, required on every lead form.
 * Unchecked by default and enforced by `required` - consent has to be an
 * affirmative act, not something the user has to opt out of.
 */
export default function ConsentCheckbox({
  id,
  checked,
  onChange,
  tone = "light",
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tone?: "light" | "dark";
}) {
  const text = tone === "dark" ? "text-light-secondary" : "text-ink-soft";
  const link = tone === "dark" ? "text-gold" : "text-primary";

  return (
    <div className="flex items-start gap-2.5">
      <input
        type="checkbox"
        id={id}
        name="consent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#27717F]"
      />
      <label htmlFor={id} className={`cursor-pointer text-sm leading-relaxed ${text}`}>
        אני מאשר/ת את{" "}
        <Link
          href="/legal/privacy"
          className={`font-medium underline underline-offset-2 ${link}`}
          target="_blank"
        >
          מדיניות הפרטיות
        </Link>{" "}
        ואת השימוש בפרטים שמסרתי לצורך יצירת קשר חוזר בלבד
      </label>
    </div>
  );
}
