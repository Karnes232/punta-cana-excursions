import { defineType, defineField, defineArrayMember } from "sanity";
import { DropIcon } from "@sanity/icons";

/* ---------------------------------------------------------------------------
   divingSnorkelingPage — Singleton page schema
   
   CMS fields for the Diving & Snorkeling page hero + page-level content.
   Excursion cards are pulled dynamically via GROQ (filtering by category),
   so they're not stored on this document.
   --------------------------------------------------------------------------- */

export const divingSnorkelingPage = defineType({
  name: "divingSnorkelingPage",
  title: "Scuba Diving Page",
  type: "document",
  icon: DropIcon,

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro Section" },
    { name: "whyDive", title: "Why Dive" },
    { name: "excursionSections", title: "Excursion Sections" },
    { name: "trust", title: "Why Book With Us" },
    { name: "faq", title: "FAQ" },
    { name: "cta", title: "CTA Section" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO
    // =========================================================================

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Full-width underwater/diving hero image. Recommended: 1920×1080 or larger.",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette"],
      },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroBadge",
      title: "Hero Badge",
      type: "localizedString",
      description:
        'Small credibility badge above the headline, e.g. "Grand Bay Diving Expertise"',
      group: "hero",
    }),

    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      description:
        'Main heading, e.g. "Dive Into the Caribbean\'s Best Underwater Experiences"',
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedString",
      description:
        "Supporting text under the headline. 1-2 sentences about diving/snorkeling expertise.",
      group: "hero",
    }),

    defineField({
      name: "heroPrimaryCTA",
      title: "Primary CTA",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "localizedString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description: 'URL or anchor, e.g. "/scuba-diving"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: "heroSecondaryCTA",
      title: "Secondary CTA",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "localizedString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description:
            'URL or anchor, e.g. "/scuba-diving" or "/contact"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // =========================================================================
    // INTRO SECTION
    // =========================================================================

    defineField({
      name: "introTagline",
      title: "Intro Tagline",
      type: "localizedString",
      description:
        'Small uppercase kicker above the heading, e.g. "Our Diving Heritage"',
      group: "intro",
    }),

    defineField({
      name: "introHeadline",
      title: "Intro Headline",
      type: "localizedString",
      description:
        'Heading for the diving expertise intro, e.g. "Punta Cana\'s Trusted Dive Team"',
      group: "intro",
    }),

    defineField({
      name: "introBody",
      title: "Intro Body",
      type: "localizedBlockContent",
      description:
        "Rich text introducing Grand Bay's diving expertise and experience.",
      group: "intro",
    }),

    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      description:
        "Supporting image for the intro section (team photo, underwater shot, etc.)",
      options: { hotspot: true, metadata: ["lqip"] },
      group: "intro",
    }),

    defineField({
      name: "introStats",
      title: "Intro Stats",
      type: "array",
      description:
        "3-4 credential stats shown below the intro text (e.g. years of experience, dives completed).",
      group: "intro",
      of: [
        {
          type: "object",
          name: "introStat",
          title: "Stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "localizedString",
              description: 'The number or value, e.g. "10+", "5,000+", "PADI"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              description:
                'What the value represents, e.g. "Years Experience", "Dives Completed"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value.en", subtitle: "label.en" },
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),

    // =========================================================================
    // WHY DIVE — "Why Dive in Punta Cana" editorial / SEO block
    // =========================================================================

    defineField({
      name: "whyDiveEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the heading.",
      group: "whyDive",
    }),

    defineField({
      name: "whyDiveHeading",
      title: "Heading",
      type: "localizedString",
      description: 'Section heading, e.g. "Why Dive in Punta Cana"',
      group: "whyDive",
    }),

    defineField({
      name: "whyDiveBody",
      title: "Body",
      type: "localizedBlockContent",
      description: "Rich-text body for the section.",
      group: "whyDive",
    }),

    // =========================================================================
    // EXCURSION SECTIONS — Headings for Courses + Certified Divers lists
    // =========================================================================

    defineField({
      name: "coursesEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the courses heading.",
      group: "excursionSections",
    }),

    defineField({
      name: "coursesHeading",
      title: "Courses Section Heading",
      type: "localizedString",
      description:
        'Heading for the courses/certification section, e.g. "Diving Courses & Certifications"',
      group: "excursionSections",
    }),

    defineField({
      name: "coursesSubheading",
      title: "Courses Section Subheading",
      type: "localizedBlockContent",
      description: "Optional supporting copy under the courses heading.",
      group: "excursionSections",
    }),

    defineField({
      name: "coursesBody",
      title: "Courses Section Body",
      type: "localizedBlockContent",
      description: "Rich-text body shown below the courses subheading.",
      group: "excursionSections",
    }),

    defineField({
      name: "certifiedEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description:
        "Small uppercase kicker shown above the certified-divers heading.",
      group: "excursionSections",
    }),

    defineField({
      name: "certifiedHeading",
      title: "Certified Divers Section Heading",
      type: "localizedString",
      description:
        'Heading for the certified-divers section, e.g. "Excursions for Certified Divers"',
      group: "excursionSections",
    }),

    defineField({
      name: "certifiedSubheading",
      title: "Certified Divers Section Subheading",
      type: "localizedBlockContent",
      description: "Optional supporting copy under the certified-divers heading.",
      group: "excursionSections",
    }),

    defineField({
      name: "certifiedBody",
      title: "Certified Divers Section Body",
      type: "localizedBlockContent",
      description: "Rich-text body shown below the certified-divers subheading.",
      group: "excursionSections",
    }),

    // =========================================================================
    // TRUST BLOCK — "Why Book Water Activities With Us"
    // =========================================================================

    defineField({
      name: "trustHeadline",
      title: "Trust Section Headline",
      type: "localizedString",
      description: 'e.g. "Why Book Your Water Adventures With Grand Bay"',
      group: "trust",
    }),

    defineField({
      name: "trustPillars",
      title: "Trust Pillars",
      type: "array",
      description: "3-4 trust points with icons, titles, and descriptions.",
      group: "trust",
      of: [
        {
          type: "object",
          name: "trustPillar",
          title: "Trust Pillar",
          fields: [
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description:
                'Icon identifier used by the frontend, e.g. "certified", "experience", "safety", "local"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title.en", icon: "icon" },
            prepare({ title, icon }) {
              return { title: title || "Untitled", subtitle: icon };
            },
          },
        },
      ],
      validation: (rule) => rule.max(6),
    }),

    // =========================================================================
    // FAQ SECTION
    // =========================================================================

    defineField({
      name: "faqEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the heading.",
      group: "faq",
    }),

    defineField({
      name: "faqHeading",
      title: "Heading",
      type: "localizedString",
      description: 'Section heading, e.g. "Diving Questions, Answered"',
      group: "faq",
    }),

    defineField({
      name: "faqSubheading",
      title: "Subheading",
      type: "localizedText",
      description: "Optional supporting copy under the heading.",
      group: "faq",
    }),

    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description: "Questions and answers shown in the accordion.",
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
            select: { title: "question.en" },
          },
        }),
      ],
      validation: (rule) => rule.max(12),
    }),

    // =========================================================================
    // CTA SECTION
    // =========================================================================

    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      description:
        'Bottom CTA banner headline, e.g. "Ready to Explore Underwater Punta Cana?"',
      group: "cta",
    }),

    defineField({
      name: "ctaPrimaryButtonText",
      title: "Primary Button Text",
      type: "localizedString",
      description: 'Text on the primary CTA button. e.g. "Contact us".',
      group: "cta",
    }),

    defineField({
      name: "ctaPrimaryButtonHref",
      title: "Primary Button Link",
      type: "string",
      description: 'Internal path, e.g. "/contact"',
      group: "cta",
    }),

    defineField({
      name: "ctaSecondaryButtonText",
      title: "Secondary Button Text",
      type: "localizedString",
      description: 'Text on the secondary CTA button. e.g. "Browse Excursions".',
      group: "cta",
    }),

    defineField({
      name: "ctaSecondaryButtonHref",
      title: "Secondary Button Link",
      type: "string",
      description: 'Internal path, e.g. "/excursions"',
      group: "cta",
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

  preview: {
    select: { title: "heroHeadline.en" },
    prepare({ title }) {
      return {
        title: title || "Diving & Snorkeling Page",
        subtitle: "Page — Singleton",
      };
    },
  },
});
