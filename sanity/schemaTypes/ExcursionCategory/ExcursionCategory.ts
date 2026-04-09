import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const excursionCategory = defineType({
  name: "excursionCategory",
  title: "Excursion Category",
  type: "document",
  icon: TagIcon,

  fields: [
    // =========================================================================
    // CORE IDENTITY
    // =========================================================================

    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      description:
        "Category name displayed in filter pills and category cards. e.g. 'Island Tours', 'Catamarans'.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL-friendly identifier. Used in filter query params (?category=island-tours) and category page URLs.",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
      description:
        "Short description shown on category cards and at the top of filtered views. 1–2 sentences.",
    }),

    // =========================================================================
    // VISUAL
    // =========================================================================

    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        "Icon key string mapped to an SVG in the frontend. e.g. 'island', 'catamaran', 'adventure', 'snorkeling', 'private', 'family'. If using an image icon instead, leave blank and use the icon image field below.",
      options: {
        list: [
          { title: "Island", value: "island" },
          { title: "Catamaran", value: "catamaran" },
          { title: "Adventure", value: "adventure" },
          { title: "Snorkeling", value: "snorkeling" },
          { title: "Diving", value: "diving" },
          { title: "Private", value: "private" },
          { title: "Family", value: "family" },
          { title: "Sunset", value: "sunset" },
          { title: "Culture", value: "culture" },
          { title: "Nature", value: "nature" },
        ],
      },
    }),

    defineField({
      name: "iconImage",
      title: "Icon Image",
      type: "image",
      description:
        "Optional custom icon image. If provided, this overrides the icon key string above. Use a square SVG or PNG with transparent background.",
      options: { hotspot: false },
    }),

    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      description:
        "Background image for the category card on the home page. Landscape orientation, min 800×600px recommended.",
      options: { hotspot: true },
    }),

    // =========================================================================
    // ORDERING
    // =========================================================================

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description:
        "Controls the display order in the filter bar and category grid. Lower numbers appear first.",
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
  ],

  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Title (EN)",
      name: "titleAsc",
      by: [{ field: "title.en", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "title.en",
      subtitle: "description.en",
      media: "image",
      sortOrder: "sortOrder",
    },
    prepare({ title, subtitle, media, sortOrder }) {
      return {
        title: title || "Untitled Category",
        subtitle: `#${sortOrder ?? "—"} · ${subtitle || "No description"}`,
        media,
      };
    },
  },
});
