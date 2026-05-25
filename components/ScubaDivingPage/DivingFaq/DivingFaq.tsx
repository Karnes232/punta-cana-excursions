import { DivingFaqHeader } from "./DivingFaqHeader";
import { FaqAccordionList } from "@/components/HomePage/FaqPreview/FaqAccordionList";

/* ---------------------------------------------------------------------------
   DivingFaq — FAQ section for the Scuba Diving page

   Sits between the Trust block and the bottom CTA. Eyebrow + H2 + subheading
   header, followed by an accordion of question/answer items. Reuses the shared
   FaqAccordionList primitive (and, transitively, FaqAccordionItem) so the
   open/close behavior matches the home and FAQ pages.
   --------------------------------------------------------------------------- */

export interface DivingFaqItem {
  question: string;
  answer: string;
}

interface DivingFaqProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  faqs: DivingFaqItem[];
}

export function DivingFaq({ eyebrow, heading, subheading, faqs }: DivingFaqProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28 section-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
        <DivingFaqHeader
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
        />
        <FaqAccordionList faqs={faqs} />
      </div>
    </section>
  );
}
