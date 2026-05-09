/* ---------------------------------------------------------------------------
   DivingCTABackground — Deep ocean gradient with decorative accents
   
   Gradient: slate-dark → ocean → ocean-dark → hint of teal
   Plus: bubble circles and faint light rays for underwater atmosphere.
   --------------------------------------------------------------------------- */

   export function DivingCTABackground() {
    return (
      <>
        {/* Primary gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                #111827 0%,
                #004A6E 30%,
                #005F86 60%,
                #0C8E9E 100%
              )
            `,
          }}
        />
  
        {/* Subtle light rays — from upper-right, very faint */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from 210deg at 70% -5%,
                transparent 0deg,
                rgba(255, 255, 255, 0.7) 12deg,
                transparent 25deg,
                transparent 55deg,
                rgba(255, 255, 255, 0.4) 68deg,
                transparent 80deg,
                transparent 360deg
              )
            `,
          }}
          aria-hidden="true"
        />
  
        {/* Decorative bubble circles */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Ascending bubbles — left cluster */}
            <circle cx="120" cy="320" r="18" stroke="white" strokeWidth="0.75" />
            <circle cx="100" cy="260" r="10" stroke="white" strokeWidth="0.5" />
            <circle cx="135" cy="200" r="6" stroke="white" strokeWidth="0.5" />
            <circle cx="110" cy="155" r="4" stroke="white" strokeWidth="0.4" />
  
            {/* Ascending bubbles — right cluster */}
            <circle cx="1300" cy="340" r="14" stroke="white" strokeWidth="0.6" />
            <circle cx="1320" cy="270" r="8" stroke="white" strokeWidth="0.5" />
            <circle cx="1290" cy="210" r="5" stroke="white" strokeWidth="0.4" />
  
            {/* Subtle wave line — mid */}
            <path
              d="M0 280 C360 240 720 320 1080 260 C1260 230 1380 270 1440 250"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
        </div>
  
        {/* Soft teal radial glow — bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-[50%] h-[70%] pointer-events-none opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 90%, #0EA5B7 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
      </>
    );
  }