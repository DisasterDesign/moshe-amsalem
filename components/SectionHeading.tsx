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
  return (
    <Reveal className={`mb-12 ${isCentre ? "text-center" : "text-right"}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={`heading-lg text-ink ${eyebrow ? "mt-3" : ""} mb-4`}>
        {title}
        {highlight && <span className="text-primary"> {highlight}</span>}
      </h2>
      {description && (
        <p className={`text-lg text-ink-soft ${isCentre ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
