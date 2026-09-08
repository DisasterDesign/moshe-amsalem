import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "start";
}) {
  const isCentre = align === "center";
  // Refinement round: eyebrows were dropped sitewide - the prop is still accepted
  // so callers keep compiling, but nothing is rendered. The highlight word is no
  // longer coloured either; one gold word per section read as a template.
  void eyebrow;
  const heading = highlight ? `${title} ${highlight}` : title;
  return (
    <Reveal className={`mb-12 ${isCentre ? "text-center" : "text-right"}`}>
      <h2 className="heading-lg mb-4 text-ink">{heading}</h2>
      {description && (
        <p className={`text-lg text-ink-soft ${isCentre ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
