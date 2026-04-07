interface ExcursionGridEmptyProps {
  title: string;
  description: string;
}

export function ExcursionGridEmpty({
  title,
  description,
}: ExcursionGridEmptyProps) {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
      <div className="flex flex-col items-center text-center">
        {/* Compass icon in a soft circle */}
        <div className="w-20 h-20 rounded-full bg-sand flex items-center justify-center mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>

        <h3 className="font-heading font-bold text-slate text-lg mb-2">
          {title}
        </h3>
        <p className="font-body text-gray-dark text-sm max-w-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
