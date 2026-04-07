export function WhatsAppCTABackground() {
  return (
    <>
      {/* Base sand background */}
      <div className="absolute inset-0 bg-sand" />

      {/* Subtle wave pattern — faint, decorative */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 160C240 80 480 240 720 160C960 80 1200 240 1440 160V320H0V160Z"
          className="fill-ocean"
        />
        <path
          d="M0 200C360 120 720 280 1080 200C1260 160 1350 180 1440 200V320H0V200Z"
          className="fill-teal"
        />
      </svg>

      {/* Warm radial accent — soft sunset glow in top-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
              radial-gradient(
                ellipse 50% 80% at 90% 20%,
                rgba(244, 161, 26, 0.06) 0%,
                transparent 60%
              )
            `,
        }}
        aria-hidden="true"
      />
    </>
  );
}
