import { FaqPreviewHeader } from "./FaqPreviewHeader";
import { FaqAccordionList } from "./FaqAccordionList";
import { FaqPreviewCta } from "./FaqPreviewCta";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqPreviewProps {
  heading: string;
  subheading?: string;
  faqs: FaqItem[];
  ctaText?: string;
  ctaHref?: string;
}

export function FaqPreview({
  heading,
  subheading,
  faqs,
  ctaText,
  ctaHref,
}: FaqPreviewProps) {
  return (
    <section className="relative py-20 md:py-28 section-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
        <FaqPreviewHeader heading={heading} subheading={subheading} />
        <FaqAccordionList faqs={faqs} />
        {ctaText && ctaHref && <FaqPreviewCta text={ctaText} href={ctaHref} />}
      </div>
    </section>
  );
}
