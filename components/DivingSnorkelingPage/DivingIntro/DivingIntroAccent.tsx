/* ---------------------------------------------------------------------------
   DivingIntroAccent — Decorative underwater SVG
   
   Positioned left side (BrandIntroAccent is right side).
   Includes: bubble circles, wave curves, coral branching shapes.
   At 4% opacity — atmospheric, not distracting.
   --------------------------------------------------------------------------- */

export function DivingIntroAccent() {
  return (
    <div
      className="absolute top-0 left-0 w-1/2 h-full pointer-events-none opacity-[0.04]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMinYMid slice"
      >
        {/* Wave curves — flowing water lines */}
        <path
          d="M400 0 Q200 200 300 400 Q400 600 200 800"
          stroke="#005F86"
          strokeWidth="1.5"
        />
        <path
          d="M300 0 Q100 200 200 400 Q300 600 100 800"
          stroke="#0EA5B7"
          strokeWidth="1"
        />
        <path
          d="M500 0 Q300 200 400 400 Q500 600 300 800"
          stroke="#0EA5B7"
          strokeWidth="0.75"
        />

        {/* Bubble circles — ascending, varying sizes */}
        <circle cx="150" cy="650" r="20" stroke="#005F86" strokeWidth="1" />
        <circle cx="130" cy="580" r="12" stroke="#0EA5B7" strokeWidth="0.75" />
        <circle cx="170" cy="510" r="8" stroke="#005F86" strokeWidth="0.75" />
        <circle cx="140" cy="450" r="5" stroke="#0EA5B7" strokeWidth="0.5" />
        <circle cx="160" cy="400" r="3" stroke="#005F86" strokeWidth="0.5" />

        {/* Coral branching — organic growth shape */}
        <path
          d="M80 700 Q100 650 90 600 Q80 550 110 500"
          stroke="#0EA5B7"
          strokeWidth="1"
        />
        <path
          d="M90 600 Q120 580 130 550"
          stroke="#0EA5B7"
          strokeWidth="0.75"
        />
        <path
          d="M100 650 Q130 640 140 610"
          stroke="#005F86"
          strokeWidth="0.75"
        />

        {/* Large gentle arc — ocean floor horizon */}
        <path d="M0 750 Q300 680 600 740" stroke="#005F86" strokeWidth="1" />
      </svg>
    </div>
  );
}
