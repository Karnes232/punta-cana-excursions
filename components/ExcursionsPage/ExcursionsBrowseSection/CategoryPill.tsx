"use client";

interface CategoryPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryPill({ label, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        inline-flex items-center whitespace-nowrap
        px-4 py-2 rounded-full
        font-heading text-sm font-medium
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/40 focus-visible:ring-offset-2
        flex-shrink-0 cursor-pointer
        ${
          isActive
            ? "bg-ocean text-white shadow-sm"
            : "bg-sand text-gray-dark border border-sand-dark hover:border-ocean/30 hover:text-ocean hover:bg-ocean/5"
        }
      `}
    >
      {label}
    </button>
  );
}
