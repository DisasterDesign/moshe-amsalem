import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** Dark banner at the top of every inner page, with breadcrumbs. */
export default function PageHero({
  title,
  highlight,
  subtitle,
  crumbs = [],
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
  crumbs?: { name: string; href: string }[];
}) {
  return (
    <section className="bg-dark pb-12 pt-12 md:pb-16 md:pt-16">
      <div className="container-custom">
        {crumbs.length > 0 && (
          <nav aria-label="מסלול ניווט" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-light-tertiary">
              <li>
                <Link href="/" className="transition-colors hover:text-gold">
                  בית
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <ChevronLeft size={14} aria-hidden="true" />
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-light-secondary">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.href} className="transition-colors hover:text-gold">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <h1 className="heading-xl text-white">
          {title}
          {highlight && <span className="text-gold"> {highlight}</span>}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-light-secondary">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
