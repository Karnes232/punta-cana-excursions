import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LOCALE_LABELS } from "@/i18n/blogLocales";
import type { BlogLocale } from "@/i18n/blogLocales";
import type { BlogArticleCard } from "@/sanity/queries/Blog/Blog";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

interface BlogCardProps {
  article: BlogArticleCard;
  locale: string;
  readMoreLabel: string;
  minReadLabel: string;
}

export function BlogCard({ article, locale, readMoreLabel, minReadLabel }: BlogCardProps) {
  const lk = locale as keyof LocalizedField;
  const categoryName = article.category?.title?.[lk] ?? article.category?.title?.en ?? null;
  const langLabel = LOCALE_LABELS[article.language as BlogLocale] ?? article.language.toUpperCase();
  const isNativeLang = article.language === locale;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-sand flex-shrink-0">
        {article.featuredImage?.asset?.url ? (
          <Image
            src={article.featuredImage.asset.url}
            alt={article.featuredImage.alt ?? article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder={article.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={article.featuredImage.asset.metadata?.lqip}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ocean/20 to-teal/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-ocean/30" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}

        {/* Language badge */}
        {!isNativeLang && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy/80 backdrop-blur-sm text-white text-xs font-heading font-bold">
            {langLabel}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category + reading time */}
        <div className="flex items-center gap-2 mb-3">
          {categoryName && (
            <span className="font-body text-xs font-medium text-teal bg-teal/10 px-2.5 py-1 rounded-full">
              {categoryName}
            </span>
          )}
          <span className="font-body text-xs text-slate/50 ml-auto">
            {article.readingTime} {minReadLabel}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${article.slug}`}>
          <h2 className="font-heading font-bold text-navy text-base leading-snug mb-2.5 group-hover:text-ocean transition-colors duration-200 line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="font-body text-slate/70 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {formattedDate && (
            <span className="font-body text-xs text-slate/50">{formattedDate}</span>
          )}
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-1 font-heading font-semibold text-ocean text-sm hover:text-teal transition-colors duration-150 ml-auto group/link"
          >
            {readMoreLabel}
            <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
