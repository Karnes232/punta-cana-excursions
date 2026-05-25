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
    { name: "intro", title: "Intro Section" },
    { name: "cta", title: "Contact CTA" },
    { name: "seoCopy", title: "SEO Copy" },
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
      name: "heroEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the hero headline.",
      group: "hero",
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
    // INTRO SECTION — SEO orientation block between the hero and the filters
    // =========================================================================

    defineField({
      name: "introEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the intro heading.",
      group: "intro",
    }),

    defineField({
      name: "introHeading",
      title: "Heading (H2)",
      type: "localizedString",
      description:
        'Section heading that gives the page context, e.g. "Tours & Excursions in Punta Cana".',
      group: "intro",
    }),

    defineField({
      name: "introBody",
      title: "Body",
      type: "localizedBlockContent",
      description:
        "Rich-text intro paragraph(s) describing what this page offers. Important for SEO and user orientation.",
      group: "intro",
    }),

    // =========================================================================
    // CONTACT CTA STRIP
    // =========================================================================

    defineField({
      name: "ctaEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the CTA headline.",
      group: "cta",
    }),

    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      description:
        'Headline for the contact help strip below the excursion grid. e.g. "Need help choosing?"',
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
      name: "ctaPrimaryButtonText",
      title: "Primary Button Text",
      type: "localizedString",
      description:
        'Text on the primary contact button. e.g. "Contact us" / "Contáctanos".',
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
      description:
        'Text on the secondary contact button. e.g. "View FAQ" / "Ver preguntas frecuentes".',
      group: "cta",
    }),

    defineField({
      name: "ctaSecondaryButtonHref",
      title: "Secondary Button Link",
      type: "string",
      description: 'Internal path, e.g. "/faq"',
      group: "cta",
    }),

    // =========================================================================
    // SEO COPY — long-tail content block at the bottom of the page
    // =========================================================================

    defineField({
      name: "seoCopyEyebrow",
      title: "Eyebrow",
      type: "localizedString",
      description: "Small uppercase kicker shown above the heading.",
      group: "seoCopy",
    }),

    defineField({
      name: "seoCopyHeading",
      title: "Heading (H2)",
      type: "localizedString",
      description:
        'Heading for the bottom SEO copy block, e.g. "Planning Your Punta Cana Excursion".',
      group: "seoCopy",
    }),

    defineField({
      name: "seoCopyBody",
      title: "Body",
      type: "localizedBlockContent",
      description:
        "Long-form rich text targeting longer-tail keywords. Shown at the bottom of the page, below the CTA.",
      group: "seoCopy",
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
