import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";
import { i18n } from "../../lib/i18n";

const jsonLdValidator = (text: unknown) => {
  if (!text || typeof text !== "string" || text.trim() === "") return true;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return "Must be valid JSON";
  }
};

type LocalizedValue = Record<string, string | undefined> | undefined;
type LocalizedArrayValue = Record<string, string[] | undefined> | undefined;

const localizedMaxLength = (max: number, label: string) => (value: unknown) => {
  const v = value as LocalizedValue;
  if (!v) return true;
  const issues = i18n.languages
    .filter((lang) => {
      const text = v[lang.id];
      return typeof text === "string" && text.length > max;
    })
    .map((lang) => ({
      message: `${lang.title} ${label} is over ${max} characters and may be truncated in search results.`,
      path: [lang.id],
    }));
  return issues.length === 0 ? true : issues;
};

const localizedRequired = (label: string) => (value: unknown) => {
  const v = (value ?? {}) as LocalizedValue;
  const issues = i18n.languages
    .filter((lang) => {
      const text = v?.[lang.id];
      return !text || (typeof text === "string" && text.trim() === "");
    })
    .map((lang) => ({
      message: `${lang.title} ${label} is required.`,
      path: [lang.id],
    }));
  return issues.length === 0 ? true : issues;
};

const localizedArrayRequired = (label: string) => (value: unknown) => {
  const v = (value ?? {}) as LocalizedArrayValue;
  const issues = i18n.languages
    .filter((lang) => {
      const arr = v?.[lang.id];
      return !Array.isArray(arr) || arr.length === 0;
    })
    .map((lang) => ({
      message: `${lang.title} ${label} must contain at least one entry.`,
      path: [lang.id],
    }));
  return issues.length === 0 ? true : issues;
};

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  groups: [
    { name: "basic", title: "Basic", default: true },
    { name: "social", title: "Social" },
    { name: "structured", title: "Structured Data" },
    { name: "robots", title: "Robots" },
  ],
  fields: [
    // ── Basic ────────────────────────────────────────────────────────────────
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "localizedString",
      group: "basic",
      description:
        "Browser tab + search results. Aim for 50–60 characters per language.",
      validation: (Rule) => [
        Rule.custom(localizedRequired("Meta Title")),
        Rule.custom(localizedMaxLength(60, "Meta Title")).warning(),
      ],
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "localizedText",
      group: "basic",
      description: "Search result snippet. Aim for 150–160 characters per language.",
      validation: (Rule) => [
        Rule.custom(localizedRequired("Meta Description")),
        Rule.custom(localizedMaxLength(160, "Meta Description")).warning(),
      ],
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "localizedStringArray",
      group: "basic",
      description: "Relevant keywords per language. Used as supporting metadata.",
      validation: (Rule) => Rule.custom(localizedArrayRequired("Keywords")),
    }),
    // ── Social ───────────────────────────────────────────────────────────────
    defineField({
      name: "ogTitle",
      title: "OG Title",
      type: "localizedString",
      group: "social",
      description: "Title when shared on social media.",
      validation: (Rule) => [
        Rule.custom(localizedRequired("OG Title")),
        Rule.custom(localizedMaxLength(60, "OG Title")).warning(),
      ],
    }),
    defineField({
      name: "ogDescription",
      title: "OG Description",
      type: "localizedText",
      group: "social",
      description: "Description when shared on social media.",
      validation: (Rule) => [
        Rule.custom(localizedRequired("OG Description")),
        Rule.custom(localizedMaxLength(200, "OG Description")).warning(),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      group: "social",
      description: "Social share image (recommended: 1200 × 630 px).",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Required for accessibility.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "twitterCard",
      title: "Twitter Card Type",
      type: "string",
      group: "social",
      initialValue: "summary_large_image",
      options: {
        list: [
          { title: "Summary", value: "summary" },
          { title: "Summary Large Image", value: "summary_large_image" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Structured Data ──────────────────────────────────────────────────────
    defineField({
      name: "structuredDataEn",
      title: "Structured Data (English)",
      type: "text",
      rows: 10,
      group: "structured",
      description: "Optional schema.org JSON-LD for the English version.",
      validation: (Rule) => Rule.custom(jsonLdValidator),
    }),
    defineField({
      name: "structuredDataEs",
      title: "Structured Data (Spanish)",
      type: "text",
      rows: 10,
      group: "structured",
      description: "Optional schema.org JSON-LD for the Spanish version.",
      validation: (Rule) => Rule.custom(jsonLdValidator),
    }),

    // ── Robots ───────────────────────────────────────────────────────────────
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      group: "robots",
      description: "Hide this page from search engines.",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "No Follow",
      type: "boolean",
      group: "robots",
      description: "Tell search engines not to follow links on this page.",
      initialValue: false,
    }),
  ],
});
