import { defineArrayMember, defineField, defineType } from "sanity";
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

    // =========================================================================
    // POST-SUBMIT — "What happens next" panel shown after the form is sent
    // =========================================================================
    defineField({
      name: "successEyebrow",
      title: "Success — Eyebrow",
      type: "localizedString",
      description: 'Small uppercase kicker, e.g. "What happens next".',
    }),
    defineField({
      name: "successHeadline",
      title: "Success — Headline",
      type: "localizedString",
      description: "Heading shown after the form is submitted.",
    }),
    defineField({
      name: "successSubheading",
      title: "Success — Subheading",
      type: "localizedString",
      description: "Short supporting line under the success headline.",
    }),
    defineField({
      name: "successSteps",
      title: "Success — Steps",
      type: "array",
      description: "Steps explaining what happens after a message is sent.",
      of: [
        defineArrayMember({
          type: "object",
          name: "successStep",
          title: "Step",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "localizedText",
            }),
          ],
          preview: {
            select: { title: "title.en" },
          },
        }),
      ],
      validation: (r) => r.max(5),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
