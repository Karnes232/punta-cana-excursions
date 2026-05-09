import { Link } from "@/i18n/navigation";
import ContactItem from "./ContactItem";
import Image from "next/image";
import SocialIcon from "./SocialIcon";
import {
  FooterQuickLink,
  LocalizedField,
  Logo as LogoType,
  SocialLink,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { useTranslations } from "next-intl";
export default function Footer({
  locale,
  companyName,
  logo,
  tagline,
  footerDescription,
  socialLinks,
  footerQuickLinks,
  email,
  phone,
  serviceArea,
  responseTime,
}: {
  locale: string;
  companyName: string;
  logo: LogoType;
  tagline: string;
  footerDescription: string;
  socialLinks: SocialLink[];
  footerQuickLinks: FooterQuickLink[];
  email: string;
  phone: string;
  serviceArea: string;
  responseTime: string;
}) {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");
  const legalLinks = [
    { label: t("privacyPolicy"), href: "/privacy-policy" },
    { label: t("termsOfService"), href: "/terms-of-service" },
    { label: t("cancellationPolicy"), href: "/cancellation-policy" },
  ];
  return (
    <footer className="bg-[#1F2937] pt-0 overflow-hidden">
      {/* Ocean → Teal → Orange gradient accent bar */}
      <div
        className="h-[7px] w-full"
        style={{
          background:
            "linear-gradient(90deg, #005F86 0%, #0EA5B7 50%, #F4A11A 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 pb-0">
        {/* Four-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.2fr] gap-10 mb-12">
          {/* ── Col 1: Brand ───────────────────────────────────────────────── */}
          <div>
            <Link href="/" className="inline-block group">
              {logo?.asset?.url ? (
                <Image
                  src={logo.asset.url}
                  alt={companyName ?? "Punta Cana Excursions by Grand Bay"}
                  width={80}
                  height={80}
                  className="h-20 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
                />
              ) : (
                // Text fallback while logo not yet uploaded in Sanity
                <div className="leading-tight">
                  <p className="text-[15px] font-bold text-white tracking-tight leading-none">
                    {companyName ?? "Punta Cana Excursions"}
                  </p>
                  {tagline && (
                    <p className="text-[11px] font-semibold text-[#F4A11A] tracking-wide mt-0.5">
                      {tagline}
                    </p>
                  )}
                </div>
              )}
            </Link>

            {/* footerDescription from Sanity */}
            {footerDescription && (
              <p className="text-[13px] text-[#9CA3AF] leading-relaxed mt-4 max-w-[220px] font-[Inter,sans-serif]">
                {footerDescription}
              </p>
            )}

            {/* socialLinks[] from Sanity */}
            {socialLinks?.length > 0 && (
              <div className="flex gap-2 mt-5">
                {socialLinks.map((s: SocialLink) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="w-8 h-8 rounded-lg bg-white/8 border border-white/15 flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-white/16 transition-colors duration-150"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}

            {/* Language badges — static, bilingual is a brand constant */}
            {/* <div className="mt-5">
              <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#6B7280] mb-2">
                We speak
              </p>
              <div className="flex gap-2">
                <span className="text-[12px] font-semibold text-[#9CA3AF] bg-white/6 border border-white/10 px-2.5 py-1 rounded">
                  🇺🇸 English
                </span>
                <span className="text-[12px] font-semibold text-[#9CA3AF] bg-white/6 border border-white/10 px-2.5 py-1 rounded">
                  🇩🇴 Español
                </span>
              </div>
            </div> */}
          </div>

          {/* ── Col 2: Excursions (static page-level links) ─────────────────── */}
          {/* These are not in generalLayout by design — they're page/content links */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#0EA5B7] mb-4">
              {t("excursions")}
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Island Tours", href: "/excursions/island-tours" },
                { label: "Catamaran Trips", href: "/excursions/catamaran" },
                { label: "Scuba Diving", href: "/scuba-diving" },
                { label: "Adventure Tours", href: "/excursions/adventure" },
                { label: "Private Tours", href: "/private-tours" },
                { label: "Family Tours", href: "/excursions/family" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors duration-150 font-[Inter,sans-serif]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: footerQuickLinks[] from Sanity ───────────────────────── */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#0EA5B7] mb-4">
              {t("company")}
            </h4>
            {footerQuickLinks?.length > 0 ? (
              <ul className="space-y-2">
                {footerQuickLinks.map((link: FooterQuickLink) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors duration-150 font-[Inter,sans-serif]"
                    >
                      {link.label[locale as keyof LocalizedField]}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] text-[#6B7280] italic font-[Inter,sans-serif]">
                No links added yet.
              </p>
            )}
          </div>

          {/* ── Col 4: Contact — from Sanity email / phone / serviceArea / responseTime ── */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#0EA5B7] mb-4">
              {t("contact")}
            </h4>

            {phone && (
              <ContactItem icon={<WhatsAppIcon size={15} />}>
                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150"
                >
                  {phone}
                </a>
                <br />
                <span className="text-white/60 text-[12px]">
                  Daily · 8 am – 8 pm
                </span>
              </ContactItem>
            )}

            {email && (
              <ContactItem icon={<EmailIcon />}>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors duration-150 break-all"
                >
                  {email}
                </a>
              </ContactItem>
            )}

            {serviceArea && (
              <ContactItem icon={<PinIcon />}>{serviceArea}</ContactItem>
            )}

            {responseTime && (
              <ContactItem icon={<ClockIcon />}>
                <span className="text-white/80">{responseTime}</span>
              </ContactItem>
            )}
          </div>
        </div>
        {/* WhatsApp CTA band */}
        {/* <WhatsAppCtaBand phone={data.phone} /> */}
        {/* Bottom strip */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#6B7280] font-[Inter,sans-serif] text-center sm:text-left">
            © {currentYear}{" "}
            {companyName ?? "Punta Cana Excursions by Grand Bay"}. All rights
            reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors duration-150 font-[Inter,sans-serif]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1C4.1 1 1 4.1 1 8c0 1.2.3 2.4.9 3.4L1 15l3.7-.9C5.7 14.7 6.8 15 8 15c3.9 0 7-3.1 7-7S11.9 1 8 1zm3.5 9.9c-.2.4-.9.8-1.3.8-.3 0-.7.1-2.1-.4-1.8-.7-2.9-2.4-3-2.5-.1-.1-.8-1.1-.8-2.1 0-1 .5-1.5.7-1.7.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3.2.4.6 1.4.7 1.5.1.1.1.3 0 .4l-.3.4c-.1.1-.2.2-.1.4.2.3.7 1 1.4 1.6.9.8 1.7 1 2 1.1.2.1.4 0 .5-.1l.4-.5c.1-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4-.1.3-.3.7-.5.9z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13 2H3C2.4 2 2 2.4 2 3v10c0 .6.4 1 1 1h10c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1zm-1 2L8 7.5 4 4h8zM4 12V6.2l4 2.5 4-2.5V12H4z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1C5.2 1 3 3.2 3 6c0 3.8 5 9 5 9s5-5.2 5-9c0-2.8-2.2-5-5-5zm0 6.8A1.8 1.8 0 1 1 8 4.2a1.8 1.8 0 0 1 0 3.6z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 7.44V4.5a.75.75 0 0 0-1.5 0v4.25c0 .2.08.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06L8.75 8.44z" />
    </svg>
  );
}
