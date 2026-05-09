import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

export const generalLayout = defineType({
  name: "generalLayout",
  title: "General Layout",
  type: "document",
  icon: CogIcon,
  // Singleton — only one instance should exist
  // Enforced via desk structure (structure.ts)

  groups: [
    { name: "branding", title: "Branding", default: true },
    { name: "contact", title: "Contact & Booking" },
    { name: "social", title: "Social Media" },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "Default SEO" },
  ],

  fields: [
    // =========================================================================
    // BRANDING
    // =========================================================================

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Main site logo. Used in the navbar and footer.",
      options: { hotspot: true },
      group: "branding",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "logoAlt",
      title: "Logo (Alternate)",
      type: "image",
      description:
        "Optional alternate logo for dark backgrounds or mobile. Leave empty to use the main logo everywhere.",
      options: { hotspot: true },
      group: "branding",
    }),

    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description:
        "Square brand mark used as the browser tab icon and home-screen icon. SVG or PNG, 512×512 minimum recommended. Falls back to the main logo if blank.",
      options: { hotspot: false, accept: "image/png,image/svg+xml,image/jpeg" },
      group: "branding",
    }),

    defineField({
      name: "companyName",
      title: "Company Name",
      type: "localizedString",
      group: "branding",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localizedString",
      description:
        "Short brand tagline. Used in the footer, meta descriptions, or hero fallback.",
      group: "branding",
      validation: (rule) => rule.required(),
    }),

    // =========================================================================
    // CONTACT & BOOKING
    // =========================================================================

    defineField({
      name: "email",
      title: "Primary Email",
      type: "string",
      description:
        "Main booking/contact email. Displayed in the navbar, footer, and contact page.",
      group: "contact",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            name: "email",
            invert: false,
          })
          .error("Must be a valid email address"),
    }),

    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Phone number (with country code).",
      group: "contact",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "serviceArea",
      title: "Service Area",
      type: "localizedText",
      description:
        "Where you operate. Shown in the footer and contact page. e.g. 'Serving all hotels in Punta Cana, Bávaro, and Cap Cana.'",
      group: "contact",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "contactCtaText",
      title: "Contact CTA Text",
      type: "localizedString",
      description:
        "Call-to-action text for the contact form button. e.g. 'Book Your Excursion' or 'Get in Touch'.",
      group: "contact",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "responseTime",
      title: "Response Time",
      type: "localizedString",
      description:
        "Expected response time. Shown near contact forms to set expectations.",
      group: "contact",
      validation: (rule) => rule.required(),
    }),

    // =========================================================================
    // SOCIAL MEDIA
    // =========================================================================

    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      validation: (rule) => rule.required(),
      description:
        "Add your social media profiles. Displayed in the footer and optionally in the navbar.",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "YouTube", value: "youtube" },
                  { title: "X (Twitter)", value: "twitter" },
                  { title: "Google Business", value: "google" },
                  { title: "TripAdvisor", value: "tripadvisor" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),

    // =========================================================================
    // NAVIGATION
    // =========================================================================

    defineField({
      name: "navLinks",
      title: "Navigation Links",
      validation: (rule) => rule.required(),
      type: "array",
      description:
        "Main navigation items. Drag to reorder. These appear in the navbar.",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL Path",
              type: "string",
              description:
                "Internal path (e.g. /excursions) or external URL. Do not include the locale prefix.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "isExternal",
              title: "Opens in New Tab?",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label.en", subtitle: "href" },
          },
        }),
      ],
    }),

    defineField({
      name: "navCtaButton",
      title: "Navbar CTA Button",
      type: "object",
      description:
        "Primary action button in the navbar (e.g. 'Book Now' linking to /contact).",
      group: "navigation",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "label",
          title: "Button Label",
          type: "localizedString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "URL Path",
          type: "string",
          description: "Where the button links (e.g. /contact).",
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // =========================================================================
    // FOOTER
    // =========================================================================

    defineField({
      name: "footerDescription",
      title: "Footer Description",
      type: "localizedText",
      description:
        "Short brand description shown in the footer below the logo.",
      group: "footer",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "footerQuickLinks",
      title: "Footer Quick Links",
      validation: (rule) => rule.required(),
      type: "array",
      description:
        "Secondary links shown in the footer (e.g. About, Blog, How It Works).",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL Path",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label.en", subtitle: "href" },
          },
        }),
      ],
    }),

    // =========================================================================
    // DEFAULT SEO (site-wide fallbacks)
    // =========================================================================

    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      description:
        "Used as fallback when a page does not provide its own SEO values. Set the default site title, description, OG image, etc.",
    }),
  ],

  preview: {
    select: {
      title: "companyName.en",
      media: "logo",
    },
    prepare({ title, media }) {
      return {
        title: title || "General Layout",
        subtitle: "Site-wide settings",
        media,
      };
    },
  },
});
