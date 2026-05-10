import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";
import { LOCALE_LABELS } from "@/i18n/blogLocales";
import type { BlogLocale } from "@/i18n/blogLocales";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

interface BlogPostHeroProps {
  title: string;
  excerpt: string;
  publishedAt: string | null;
  readingTime: number;
  language: string;
  categoryName: string | null;
  featuredImage: {
    asset: { url: string; metadata: { lqip?: string } };
    alt: string | null;
  } | null;
  locale: string;
  breadcrumbLabel: string;
  minReadLabel: string;
}

export function BlogPostHero({
  title,
  excerpt,
  publishedAt,
  readingTime,
  language,
  categoryName,
  featuredImage,
  locale,
  breadcrumbLabel,
  minReadLabel,
}: BlogPostHeroProps) {
  const langLabel = LOCALE_LABELS[language as BlogLocale] ?? language.toUpperCase();

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white pt-24 pb-0">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-6">
        <div className="flex items-center gap-2 font-body text-sm text-slate/50">
          <Link href="/blog" className="hover:text-ocean transition-colors duration-150">
            {breadcrumbLabel}
          </Link>
          <span>/</span>
          <span className="text-slate/80 line-clamp-1">{title}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Language badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ocean/10 text-ocean font-heading font-semibold text-xs">
            <GlobeIcon />
            {langLabel}
          </span>
          {/* Category */}
          {categoryName && (
            <span className="px-3 py-1.5 rounded-full bg-teal/10 text-teal font-body text-xs font-medium">
              {categoryName}
            </span>
          )}
          {/* Date */}
          {formattedDate && (
            <span className="font-body text-slate/50 text-sm">{formattedDate}</span>
          )}
          {/* Reading time */}
          <span className="font-body text-slate/50 text-sm ml-auto">
            {readingTime} {minReadLabel}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-6">
        <WordRevealHeading
          as="h1"
          text={title}
          triggerOnMount
          className="font-heading font-bold text-navy text-3xl sm:text-4xl md:text-5xl leading-tight"
        />
      </div>

      {/* Excerpt */}
      {excerpt && (
        <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-8">
          <p className="font-body text-slate/70 text-lg leading-relaxed border-l-4 border-teal/40 pl-4">
            {excerpt}
          </p>
        </div>
      )}

      {/* Featured image */}
      {featuredImage?.asset?.url && (
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden">
            <Image
              src={featuredImage.asset.url}
              alt={featuredImage.alt ?? title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
              className="object-cover"
              priority
              placeholder={featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={featuredImage.asset.metadata?.lqip}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}
