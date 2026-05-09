import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  icon: HelpCircleIcon,

  fields: [
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
              name: "categoryName",
              title: "Category Name",
              type: "localizedString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Key",
              type: "string",
              description: "Icon key: booking, excursion, cancellation, safety, general",
              options: {
                list: [
                  { title: "Booking", value: "booking" },
                  { title: "Excursion", value: "excursion" },
                  { title: "Cancellation", value: "cancellation" },
                  { title: "Safety", value: "safety" },
                  { title: "General", value: "general" },
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
