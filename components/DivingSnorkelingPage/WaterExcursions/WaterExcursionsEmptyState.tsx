/* ---------------------------------------------------------------------------
   WaterExcursionsEmptyState — Shown when no excursions match
   
   Friendly message with a water-themed icon. This should rarely appear
   in production since we always seed excursions, but it's good UX to handle
   the empty case gracefully.
   --------------------------------------------------------------------------- */

interface WaterExcursionsEmptyStateProps {
  title: string;
  message: string;
}

export function WaterExcursionsEmptyState({
  title,
  message,
}: WaterExcursionsEmptyStateProps) {
  return (
    <div className="text-center py-16 md:py-20 mt-12">
      {/* Wave icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ocean/5 mb-5">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#005F86"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
        >
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
      </div>

      <h3 className="font-heading font-bold text-slate text-lg mb-2">
        {title}
      </h3>
      <p className="font-body text-gray-dark text-sm max-w-md mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}
