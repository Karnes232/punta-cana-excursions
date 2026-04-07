export function CtaBannerBackground() {
  return (
    <>
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
              linear-gradient(
                135deg,
                var(--color-ocean-dark) 0%,
                var(--color-ocean) 40%,
                var(--color-ocean-light) 100%
              )
            `,
        }}
        aria-hidden="true"
      />

      {/* Warm radial accent — subtle sunset glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
              radial-gradient(
                ellipse 60% 50% at 80% 50%,
                var(--color-sunset) 0%,
                transparent 70%
              )
            `,
        }}
        aria-hidden="true"
      />

      {/* Wave pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 280 Q200 220 400 280 Q600 340 800 280 Q1000 220 1200 280 L1200 400 L0 400 Z"
            fill="white"
          />
          <path
            d="M0 320 Q200 260 400 320 Q600 380 800 320 Q1000 260 1200 320 L1200 400 L0 400 Z"
            fill="white"
            opacity="0.5"
          />
          <path
            d="M0 100 Q300 60 600 100 Q900 140 1200 100"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M0 140 Q300 100 600 140 Q900 180 1200 140"
            stroke="white"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>
    </>
  );
}
