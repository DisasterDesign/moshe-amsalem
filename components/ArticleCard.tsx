import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Article } from "@/content/types";

const CATEGORY_TONE: Record<string, string> = {
  "מקרקעין": "from-[#27717F] to-[#153243]",
  "מיסוי מקרקעין": "from-[#327B87] to-[#1F5563]",
  "התחדשות עירונית": "from-[#2A6072] to-[#153243]",
  "צוואות וירושות": "from-[#3D5560] to-[#153243]",
  "משפחה": "from-[#8A6437] to-[#5C4224]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ArticleCard({ article }: { article: Article }) {
  const tone = CATEGORY_TONE[article.category] ?? "from-[#27717F] to-[#153243]";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      {/* Cover. A generated gradient plate until the client supplies imagery. */}
      <Link
        href={`/articles/${article.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className={`absolute inset-0 bg-gradient-to-bl ${tone}`} />
        <span className="absolute inset-x-0 top-0 h-24 bg-white/10 blur-2xl" />
        <span className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <span className="font-heading text-lg font-bold leading-snug text-white">
            {article.title}
          </span>
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">
          {article.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} aria-hidden="true" />
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} aria-hidden="true" />
            {article.readingMinutes} דקות קריאה
          </span>
        </div>

        <h3 className="mb-2 font-heading text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </h3>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>

        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          קראו עוד
          <ArrowLeft size={15} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
