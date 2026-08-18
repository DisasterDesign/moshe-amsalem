import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "./Reveal";
import { iconFor } from "./practiceIcons";

export default function ServiceCard({
  slug,
  title,
  description,
  index,
}: {
  slug: string;
  title: string;
  description: string;
  index: number;
}) {
  const Icon = iconFor(slug);

  return (
    <Reveal as="div" index={index} className="h-full">
    <article
      className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm
                 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40
                 hover:shadow-xl hover:shadow-primary/10 focus-within:border-primary/40"
    >
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10
                   transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-primary"
        aria-hidden="true"
      >
        <Icon className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-white" />
      </div>

      <h3 className="mb-3 font-heading text-xl font-bold text-ink transition-colors duration-300 group-hover:text-primary">
        <Link href={`/services/${slug}`}>
          {title}
          <span className="absolute inset-0" aria-hidden="true" />
        </Link>
      </h3>

      <p className="mb-5 flex-1 leading-relaxed text-ink-soft">{description}</p>

      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        לפרטים נוספים
        <ArrowLeft size={15} aria-hidden="true" />
      </span>
    </article>
    </Reveal>
  );
}
