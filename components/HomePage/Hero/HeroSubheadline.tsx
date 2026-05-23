interface HeroSubheadlineProps {
  text: string;
}

export function HeroSubheadline({ text }: HeroSubheadlineProps) {
  return (
    <p
      className="text-white/90 font-body leading-relaxed max-w-xl mb-8 md:mb-10"
      data-animate="hero-fade-up"
      style={{
        fontSize: "clamp(1.0625rem, 1.5vw + 0.25rem, 1.25rem)",
        animation: "hero-fade-up 700ms ease-out 700ms both",
      }}
    >
      {text}
    </p>
  );
}
