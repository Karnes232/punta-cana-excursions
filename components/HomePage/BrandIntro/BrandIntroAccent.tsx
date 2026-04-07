export function BrandIntroAccent() {
  return (
    <div
      className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.04]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMaxYMid slice"
      >
        {/* Large sweeping wave curves */}
        <path
          d="M200 0 Q400 200 300 400 Q200 600 400 800"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-teal"
        />
        <path
          d="M300 0 Q500 200 400 400 Q300 600 500 800"
          stroke="currentColor"
          strokeWidth="1"
          className="text-ocean"
        />
        <path
          d="M100 0 Q300 200 200 400 Q100 600 300 800"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-teal"
        />

        {/* Circular accents suggesting sun/water */}
        <circle
          cx="450"
          cy="150"
          r="60"
          stroke="currentColor"
          strokeWidth="1"
          className="text-sunset"
        />
        <circle
          cx="480"
          cy="150"
          r="40"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-sunset"
        />
      </svg>
    </div>
  );
}
