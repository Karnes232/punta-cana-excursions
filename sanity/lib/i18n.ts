export const i18n = {
  languages: [
    { id: "en", title: "English" },
    { id: "es", title: "Spanish" },
  ],
  defaultLanguage: "en",
};

export type Language = (typeof i18n.languages)[number]["id"];
