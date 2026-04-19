"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/components/IndividualExcursionPage/FullDescription/FullDescriptionBody";

interface BlogPostBodyProps {
  body: PortableTextBlock[];
}

export function BlogPostBody({ body }: BlogPostBodyProps) {
  if (!body || body.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 md:py-16">
      <PortableText value={body} components={portableTextComponents} />
    </div>
  );
}
