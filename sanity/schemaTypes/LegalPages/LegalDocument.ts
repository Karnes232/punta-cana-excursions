import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const legalDocument = defineType({
  name: "legalDocument",
  title: "Legal Document",
  type: "document",
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "localizedBlockContent",
      description: "Full page content in Portable Text. Supports headings, paragraphs, lists, and links.",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      description: "Displayed at the top of the page.",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    select: { title: "title.en", date: "lastUpdated" },
    prepare({ title, date }) {
      return {
        title: title ?? "Legal Document",
        subtitle: date ? `Last updated: ${date}` : "",
      };
    },
  },
});
