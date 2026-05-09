import { defineType, defineField } from "sanity";
import { SearchIcon } from "@sanity/icons";

export const excursionsPage = defineType({
  name: "excursionsPage",
  title: "Excursions Page",
  type: "document",
  icon: SearchIcon,
  // Singleton — enforced via desk structure (structure.ts)

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "cta", title: "WhatsApp CTA" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO SECTION
    // =========================================================================

    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      description:
        "Full-width background image for the browse page hero. Landscape orientation, min 1920×800px. An underwater scene, catamaran, or aerial beach shot works well.",
      options: { hotspot: true },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      description:
        'Main heading displayed over the hero image. Keep it short and action-oriented. e.g. "Explore Our Excursions" or "Find Your Perfect Adventure".',
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedText",
      description:
        'Supporting text below the headline. 1–2 sentences. e.g. "Discover top-rated tours, island adventures, and unforgettable experiences — all with local support and easy booking."',
      group: "hero",
    }),

    // =========================================================================
    // WHATSAPP CTA STRIP
    // =========================================================================

    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      description:
        'Headline for the WhatsApp help strip below the excursion grid. e.g. "Need help choosing?"',
      group: "cta",
    }),

    defineField({
      name: "ctaDescription",
      title: "CTA Description",
      type: "localizedText",
      description:
        'Supporting text for the CTA strip. e.g. "Our local team is here to help you find the perfect excursion."',
      group: "cta",
    }),

    defineField({
      name: "ctaWhatsappButtonText",
      title: "WhatsApp Button Text",
      type: "localizedString",
      description:
        'Text on the WhatsApp button. e.g. "Chat on WhatsApp" / "Chatea por WhatsApp".',
      group: "cta",
    }),

    defineField({
      name: "ctaContactButtonText",
      title: "Contact Button Text",
      type: "localizedString",
      description:
        'Text on the secondary contact button. e.g. "Contact Us" / "Contáctanos".',
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
    select: {
      title: "heroHeadline.en",
      media: "heroImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "Excursions Page",
        subtitle: "Browse page content",
        media,
      };
    },
  },
});
