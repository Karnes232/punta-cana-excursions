/* ---------------------------------------------------------------------------
   WhyBookBackground — Subtle underwater decorative background
   
   Two soft radial gradient circles (ocean top-right, teal bottom-left)
   plus a faint horizontal wave SVG across the bottom — evoking water
   surface without competing with content.
   --------------------------------------------------------------------------- */

   export function WhyBookBackground() {
    return (
      <>
        {/* Soft radial gradient — ocean blue, top right */}
        <div
          className="absolute top-0 right-0 w-[50%] h-[60%] pointer-events-none opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, #005F86 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
  
        {/* Soft radial gradient — teal, bottom left */}
        <div
          className="absolute bottom-0 left-0 w-[40%] h-[50%] pointer-events-none opacity-[0.03]"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, #0EA5B7 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
  
        {/* Faint wave pattern across bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-[0.03]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 30C180 10 360 50 540 30C720 10 900 50 1080 30C1260 10 1380 40 1440 25"
              stroke="#005F86"
              strokeWidth="1"
            />
            <path
              d="M0 45C180 25 360 60 540 40C720 20 900 55 1080 40C1260 25 1380 50 1440 38"
              stroke="#0EA5B7"
              strokeWidth="0.75"
            />
          </svg>
        </div>
      </>
    );
  }