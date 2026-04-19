import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  icon: BookIcon,

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
  ],

  preview: {
    prepare() {
      return { title: "Blog Page" };
    },
  },
});
