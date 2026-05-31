import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
const BuiltBy = () => {
  const t = useTranslations("Footer");
  const locale = useLocale();

  const jsonLd =
    locale === "es"
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Atribución del desarrollo del sitio web",
          inLanguage: "es",
          creator: {
            "@type": "Organization",
            "@id": "https://www.dr-webstudio.com/#organization",
            name: "DR Web Studio",
            url: "https://www.dr-webstudio.com/es",
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Website build attribution",
          inLanguage: "en",
          creator: {
            "@type": "Organization",
            "@id": "https://www.dr-webstudio.com/#organization",
            name: "DR Web Studio",
            url: "https://www.dr-webstudio.com/en",
          },
        };

  return (
    <div className="flex flex-col justify-between items-center space-y-4 md:space-y-0 mt-0">
      <p className="text-[11.5px] font-light text-[#6B7280] tracking-[0.04em] flex flex-col sm:flex-row items-center gap-2 flex-1 justify-center md:justify-end md:mr-8">
        {t("builtBy")}
        <a
          href={
            locale === "es"
              ? "https://www.dr-webstudio.com/es"
              : "https://www.dr-webstudio.com/en"
          }
          className="flex items-center gap-1 text-[11.5px] font-light text-[#6B7280] tracking-[0.04em] hover:text-[#0EA5B7] transition-colors duration-300 cursor-pointer"
        >
          <Image
            src="https://cdn.sanity.io/images/6r8ro1r9/production/81a1e4e2b8efbeb881d9ef9dd1624377bcd2f6d0-512x487.png"
            alt="DR Web Studio"
            width={17}
            height={16}
            className="h-4"
            loading="lazy"
          />
          DR Web Studio
        </a>
        <span className="hidden sm:inline text-text-muted"> —</span>{" "}
        {t("developedBy")}.
      </p>
      <script
        id="dr-webstudio-builtby-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </div>
  );
};

export default BuiltBy;
