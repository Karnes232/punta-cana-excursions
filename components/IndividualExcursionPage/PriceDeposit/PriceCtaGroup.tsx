"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ExcursionInquiryModal } from "./ExcursionInquiryModal";
import { ExcursionBookingModal } from "./ExcursionBookingModal";
import type { BookingLabels } from "./bookingTypes";

interface PriceCtaGroupProps {
  reserveLabel: string;
  contactLabel: string;
  excursionId?: string;
  excursionTitle: string;
  whatsappNumber: string;
  locale: string;
  daysAvailable?: string[];
  timeSlots?: string[];
  bookingNoticeHours?: number;
  depositAmount: number;
  pricePerPerson: number;
  childAgeRange?: string;
  bookingLabels?: BookingLabels;
}

export function PriceCtaGroup({
  reserveLabel,
  contactLabel,
  excursionId,
  excursionTitle,
  whatsappNumber,
  locale,
  daysAvailable,
  timeSlots,
  bookingNoticeHours,
  depositAmount,
  pricePerPerson,
  childAgeRange,
  bookingLabels,
}: PriceCtaGroupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const bookingEnabled =
    !!excursionId &&
    !!bookingLabels &&
    Array.isArray(daysAvailable) &&
    daysAvailable.length > 0;

  const reserveStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(10px)",
    transitionDelay: "150ms",
  } as const;

  const reserveClasses =
    "group relative flex items-center justify-center gap-2 w-full min-h-[48px] px-6 py-3.5 bg-ocean text-white font-heading font-semibold text-sm tracking-wide rounded-xl shadow-sm overflow-hidden transition-all duration-500 ease-out hover:bg-ocean/90 hover:shadow-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean";

  const reserveInner = (
    <>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <span className="relative">{reserveLabel}</span>
      <svg
        className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </>
  );

  return (
    <>
      <div ref={ref} className="flex flex-col gap-3">
        {/* Primary CTA — Reserve */}
        {bookingEnabled ? (
          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className={reserveClasses}
            style={reserveStyle}
          >
            {reserveInner}
          </button>
        ) : (
          <Link href="/contact" className={reserveClasses} style={reserveStyle}>
            {reserveInner}
          </Link>
        )}

        {/* Secondary CTA — Ask a Question (opens inquiry modal) */}
        <button
          type="button"
          onClick={() => setInquiryOpen(true)}
          className="group flex items-center justify-center gap-2.5 w-full min-h-[48px] px-6 py-3.5 bg-teal/10 text-teal font-heading font-semibold text-sm tracking-wide rounded-xl border border-teal/20 transition-all duration-500 ease-out hover:bg-teal hover:text-white hover:border-teal active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(10px)",
            transitionDelay: "230ms",
          }}
        >
          <svg
            className="w-[18px] h-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <span>{contactLabel}</span>
        </button>
      </div>

      <ExcursionInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        excursionTitle={excursionTitle}
        locale={locale}
      />

      {bookingEnabled && bookingLabels && excursionId && (
        <ExcursionBookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          locale={locale}
          excursionId={excursionId}
          excursionTitle={excursionTitle}
          daysAvailable={daysAvailable ?? []}
          timeSlots={timeSlots ?? []}
          bookingNoticeHours={bookingNoticeHours ?? 24}
          depositAmount={depositAmount}
          pricePerPerson={pricePerPerson}
          childAgeRange={childAgeRange}
          labels={bookingLabels}
        />
      )}
    </>
  );
}
