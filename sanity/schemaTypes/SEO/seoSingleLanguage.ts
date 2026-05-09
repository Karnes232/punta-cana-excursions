import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";

const jsonLdValidator = (text: unknown) => {
  if (!text || typeof text !== "string" || text.trim() === "") return true;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return "Must be valid JSON";
  }
};

export const seoSingleLanguage = defineType({
  name: "seoSingleLanguage",
  title: "SEO (Single Language)",
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
      type: "string",
      group: "basic",
      description: "Browser tab + search results. Aim for 50–60 characters.",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(60).warning(
          "Titles over 60 characters may be truncated in search results.",
        ),
      ],
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      group: "basic",
      description: "Search result snippet. Aim for 150–160 characters.",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(160).warning(
          "Descriptions over 160 characters may be truncated in search results.",
        ),
      ],
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      group: "basic",
      description: "Relevant keywords for this page.",
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one keyword."),
    }),

    // ── Social ───────────────────────────────────────────────────────────────
    defineField({
      name: "ogTitle",
      title: "OG Title",
      type: "string",
      group: "social",
      description: "Title when shared on social media.",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(60).warning("OG titles over 60 characters may be truncated."),
      ],
    }),
    defineField({
      name: "ogDescription",
      title: "OG Description",
      type: "text",
      rows: 3,
      group: "social",
      description: "Description when shared on social media.",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(200).warning("OG descriptions over 200 characters may be truncated."),
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
      name: "structuredData",
      title: "Structured Data",
      type: "text",
      rows: 10,
      group: "structured",
      description: "Optional schema.org JSON-LD for this page.",
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
