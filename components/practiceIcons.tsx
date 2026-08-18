import {
  Building,
  Building2,
  FileCheck,
  FileText,
  Heart,
  Home,
  type LucideIcon,
} from "lucide-react";

/**
 * Slug -> icon. Kept out of `content/practiceAreas.ts` so regenerating the copy
 * never touches the icon choices.
 */
export const practiceIcons: Record<string, LucideIcon> = {
  "real-estate-transactions": Building2,
  "rental-agreements": Home,
  "urban-renewal": Building,
  "wills-inheritance": FileText,
  "prenuptial-agreements": Heart,
  "enduring-power-of-attorney": FileCheck,
};

export function iconFor(slug: string): LucideIcon {
  return practiceIcons[slug] ?? Building2;
}
