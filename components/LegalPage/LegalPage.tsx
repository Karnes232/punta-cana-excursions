"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/components/IndividualExcursionPage/FullDescription/FullDescriptionBody";

interface LegalPageProps {
  title: string;
  lastUpdated: string | null;
  body: PortableTextBlock[];
  lastUpdatedLabel: string;
}

export function LegalPage({ title, lastUpdated, body, lastUpdatedLabel }: LegalPageProps) {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Header band */}
      <div className="bg-ocean pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          {formattedDate && (
            <p className="font-body text-teal text-sm mb-3">
              {lastUpdatedLabel}: {formattedDate}
            </p>
          )}
          <h1 className="font-heading font-bold text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
            {title}
          </h1>
          {/* Accent divider */}
          <div className="flex items-center gap-2 mt-6">
            <div className="h-[2px] w-12 bg-teal/60 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-sunset" />
            <div className="h-[2px] w-12 bg-teal/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 md:py-20">
        {body && body.length > 0 ? (
          <PortableText value={body} components={portableTextComponents} />
        ) : (
          <p className="font-body text-slate/60 italic">Content coming soon.</p>
        )}
      </div>
    </main>
  );
}
