interface ContactHeroProps {
  headline: string;
  subheadline: string;
}

export function ContactHero({ headline, subheadline }: ContactHeroProps) {
  return (
    <div
      className="relative pt-28 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #005F86 0%, #0EA5B7 100%)" }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Wave bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48V24C360 0 720 48 1080 24C1260 12 1350 30 1440 24V48H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl md:text-6xl leading-tight mb-5">
          {headline}
        </h1>
        {subheadline && (
          <p className="font-body text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
        {/* Accent divider */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="h-[2px] w-10 bg-white/40 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-sunset" />
          <div className="h-[2px] w-10 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
