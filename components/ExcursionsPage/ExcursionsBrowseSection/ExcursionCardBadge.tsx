interface ExcursionCardBadgeProps {
  text: string;
}

/**
 * Maps badge text to color classes.
 * Uses brand tokens from Tailwind config.
 */
function getBadgeClasses(text: string): string {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("best seller") ||
    normalized.includes("más vendido")
  ) {
    return "bg-sunset/90 text-white";
  }

  if (normalized.includes("popular") || normalized.includes("más popular")) {
    return "bg-ocean/90 text-white";
  }

  if (normalized.includes("exclusive") || normalized.includes("exclusiv")) {
    return "bg-teal/90 text-white";
  }

  if (normalized.includes("requested") || normalized.includes("solicitad")) {
    return "bg-slate/80 text-white";
  }

  // Default
  return "bg-white/90 text-slate backdrop-blur-sm";
}

export function ExcursionCardBadge({ text }: ExcursionCardBadgeProps) {
  return (
    <span
      className={`
          absolute top-3 left-3 z-[2]
          inline-flex items-center
          px-3 py-1.5
          rounded-full
          text-xs font-heading font-semibold tracking-wide uppercase
          shadow-sm
          ${getBadgeClasses(text)}
        `}
    >
      {text}
    </span>
  );
}
