import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface HeroHeadlineProps {
  text: string;
}

export function HeroHeadline({ text }: HeroHeadlineProps) {
  return (
    <WordRevealHeading
      as="h1"
      text={text}
      triggerOnMount
      className="font-heading text-white leading-[1.08] tracking-tight mb-5 md:mb-6"
      style={{ fontSize: "clamp(2.25rem, 5vw + 0.5rem, 4rem)" }}
    />
  );
}
