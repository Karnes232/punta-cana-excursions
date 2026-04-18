import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,

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
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "formHeadline",
      title: "Form Section Headline",
      type: "localizedString",
      description: "Heading above the contact form column.",
    }),
    defineField({
      name: "infoHeadline",
      title: "Info Section Headline",
      type: "localizedString",
      description: "Heading above the contact info cards column.",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
