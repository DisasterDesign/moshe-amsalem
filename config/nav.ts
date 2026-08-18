import { practiceAreas } from "@/content/practiceAreas";

export type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const navLinks: NavLink[] = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  {
    href: "/services",
    label: "תחומי עיסוק",
    children: practiceAreas.map((a) => ({
      href: `/services/${a.slug}`,
      label: a.name,
    })),
  },
  { href: "/articles", label: "מאמרים" },
  { href: "/projects", label: "פרויקטים" },
  { href: "/contact", label: "צור קשר" },
];

export const legalLinks = [
  { href: "/legal/privacy", label: "מדיניות פרטיות" },
  { href: "/legal/accessibility", label: "הצהרת נגישות" },
  { href: "/legal/terms", label: "תקנון ותנאי שימוש" },
];
