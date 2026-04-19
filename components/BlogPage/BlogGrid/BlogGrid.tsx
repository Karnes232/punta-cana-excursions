import { BlogCard } from "./BlogCard";
import type { BlogArticleCard } from "@/sanity/queries/Blog/Blog";

interface BlogGridProps {
  articles: BlogArticleCard[];
  locale: string;
  emptyMessage: string;
  readMoreLabel: string;
  minReadLabel: string;
}

export function BlogGrid({ articles, locale, emptyMessage, readMoreLabel, minReadLabel }: BlogGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-slate/60 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {articles.map((article) => (
        <BlogCard
          key={article._id}
          article={article}
          locale={locale}
          readMoreLabel={readMoreLabel}
          minReadLabel={minReadLabel}
        />
      ))}
    </div>
  );
}
