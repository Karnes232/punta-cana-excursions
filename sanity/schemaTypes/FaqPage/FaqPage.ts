import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  icon: HelpCircleIcon,

  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the hero headline.",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedText",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true, metadata: ["lqip"] },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "localizedString",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "FAQ Categories",
      type: "array",
      description: "Group FAQs into categories. Each category becomes a section on the page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqCategory",
          title: "Category",
          fields: [
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "localizedString",
              description: "Small uppercase kicker shown above the category heading.",
            }),
            defineField({
              name: "categoryName",
              title: "Category Name",
              type: "localizedString",
              description: "The category heading (h2) and filter pill label.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "subheading",
              title: "Subheading",
              type: "localizedText",
              description: "Optional supporting copy shown under the category heading.",
            }),
            defineField({
              name: "icon",
              title: "Icon Key",
              type: "string",
              description:
                "Icon shown beside the category. One of: booking, cancellation, transport, safety, expect, diving, planning, about.",
              options: {
                list: [
                  { title: "Booking & Payments", value: "booking" },
                  {
                    title: "Cancellations, Refunds & Changes",
                    value: "cancellation",
                  },
                  {
                    title: "Pickup, Transportation & Hotels",
                    value: "transport",
                  },
                  { title: "Safety & Health Requirements", value: "safety" },
                  { title: "What to Expect", value: "expect" },
                  { title: "Diving & Snorkeling", value: "diving" },
                  { title: "Planning Your Trip", value: "planning" },
                  { title: "About Us & Operations", value: "about" },
                ],
              },
            }),
            defineField({
              name: "items",
              title: "FAQ Items",
              type: "array",
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
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "answer",
                      title: "Answer",
                      type: "localizedText",
                      validation: (r) => r.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "question.en" },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "categoryName.en" },
            prepare({ title }) {
              return { title: title ?? "Category" };
            },
          },
        }),
      ],
    }),

    // =========================================================================
    // CTA
    // =========================================================================
    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the CTA headline.",
    }),
    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
    }),
    defineField({
      name: "ctaSubheadline",
      title: "CTA Subheadline",
      type: "localizedText",
    }),
    defineField({
      name: "ctaPrimaryButtonText",
      title: "Primary Button Text",
      type: "localizedString",
    }),
    defineField({
      name: "ctaPrimaryButtonHref",
      title: "Primary Button Href",
      type: "string",
      description: 'Internal path, e.g. "/contact"',
      initialValue: "/contact",
    }),
    defineField({
      name: "ctaSecondaryButtonText",
      title: "Secondary Button Text",
      type: "localizedString",
    }),
    defineField({
      name: "ctaSecondaryButtonHref",
      title: "Secondary Button Href",
      type: "string",
      description: 'Internal path, e.g. "/excursions"',
      initialValue: "/excursions",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    prepare() {
      return { title: "FAQ Page" };
    },
  },
});
