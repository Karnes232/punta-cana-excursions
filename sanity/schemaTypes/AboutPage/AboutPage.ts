import { defineArrayMember, defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: InfoOutlineIcon,

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Our Story" },
    { name: "stats", title: "Stats" },
    { name: "values", title: "Our Values" },
    { name: "team", title: "Team" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO
    // =========================================================================
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "heroBadge",
      title: "Hero Badge",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "localizedString",
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Subheadline",
      type: "localizedText",
      group: "hero",
    }),

    // =========================================================================
    // OUR STORY
    // =========================================================================
    defineField({
      name: "storyTagline",
      title: "Tagline",
      type: "localizedString",
      group: "story",
    }),
    defineField({
      name: "storyHeadline",
      title: "Headline",
      type: "localizedString",
      group: "story",
    }),
    defineField({
      name: "storyBody",
      title: "Story Body",
      type: "localizedText",
      group: "story",
      description: "Use double line breaks to separate paragraphs.",
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      group: "story",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "foundedYear",
      title: "Founded Year",
      type: "number",
      group: "story",
    }),

    // =========================================================================
    // STATS
    // =========================================================================
    defineField({
      name: "statsHeadline",
      title: "Stats Headline",
      type: "localizedString",
      group: "stats",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          name: "statItem",
          title: "Stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "localizedString",
              description: 'e.g. "10+" or "50,000+"',
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              description: 'e.g. "Years of Experience"',
            }),
          ],
          preview: {
            select: { title: "value.en", subtitle: "label.en" },
          },
        }),
      ],
    }),

    // =========================================================================
    // OUR VALUES
    // =========================================================================
    defineField({
      name: "valuesHeadline",
      title: "Values Headline",
      type: "localizedString",
      group: "values",
    }),
    defineField({
      name: "valuesSubheading",
      title: "Values Subheading",
      type: "localizedText",
      group: "values",
    }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          type: "object",
          name: "valueItem",
          title: "Value",
          fields: [
            defineField({
              name: "icon",
              title: "Icon Key",
              type: "string",
              description:
                "Icon key: safety, local, trust, bilingual, support, reviews, variety, booking",
            }),
            defineField({ name: "title", title: "Title", type: "localizedString" }),
            defineField({ name: "description", title: "Description", type: "localizedText" }),
          ],
          preview: {
            select: { title: "title.en", subtitle: "icon" },
          },
        }),
      ],
    }),

    // =========================================================================
    // TEAM
    // =========================================================================
    defineField({
      name: "teamHeadline",
      title: "Team Headline",
      type: "localizedString",
      group: "team",
    }),
    defineField({
      name: "teamSubheading",
      title: "Team Subheading",
      type: "localizedText",
      group: "team",
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      group: "team",
      of: [
        defineArrayMember({
          type: "object",
          name: "teamMember",
          title: "Team Member",
          fields: [
            defineField({
              name: "name",
              title: "Full Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "role", title: "Role / Title", type: "localizedString" }),
            defineField({ name: "bio", title: "Short Bio", type: "localizedText" }),
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true, metadata: ["lqip"] },
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role.en", media: "photo" },
          },
        }),
      ],
    }),

    // =========================================================================
    // CTA
    // =========================================================================
    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      group: "cta",
    }),
    defineField({
      name: "ctaSubheadline",
      title: "CTA Subheadline",
      type: "localizedText",
      group: "cta",
    }),
    defineField({
      name: "ctaButtonText",
      title: "WhatsApp Button Text",
      type: "localizedString",
      group: "cta",
    }),
    defineField({
      name: "ctaWhatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaContactText",
      title: "Contact Button Text",
      type: "localizedString",
      group: "cta",
    }),

    // =========================================================================
    // SEO
    // =========================================================================
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "localizedString" }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "localizedText",
        }),
        defineField({ name: "ogImage", title: "Open Graph Image", type: "image" }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
