/**
 * Layout wrapper. The scroll reveal it used to run was removed in the
 * refinement round, after repeated reports of whole sections rendering empty
 * for a beat while scrolling. There is no observer, no hidden state and no
 * transition left here - content is always in the markup, always visible.
 *
 * The component is kept (rather than deleted) so the dozens of call sites and
 * their `className` / `index` props keep working untouched. `index` is still
 * accepted and simply ignored.
 */

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Accepted for call-site compatibility. No longer used. */
  index?: number;
  as?: "div" | "section" | "article" | "li" | "header";
};

export default function Reveal({ children, className = "", as = "div" }: Props) {
  const Tag = as as React.ElementType;

  return <Tag className={className}>{children}</Tag>;
}
