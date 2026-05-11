import { defineType, defineField, defineArrayMember } from "sanity";
import { DropIcon } from "@sanity/icons";

export const divingExcursion = defineType({
  name: "divingExcursion",
  title: "Scuba Diving Excursion",
  type: "document",
  icon: DropIcon,

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "diving", title: "Diving Details" },
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
      description: "URL-friendly identifier. Auto-generated from the English title.",
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
      name: "externalBookingUrl",
      title: "External Booking URL",
      type: "url",
      description:
        "Full URL on the sister site where this excursion is booked. The Reserve button opens this link in a new tab.",
      group: "content",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["https"],
          allowRelative: false,
        }),
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
        "Primary image shown as the large hero on the detail page and as the card thumbnail. Recommended: 1600×1000px minimum.",
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
        "Additional underwater and on-boat photos. Recommended: 4–8 images, 1200×800px minimum.",
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
    // DIVING DETAILS — Activity type, experience level, dive-specific info
    // =========================================================================

    defineField({
      name: "audienceType",
      title: "Audience Type",
      type: "string",
      description:
        "Who is this excursion for? Drives which section it appears in on the Scuba Diving page.",
      group: "diving",
      options: {
        list: [
          { title: "Course / Certification", value: "course" },
          { title: "Certified Divers Only", value: "certified" },
          { title: "All / No Certification Required", value: "all" },
        ],
        layout: "radio",
      },
      initialValue: "all",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "experienceLevel",
      title: "Experience Level",
      type: "string",
      description: "Required skill level. Shown as a badge on the detail page and cards.",
      group: "diving",
      options: {
        list: [
          { title: "All Levels (No experience needed)", value: "all-levels" },
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
        layout: "radio",
      },
      initialValue: "all-levels",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "certificationRequired",
      title: "Certification Required?",
      type: "boolean",
      description:
        "Toggle on if a valid dive certification (e.g. PADI Open Water) is required to participate.",
      group: "diving",
      initialValue: false,
    }),

    defineField({
      name: "certificationDetails",
      title: "Certification Details",
      type: "localizedString",
      description:
        'Specify what certification is required, e.g. "PADI Open Water or equivalent". Leave empty if no certification is needed.',
      group: "diving",
    }),

    defineField({
      name: "maxDepth",
      title: "Maximum Depth",
      type: "localizedString",
      description:
        'Maximum dive depth for scuba excursions, e.g. "12 meters (40 ft)". Leave empty for snorkeling-only excursions.',
      group: "diving",
    }),

    defineField({
      name: "numberOfDives",
      title: "Number of Dives",
      type: "number",
      description:
        "For scuba packages: how many dives are included. Leave empty for snorkeling or single-dive experiences.",
      group: "diving",
      validation: (rule) => rule.min(1).integer(),
    }),

    defineField({
      name: "marineLife",
      title: "Marine Life Highlights",
      type: "localizedStringArray",
      description:
        'Notable marine life or underwater sites guests may encounter, e.g. "Nurse sharks", "Coral gardens", "Tropical reef fish". Aim for 4–6 items.',
      group: "diving",
    }),

    defineField({
      name: "equipmentProvided",
      title: "Equipment Provided",
      type: "localizedStringArray",
      description:
        'Dive/snorkel gear included with the excursion, e.g. "Mask & fins", "BCD & regulator", "Wetsuit". Complements What\'s Included.',
      group: "diving",
    }),

    // =========================================================================
    // PRICING & LOGISTICS
    // =========================================================================

    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      description: "Price per person in USD. Shown on cards and the pricing block.",
      group: "pricing",
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "depositAmount",
      title: "Deposit Amount (USD)",
      type: "number",
      description: "Required deposit to secure the booking. Shown in the pricing block and CTA.",
      group: "pricing",
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "localizedString",
      description:
        'Optional note below the price, e.g. "per person", "includes all equipment", "kids under 10 free".',
      group: "pricing",
    }),

    defineField({
      name: "duration",
      title: "Duration",
      type: "localizedString",
      description: 'How long the excursion lasts, e.g. "3 hours", "Half day", "5–6 hours".',
      group: "pricing",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "pickupTime",
      title: "Pickup Time",
      type: "localizedString",
      description:
        'Typical pickup time range, e.g. "7:00 AM – 8:30 AM depending on hotel location".',
      group: "pricing",
    }),

    defineField({
      name: "pickupZones",
      title: "Pickup Zones",
      type: "array",
      description: "Hotel zones where pickup is available, e.g. Punta Cana, Bávaro, Cap Cana.",
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
        'Min/max group size info, e.g. "2–15 people", "Private — up to 8 guests".',
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
        "Key selling points shown as a bullet list. Aim for 4–6 items.",
      group: "details",
    }),

    defineField({
      name: "whatsIncluded",
      title: "What's Included",
      type: "localizedStringArray",
      description:
        "Checklist of everything included in the price, e.g. 'Round-trip transportation', 'Dive instructor', 'Underwater photos'.",
      group: "details",
    }),

    defineField({
      name: "whatToBring",
      title: "What to Bring",
      type: "localizedStringArray",
      description:
        "Items guests should bring, e.g. 'Swimsuit', 'Sunscreen (reef-safe)', 'Towel', 'Cash for tips'.",
      group: "details",
    }),

    defineField({
      name: "restrictions",
      title: "Restrictions",
      type: "localizedStringArray",
      description:
        "Important restrictions or warnings, e.g. 'Not suitable for non-swimmers', 'Minimum age: 8 years', 'Not recommended for pregnant women or those with heart conditions'.",
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
      description: "Featured excursions appear prominently on the Diving & Snorkeling page.",
      initialValue: false,
      group: "content",
    }),

    defineField({
      name: "badge",
      title: "Badge Label",
      type: "localizedString",
      description:
        'Optional badge shown on the card, e.g. "Best Seller", "Most Popular", "PADI Certified". Leave empty for no badge.',
      group: "content",
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first. Used for manual ordering on the page.",
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
        "Manually curated related diving/snorkeling excursions shown at the bottom of the detail page. Pick up to 3.",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "divingExcursion" }],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),

    // =========================================================================
    // SEO
    // =========================================================================

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],

  // ===========================================================================
  // STUDIO PREVIEW
  // ===========================================================================

  preview: {
    select: {
      title: "title.en",
      shortSummary: "shortSummary.en",
      media: "heroImage",
      isFeatured: "isFeatured",
      price: "price",
    },
    prepare({ title, shortSummary, media, isFeatured, price }) {
      const star = isFeatured ? "⭐ " : "";
      const priceStr = typeof price === "number" ? ` · $${price}` : "";
      const summary =
        typeof shortSummary === "string" && shortSummary.length > 0
          ? shortSummary.length > 72
            ? `${shortSummary.slice(0, 72)}…`
            : shortSummary
          : null;
      return {
        title: `${star}${title || "Untitled Excursion"}`,
        subtitle: summary
          ? `${summary}${priceStr}`
          : priceStr.trim() || "Scuba Diving Excursion",
        media,
      };
    },
  },

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
