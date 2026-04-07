import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { NavLink } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import BookNowButton from "./BookNowButton";
import { NavCtaButtonType } from "./Navbar";

interface MobileMenuProps {
  open: boolean;
  activeHref: string;
  onClose: () => void;
  navLinks: NavLink[];
  locale: "en" | "es";
  navCtaButton: NavCtaButtonType;
}
export default function MobileMenu({
  open,
  activeHref,
  onClose,
  navLinks,
  locale,
  navCtaButton,
}: MobileMenuProps) {
  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <nav className="border-t border-gray-100 bg-white">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center justify-between px-5 py-3.5 text-[14px] font-semibold border-b border-gray-50 transition-colors duration-100 ${
              activeHref === item.href
                ? "text-[#005F86] bg-[#E8F4F9]"
                : "text-[#1F2937] hover:text-[#005F86] hover:bg-gray-50"
            }`}
          >
            {/* Replace with t(item.label) when next-intl is wired */}
            {item.label[locale]?.toUpperCase()}
            <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
              <path
                d="M1 1l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        ))}

        {/* Mobile menu footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 bg-[#F7F7F5]">
          <LanguageSwitcher />
          {/* <WhatsAppButton className="flex-1 justify-center" /> */}
          <BookNowButton
            className="flex-1 text-center"
            label={navCtaButton?.label[locale] as string}
            href={navCtaButton.href}
          />
        </div>
      </nav>
    </div>
  );
}
