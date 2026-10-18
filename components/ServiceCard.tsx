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
      className="group relative flex h-full flex-col rounded-lg border border-line bg-white p-6
                 transition-colors duration-200 hover:border-primary/50 focus-within:border-primary"
    >
      <Icon className="mb-5 h-7 w-7 text-primary" aria-hidden="true" />

      <h3 className="mb-3 font-heading text-xl font-bold text-ink group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4">
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
