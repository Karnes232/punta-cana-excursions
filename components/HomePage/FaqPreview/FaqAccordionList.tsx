"use client";

import { useState, useEffect, useRef } from "react";
import { FaqAccordionItem } from "./FaqAccordionItem";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionListProps {
  faqs: FaqItem[];
}

export function FaqAccordionList({ faqs }: FaqAccordionListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div ref={ref} className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="transition-all duration-600 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: `${index * 80}ms`,
          }}
        >
          <FaqAccordionItem
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        </div>
      ))}
    </div>
  );
}
