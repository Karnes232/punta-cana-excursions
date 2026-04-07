export function WhyChooseUsBackground() {
  return (
    <>
      {/* Large soft circle — top left, brand warmth */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-teal) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Smaller circle — bottom right */}
      <div
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-sunset) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
