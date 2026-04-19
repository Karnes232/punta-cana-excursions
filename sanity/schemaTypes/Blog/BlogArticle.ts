import { defineField, defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons";
import { ALL_LOCALES } from "../../../i18n/blogLocales";

const languageOptions = ALL_LOCALES.map((code) => ({
  title: code.toUpperCase(),
  value: code,
}));

export const blogArticle = defineType({
  name: "blogArticle",
  title: "Blog Article",
  type: "document",
  icon: ComposeIcon,

  groups: [
    { name: "basic", title: "Basic", default: true },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────

    defineField({
      name: "language",
      title: "Article Language",
      description:
        "This document is one language version. Create another blogArticle per translation and use the same Translation Group ID.",
      type: "string",
      group: "basic",
      options: {
        list: languageOptions,
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "translationGroup",
      title: "Translation Group ID",
      description:
        "Same ID across all language versions of this article (e.g. snorkeling-guide-2025). Used to link translations together.",
      type: "string",
      group: "basic",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
      description: "URL-safe identifier, auto-generated from the title.",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "basic",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "1–2 sentence teaser shown on the blog index card.",
      type: "text",
      rows: 3,
      group: "basic",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "date",
      group: "basic",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      group: "basic",
      validation: (r) => r.required().min(1).max(60),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
      group: "basic",
      options: { disableNew: true },
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "basic",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      validation: (r) => r.required(),
    }),

    // ── Content ───────────────────────────────────────────────────────────────

    defineField({
      name: "body",
      title: "Article Body",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      validation: (r) => r.required(),
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides the article title in <title> tags. Keep under 60 characters.",
      validation: (r) => r.max(60).warning("SEO titles over 60 characters may be truncated."),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Meta description shown in search results. Aim for 120–160 characters.",
      validation: (r) =>
        r
          .min(120)
          .warning("Short descriptions may not display well in search results.")
          .max(160)
          .warning("Descriptions over 160 characters will be cut off by Google."),
    }),

    defineField({
      name: "ogImage",
      title: "Social Sharing Image",
      type: "image",
      group: "seo",
      description:
        "Shown when shared on social media. Ideal size: 1200 × 630 px. Falls back to featured image if not set.",
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: "title",
      language: "language",
      media: "featuredImage",
      group: "translationGroup",
    },
    prepare({ title, language, media, group }) {
      return {
        title: title ?? "Untitled Article",
        subtitle: `${(language ?? "").toUpperCase()} · ${group ?? "—"}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Newest First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
