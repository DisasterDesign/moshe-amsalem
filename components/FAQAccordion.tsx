import { Plus } from "lucide-react";
import Reveal from "./Reveal";
import type { Faq } from "@/content/types";

/**
 * Native `<details>` rather than a JS accordion: keyboard and screen-reader
 * behaviour comes for free, it works with JS disabled, and browser find-in-page
 * can open a closed answer.
 */
export default function FAQAccordion({ items }: { items: Faq[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, i) => (
        <Reveal key={item.q} index={i}>
          <details className="group rounded-2xl border border-line bg-white shadow-sm transition-colors open:border-primary/40">
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 p-5
                         font-heading font-bold text-ink transition-colors hover:text-primary
                         [&::-webkit-details-marker]:hidden"
            >
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full
                           bg-primary/10 text-primary transition-transform duration-300
                           group-open:rotate-45"
              >
                <Plus size={17} />
              </span>
            </summary>
            <div className="px-5 pb-5 text-ink-soft leading-relaxed">{item.a}</div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
