import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { Article } from "@/content/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      {/*
        Decorative cover: alt="" on purpose. The title sits directly beneath and
        is itself the link, so describing the photo would only make a screen
        reader announce the same card twice.
      */}
      <div className="relative aspect-[16/9] overflow-hidden bg-dark">
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {/* Scrim so the category pill keeps its contrast on any photo. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark/55 to-transparent"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
          {article.category}
        </span>
      </div>

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
