"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import {
  LocalizedField,
  Logo as LogoType,
  NavLink,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import LanguageSwitcher from "./LanguageSwitcher";
import BookNowButton from "./BookNowButton";
import HamburgerIcon from "./HamburgerIcon";
import MobileMenu from "./MobileMenu";

export interface NavCtaButtonType {
  label: LocalizedField;
  href: string;
}

export default function Navbar({
  locale,
  logo,
  navLinks,
  navCtaButton,
}: {
  locale: "en" | "es";
  logo: LogoType;
  navLinks: NavLink[];
  navCtaButton: NavCtaButtonType;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("/");

  // Detect scroll for shadow elevation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* Ocean Blue top accent bar */}
      <div className="h-1.5 w-full bg-[#005F86]" />

      {/* Main navbar row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b-2 border-[#005F86]">
          {/* Left: Logo */}
          <Logo width={60} height={60} logo={logo} />

          {/* Center: Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5 mx-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveHref(item.href)}
                className={`text-[13px] font-semibold px-3 py-2 rounded-md transition-colors duration-150 whitespace-nowrap ${
                  activeHref === item.href
                    ? "text-[#005F86] bg-[#E8F4F9] font-bold"
                    : "text-[#1F2937] hover:text-[#005F86] hover:bg-[#E8F4F9]"
                }`}
              >
                {/* Replace with t(item.label) when next-intl is wired */}
                {item.label[locale]?.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Right: Actions (desktop) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            {/* <WhatsAppButton /> */}
            <BookNowButton
              label={navCtaButton?.label[locale] as string}
              href={navCtaButton?.href}
            />
          </div>

          {/* Right: Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <BookNowButton
              className="text-[12px] px-4 py-2"
              label={navCtaButton?.label[locale] as string}
              href={navCtaButton.href}
            />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="p-2"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <MobileMenu
        navLinks={navLinks}
        open={menuOpen}
        activeHref={activeHref}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        navCtaButton={navCtaButton as NavCtaButtonType}
      />
    </header>
  );
}
