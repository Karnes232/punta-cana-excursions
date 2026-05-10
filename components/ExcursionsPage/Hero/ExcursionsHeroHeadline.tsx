import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface ExcursionsHeroHeadlineProps {
  text: string;
}

export function ExcursionsHeroHeadline({ text }: ExcursionsHeroHeadlineProps) {
  return (
    <WordRevealHeading
      as="h1"
      text={text}
      triggerOnMount
      className="font-heading text-white leading-[1.1] tracking-tight mb-4 md:mb-5"
      style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)" }}
    />
  );
}
