import { BookingStepsHeader } from "./BookingStepsHeader";
import { BookingStep } from "./BookingStep";
import { BookingStepsConnector } from "./BookingStepsConnector";

export interface BookingStepData {
  stepNumber: number;
  icon: string;
  title: string;
  description: string;
}

interface HowBookingWorksProps {
  heading: string;
  subheading?: string;
  steps: BookingStepData[];
}

export function HowBookingWorks({
  heading,
  subheading,
  steps,
}: HowBookingWorksProps) {
  return (
    <section className="relative py-20 md:py-28 section-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <BookingStepsHeader heading={heading} subheading={subheading} />

        {/* Steps container — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting line between steps — desktop only */}
          <BookingStepsConnector stepCount={steps.length} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <BookingStep
                key={step.stepNumber}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
