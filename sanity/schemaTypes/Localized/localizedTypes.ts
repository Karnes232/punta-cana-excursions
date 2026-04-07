import { defineField, defineType, defineArrayMember } from "sanity";
import { i18n } from "../../lib/i18n";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: i18n.languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: "string" }),
  ),
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: i18n.languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: "text", rows: 3 }),
  ),
});

export const localizedBlockContent = defineType({
  name: "localizedBlockContent",
  title: "Localized Block Content",
  type: "object",
  fields: i18n.languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
  ),
});

export const localizedStringArray = defineType({
  name: "localizedStringArray",
  title: "Localized String Array",
  type: "object",
  fields: i18n.languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ),
});
