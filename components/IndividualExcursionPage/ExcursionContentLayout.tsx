import { ReactNode } from "react";

interface ExcursionContentLayoutProps {
  /** Left column — scrolling content (Highlights, Description, Included, etc.) */
  children: ReactNode;
  /** Right column — sticky pricing sidebar */
  sidebar: ReactNode;
}

/**
 * Two-column layout for the Individual Excursion Page.
 *
 * Desktop (lg+): Content left (2/3), sticky PriceDeposit right (1/3).
 * Tablet (md): Content left (60%), sidebar right (40%).
 * Mobile: Sidebar first (full width), then content below.
 *
 * The sidebar uses `sticky top-24` so it follows the user as they
 * scroll through the content sections — the pricing and CTA are
 * always visible when they're ready to book.
 */
export function ExcursionContentLayout({
  children,
  sidebar,
}: ExcursionContentLayoutProps) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 md:py-10">
        {/* Mobile: sidebar on top */}
        <div className="lg:hidden mb-8">{sidebar}</div>

        {/* Desktop: two-column grid */}
        <div className="lg:grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] lg:gap-10 xl:gap-14">
          {/* Left — scrolling content */}
          <div className="min-w-0">{children}</div>

          {/* Right — sticky sidebar (hidden on mobile, shown on lg+) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">{sidebar}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
