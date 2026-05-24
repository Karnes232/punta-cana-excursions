import { ReviewsSectionHeader } from "./ReviewsSectionHeader";
import { ReviewCard } from "./ReviewCard";
import { ReviewsScrollWrapper } from "./ReviewsScrollWrapper";

export interface ReviewData {
  name: string;
  country?: string;
  text: string;
  rating: number; // 1–5
  excursionTitle?: string;
}

interface ReviewsProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  reviews: ReviewData[];
}

export function Reviews({
  eyebrow,
  heading,
  subheading,
  reviews,
}: ReviewsProps) {
  return (
    <section className="relative py-20 md:py-28 section-sand overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <ReviewsSectionHeader
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
        />
      </div>

      {/* Horizontal scroll on mobile/tablet, grid on large desktop */}
      <ReviewsScrollWrapper>
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} index={index} />
        ))}
      </ReviewsScrollWrapper>
    </section>
  );
}
