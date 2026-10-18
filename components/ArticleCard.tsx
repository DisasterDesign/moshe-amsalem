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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-colors duration-200 hover:border-primary/50 focus-within:border-primary">
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
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-3 text-xs font-semibold text-primary">{article.category}</p>
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

        <h3 className="mb-2 font-heading text-lg font-bold leading-snug text-ink group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4">
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
