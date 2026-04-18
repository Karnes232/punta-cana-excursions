import { defineType, defineField, defineArrayMember } from "sanity";

export const excursion = defineType({
  name: "excursion",
  title: "Excursion",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "pricing", title: "Pricing & Logistics" },
    { name: "details", title: "Details & Lists" },
    { name: "faq", title: "FAQ" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // CONTENT — Title, Slug, Summary, Full Description
    // =========================================================================

    defineField({
      name: "title",
      title: "Excursion Title",
      type: "localizedString",
      description: "The main title shown in the hero, cards, and page title.",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL-friendly identifier. Auto-generated from the English title.",
      group: "content",
      options: {
        source: "title.en",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 96),
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "shortSummary",
      title: "Short Summary",
      type: "localizedText",
      description:
        "1–2 sentence tagline. Shown on excursion cards and below the title on the detail page.",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "localizedBlockContent",
      description:
        "Rich text body content (Portable Text). The main description section on the detail page.",
      group: "content",
    }),

    // =========================================================================
    // MEDIA — Hero Image + Gallery
    // =========================================================================

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Primary image shown as the large hero on the detail page and as the card thumbnail on browse pages. Recommended: 1600×1000px minimum.",
      group: "media",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette"],
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "localizedString",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      description:
        "Additional photos shown in the mosaic grid and lightbox. Recommended: 4–8 images, 1200×800px minimum.",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
            metadata: ["lqip"],
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "localizedString",
            }),
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),

    // =========================================================================
    // PRICING & LOGISTICS
    // =========================================================================

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "excursionCategory" }],
      description:
        "Excursion category (e.g. Island Tour, Catamaran, Adventure). Used for filtering and badge display.",
      group: "pricing",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      description:
        "Price per person in USD. Shown on cards and the pricing block.",
      group: "pricing",
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "depositAmount",
      title: "Deposit Amount (USD)",
      type: "number",
      description:
        "Required deposit to secure the booking. Shown in the pricing block and CTA.",
      group: "pricing",
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "localizedString",
      description:
        'Optional note below the price (e.g. "per person", "per group up to 6", "kids under 4 free").',
      group: "pricing",
    }),

    defineField({
      name: "duration",
      title: "Duration",
      type: "localizedString",
      description:
        'How long the excursion lasts (e.g. "4 hours", "Full day", "6–8 hours").',
      group: "pricing",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "pickupTime",
      title: "Pickup Time",
      type: "localizedString",
      description:
        'Typical pickup time range (e.g. "7:00 AM – 8:30 AM depending on hotel location").',
      group: "pricing",
    }),

    defineField({
      name: "pickupZones",
      title: "Pickup Zones",
      type: "array",
      description:
        "Hotel zones where pickup is available (e.g. Punta Cana, Bávaro, Cap Cana).",
      group: "pricing",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "groupSize",
      title: "Group Size",
      type: "localizedString",
      description:
        'Min/max group size info (e.g. "2–30 people", "Private — up to 8 guests").',
      group: "pricing",
    }),

    // =========================================================================
    // DETAILS & LISTS — Highlights, What's Included, What to Bring, Restrictions
    // =========================================================================

    defineField({
      name: "highlights",
      title: "Highlights",
      type: "localizedStringArray",
      description:
        "Key selling points shown as a bullet list (e.g. 'Swim with nurse sharks', 'Open bar included', 'Professional photos'). Aim for 4–6 items.",
      group: "details",
    }),

    defineField({
      name: "whatsIncluded",
      title: "What's Included",
      type: "localizedStringArray",
      description:
        "Checklist of everything included in the price (e.g. 'Round-trip transportation', 'Lunch buffet', 'Snorkeling gear').",
      group: "details",
    }),

    defineField({
      name: "whatToBring",
      title: "What to Bring",
      type: "localizedStringArray",
      description:
        "Items guests should bring (e.g. 'Sunscreen', 'Towel', 'Cash for tips', 'Waterproof phone case').",
      group: "details",
    }),

    defineField({
      name: "restrictions",
      title: "Restrictions",
      type: "localizedStringArray",
      description:
        "Important restrictions or warnings (e.g. 'Not recommended for pregnant women', 'Minimum age: 6 years', 'Must know how to swim').",
      group: "details",
    }),

    // =========================================================================
    // FAQ — Excursion-specific questions
    // =========================================================================

    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      description:
        "Frequently asked questions specific to this excursion. Shown as an accordion on the detail page.",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "question.en",
              subtitle: "answer.en",
            },
          },
        }),
      ],
    }),

    // =========================================================================
    // DISPLAY & SORTING
    // =========================================================================

    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description:
        "Featured excursions appear on the homepage and get a 'Featured' badge.",
      initialValue: false,
      group: "content",
    }),

    defineField({
      name: "badge",
      title: "Badge Label",
      type: "localizedString",
      description:
        'Optional badge shown on the card (e.g. "Best Seller", "Most Popular", "New"). Leave empty for no badge.',
      group: "content",
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description:
        "Lower numbers appear first. Used for manual ordering on browse pages.",
      initialValue: 100,
      group: "content",
    }),

    // =========================================================================
    // RELATED EXCURSIONS
    // =========================================================================

    defineField({
      name: "relatedExcursions",
      title: "Related Excursions",
      type: "array",
      description:
        "Manually curated related excursions shown at the bottom of the detail page. Pick 3.",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "excursion" }],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),

    // =========================================================================
    // SEO
    // =========================================================================

    // defineField({
    //   name: "seo",
    //   title: "SEO",
    //   type: "seo",
    //   description: "Page-level SEO metadata (title, description, OG image).",
    //   group: "seo",
    // }),
  ],

  // ===========================================================================
  // STUDIO PREVIEW
  // ===========================================================================

  preview: {
    // Avoid traversing references (e.g. category.title) in select — each join
    // slows the document list because Studio resolves them per row.
    select: {
      title: "title.en",
      shortSummary: "shortSummary.en",
      media: "heroImage",
      isFeatured: "isFeatured",
      price: "price",
    },
    prepare({ title, shortSummary, media, isFeatured, price }) {
      const badge = isFeatured ? "⭐ " : "";
      const priceStr = typeof price === "number" ? ` · $${price}` : "";
      const summary =
        typeof shortSummary === "string" && shortSummary.length > 0
          ? shortSummary.length > 72
            ? `${shortSummary.slice(0, 72)}…`
            : shortSummary
          : null;
      return {
        title: `${badge}${title || "Untitled Excursion"}`,
        subtitle: summary ? `${summary}${priceStr}` : priceStr.trim() || "Excursion",
        media,
      };
    },
  },

  // Order by sortOrder in the Studio list
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Title (A–Z)",
      name: "titleAsc",
      by: [{ field: "title.en", direction: "asc" }],
    },
    {
      title: "Price (Low → High)",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
});
