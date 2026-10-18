"use client";

import { useGoogleReviews } from "@/lib/reviews";
import { STATS } from "@/config/site";

type Stat = {
  value: number | null;
  suffix?: string;
  decimals?: number;
  label: string;
};

/** Client-supplied figures and the checked Google snapshot appear immediately. */
export default function Counters() {
  const { rating, total } = useGoogleReviews();
  const stats: Stat[] = [
    {
      value: STATS.dealsClosed,
      suffix: "+",
      label: "עסקאות שליוויתי",
    },
    {
      value: STATS.dealsValueMillions,
      label: "מיליון ₪ שווי עסקאות מצטבר",
    },
    {
      value: rating,
      decimals: 1,
      label: `דירוג גוגל · ${total} ביקורות`,
    },
  ].filter((stat) => stat.value !== null);

  if (stats.length === 0) return null;

  const columns =
    stats.length === 3 ? "sm:grid-cols-3" : stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";

  return (
    <section className="border-y border-line bg-cream" aria-label="נתוני המשרד">
      <div className="container-custom">
        <div className={`grid grid-cols-1 ${columns} sm:divide-x sm:divide-x-reverse sm:divide-line`}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 px-4 py-5 text-center">
              <span className="font-heading text-2xl font-bold text-ink md:text-3xl">
                {stat.value?.toLocaleString("he-IL", {
                  minimumFractionDigits: stat.decimals ?? 0,
                  maximumFractionDigits: stat.decimals ?? 0,
                })}
                {stat.suffix}
              </span>
              <span className="text-xs text-ink-muted md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
