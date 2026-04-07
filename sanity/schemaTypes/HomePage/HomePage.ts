import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "brandIntro", title: "Brand Intro" },
    { name: "featuredExcursions", title: "Featured Excursions" },
    { name: "excursionCategories", title: "Excursion Categories" },
    { name: "whyChooseUs", title: "Why Choose Us" },
    { name: "howBookingWorks", title: "How Booking Works" },
    { name: "reviews", title: "Reviews" },
    { name: "faqPreview", title: "FAQ Preview" },
    { name: "ctaBanner", title: "CTA Banner" },
  ],

  fields: [
    // =========================================================================
    // HERO
    // =========================================================================

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Full-width background image for the hero section.",
      options: { hotspot: true },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroImageAlt",
      title: "Hero Image Alt Text",
      type: "localizedString",
      description: "Descriptive alt text for the hero image.",
      group: "hero",
    }),

    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      description:
        'Main headline. e.g. "Discover the Best Excursions in Punta Cana"',
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedText",
      description: "Supporting text below the headline. 1–2 sentences.",
      group: "hero",
    }),

    defineField({
      name: "heroPrimaryCta",
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
          description: 'Internal path, e.g. "/excursions"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: "heroSecondaryCta",
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
          description: 'Internal path, e.g. "/how-it-works"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // =========================================================================
    // BRAND INTRO
    // =========================================================================

    defineField({
      name: "brandIntroTagline",
      title: "Tagline / Kicker",
      type: "localizedString",
      description:
        'Small uppercase text above the heading. e.g. "Local experts since day one"',
      group: "brandIntro",
    }),

    defineField({
      name: "brandIntroHeading",
      title: "Heading",
      type: "localizedString",
      description:
        'Section heading. e.g. "Curated excursions backed by real local experience"',
      group: "brandIntro",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "brandIntroBody",
      title: "Body Text",
      type: "localizedText",
      description:
        "2–3 sentences about who Grand Bay is and why they're trusted.",
      group: "brandIntro",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "brandIntroImage",
      title: "Image",
      type: "image",
      description: "Photo alongside the brand intro text.",
      options: { hotspot: true },
      group: "brandIntro",
    }),

    defineField({
      name: "brandIntroImageAlt",
      title: "Image Alt Text",
      type: "localizedString",
      group: "brandIntro",
    }),

    // =========================================================================
    // FEATURED EXCURSIONS
    // =========================================================================

    defineField({
      name: "featuredHeading",
      title: "Section Heading",
      type: "localizedString",
      description: 'e.g. "Top excursions in Punta Cana"',
      group: "featuredExcursions",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "featuredSubheading",
      title: "Section Subheading",
      type: "localizedText",
      group: "featuredExcursions",
    }),

    // defineField({
    //   name: "featuredExcursions",
    //   title: "Featured Excursions",
    //   type: "array",
    //   description:
    //     "Select 3–4 excursions to feature. Drag to reorder.",
    //   group: "featuredExcursions",
    //   of: [
    //     defineArrayMember({
    //       type: "reference",
    //       to: [{ type: "excursion" }],
    //     }),
    //   ],
    //   validation: (rule) => rule.min(2).max(6),
    // }),

    defineField({
      name: "featuredViewAllText",
      title: "View All Button Text",
      type: "localizedString",
      description: 'e.g. "Explore all excursions"',
      group: "featuredExcursions",
    }),

    // =========================================================================
    // EXCURSION CATEGORIES
    // =========================================================================

    defineField({
      name: "categoriesHeading",
      title: "Section Heading",
      type: "localizedString",
      description: 'e.g. "Browse by category"',
      group: "excursionCategories",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "categoriesSubheading",
      title: "Section Subheading",
      type: "localizedText",
      group: "excursionCategories",
    }),

    // defineField({
    //   name: "displayedCategories",
    //   title: "Displayed Categories",
    //   type: "array",
    //   description:
    //     "Select which categories to show and in what order. Leave empty to auto-pull all categories.",
    //   group: "excursionCategories",
    //   of: [
    //     defineArrayMember({
    //       type: "reference",
    //       to: [{ type: "excursionCategory" }],
    //     }),
    //   ],
    // }),

    // =========================================================================
    // WHY CHOOSE US
    // =========================================================================

    defineField({
      name: "whyChooseUsHeading",
      title: "Section Heading",
      type: "localizedString",
      description: 'e.g. "Why book with us"',
      group: "whyChooseUs",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "whyChooseUsSubheading",
      title: "Section Subheading",
      type: "localizedText",
      group: "whyChooseUs",
    }),

    defineField({
      name: "trustPillars",
      title: "Trust Pillars",
      type: "array",
      description: "3–4 trust points with icons.",
      group: "whyChooseUs",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description:
                "Icon key: local, trust, booking, support, variety, reviews, safety, bilingual",
              options: {
                list: [
                  { title: "Local Expertise", value: "local" },
                  { title: "Trusted & Verified", value: "trust" },
                  { title: "Easy Booking", value: "booking" },
                  { title: "Bilingual Support", value: "support" },
                  { title: "Wide Variety", value: "variety" },
                  { title: "Great Reviews", value: "reviews" },
                  { title: "Safety First", value: "safety" },
                  { title: "Bilingual", value: "bilingual" },
                ],
              },
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
            select: { title: "title.en", subtitle: "icon" },
          },
        }),
      ],
      validation: (rule) => rule.min(3).max(4),
    }),

    // =========================================================================
    // HOW BOOKING WORKS
    // =========================================================================

    defineField({
      name: "howBookingWorksHeading",
      title: "Section Heading",
      type: "localizedString",
      description: 'e.g. "How booking works"',
      group: "howBookingWorks",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "howBookingWorksSubheading",
      title: "Section Subheading",
      type: "localizedText",
      group: "howBookingWorks",
    }),

    defineField({
      name: "bookingSteps",
      title: "Booking Steps",
      type: "array",
      description: "3 steps: Browse → Deposit → Enjoy",
      group: "howBookingWorks",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "stepNumber",
              title: "Step Number",
              type: "number",
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Icon key: browse, deposit, enjoy, reserve, confirm",
              options: {
                list: [
                  { title: "Browse / Search", value: "browse" },
                  { title: "Deposit / Payment", value: "deposit" },
                  { title: "Enjoy / Sun", value: "enjoy" },
                  { title: "Reserve / Bookmark", value: "reserve" },
                  { title: "Confirm / Check", value: "confirm" },
                ],
              },
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
            select: {
              stepNumber: "stepNumber",
              title: "title.en",
            },
            prepare({ stepNumber, title }) {
              return {
                title: `Step ${stepNumber}: ${title || "Untitled"}`,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(3).max(5),
    }),

    // =========================================================================
    // REVIEWS / TESTIMONIALS
    // =========================================================================

    defineField({
      name: "reviewsHeading",
      title: "Section Heading",
      type: "localizedString",
      description: 'e.g. "What travelers are saying"',
      group: "reviews",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "reviewsSubheading",
      title: "Section Subheading",
      type: "localizedText",
      group: "reviews",
    }),

    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      description: "Customer testimonials. 3–6 recommended.",
      group: "reviews",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Reviewer Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "country",
              title: "Country",
              type: "string",
              description: "Optional. e.g. United States, Canada, Colombia",
            }),
            defineField({
              name: "text",
              title: "Review Text",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              description: "1–5 stars",
              validation: (rule) => rule.required().min(1).max(5),
              initialValue: 5,
            }),
            defineField({
              name: "excursionTitle",
              title: "Excursion Title",
              type: "string",
              description:
                "Optional. Shows as a tag on the review card. e.g. Saona Island",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "excursionTitle",
              rating: "rating",
            },
            prepare({ title, subtitle, rating }) {
              const stars = "★".repeat(rating || 0);
              return {
                title: title || "Unnamed",
                subtitle: `${stars} ${subtitle ? `— ${subtitle}` : ""}`,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(3).max(12),
    }),

    // =========================================================================
    // FAQ PREVIEW
    // =========================================================================

    defineField({
      name: "faqPreviewHeading",
      title: "Section Heading",
      type: "localizedString",
      description: 'e.g. "Common questions"',
      group: "faqPreview",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "faqPreviewSubheading",
      title: "Section Subheading",
      type: "localizedText",
      group: "faqPreview",
    }),

    defineField({
      name: "faqPreviewItems",
      title: "FAQ Items",
      type: "array",
      description:
        "4–5 top questions. These can be references to FAQ items or inline.",
      group: "faqPreview",
      of: [
        defineArrayMember({
          type: "object",
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
      validation: (rule) => rule.min(3).max(8),
    }),

    defineField({
      name: "faqPreviewCtaText",
      title: "View All FAQs Text",
      type: "localizedString",
      description: 'e.g. "View all FAQs"',
      group: "faqPreview",
    }),

    // =========================================================================
    // CTA BANNER
    // =========================================================================

    defineField({
      name: "ctaBannerHeadline",
      title: "Headline",
      type: "localizedString",
      description: 'e.g. "Ready to explore Punta Cana?"',
      group: "ctaBanner",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "ctaBannerSubheadline",
      title: "Subheadline",
      type: "localizedText",
      description: "Supporting text below the headline.",
      group: "ctaBanner",
    }),

    defineField({
      name: "ctaBannerButtonText",
      title: "Primary Button Text",
      type: "localizedString",
      description: 'e.g. "Book now"',
      group: "ctaBanner",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "ctaBannerButtonHref",
      title: "Primary Button Link",
      type: "string",
      description: 'Internal path, e.g. "/contact"',
      group: "ctaBanner",
    }),

    defineField({
      name: "ctaBannerWhatsappLabel",
      title: "WhatsApp Button Label",
      type: "localizedString",
      description: 'e.g. "Chat on WhatsApp"',
      group: "ctaBanner",
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Home Page",
        subtitle: "Homepage content and sections",
      };
    },
  },
});
