import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Only en/es message catalogs exist. The extra blog locales (fr/de/pt/it) are
  // valid routing locales used solely by individual blog articles, whose shared
  // chrome (Navbar/Footer) falls back to English. Keep `locale` as the real
  // requested value so <html lang> and useLocale() stay correct.
  const messagesLocale = locale === "es" ? "es" : "en";

  return {
    locale,
    messages: (await import(`../messages/${messagesLocale}.json`)).default,
  };
});
