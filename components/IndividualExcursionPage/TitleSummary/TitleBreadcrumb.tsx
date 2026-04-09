import { Link } from "@/i18n/navigation";

interface TitleBreadcrumbProps {
  categoryTitle: string;
  categorySlug: string;
  excursionsLabel: string;
}

export function TitleBreadcrumb({
  categoryTitle,
  categorySlug,
  excursionsLabel,
}: TitleBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm font-body"
    >
      <Link
        href="/"
        className="text-gray-400 hover:text-ocean transition-colors duration-200"
      >
        Home
      </Link>

      <ChevronSeparator />

      <Link
        href="/excursions"
        className="text-gray-400 hover:text-ocean transition-colors duration-200"
      >
        {excursionsLabel}
      </Link>

      <ChevronSeparator />

      <Link
        href={`/excursions?category=${categorySlug}`}
        className="text-gray-400 hover:text-ocean transition-colors duration-200"
      >
        {categoryTitle}
      </Link>
    </nav>
  );
}

function ChevronSeparator() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-300 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
