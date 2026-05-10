import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface DivingHeroHeadlineProps {
  text: string;
}

export function DivingHeroHeadline({ text }: DivingHeroHeadlineProps) {
  return (
    <WordRevealHeading
      as="h1"
      text={text}
      triggerOnMount
      initialDelayMs={150}
      className="font-heading text-white leading-[1.08] tracking-tight mb-5 md:mb-6"
      style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
    />
  );
}
