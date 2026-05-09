import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Montserrat, Inter } from "next/font/google";
import "../../globals.css";
import Navbar, { NavCtaButtonType } from "@/components/Layout/Navbar/Navbar";
import {
  FooterQuickLink,
  getGeneralLayout,
  getLocalized,
  LocalizedField,
  NavLink,
  SocialLink,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { Logo as LogoType } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { SITE_URL } from "@/lib/seo/constants";
import Footer from "@/components/Layout/Footer/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const result = await getDefaultSeo();
  const defaults = result?.defaultSeo;
  const siteName =
    getLocalized(result?.companyName ?? null, locale) ||
    "Punta Cana Excursions";
  const defaultTitle =
    getLocalized(defaults?.metaTitle, locale) || siteName;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: defaultTitle, template: `%s | ${siteName}` },
    description: getLocalized(defaults?.metaDescription, locale) || undefined,
  };
}

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const [generalLayout] = await Promise.all([getGeneralLayout()]);

  return (
    <html lang={locale} className={`${montserrat.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className={`antialiased`}>
        <NextIntlClientProvider>
          <Navbar
            locale={locale as "en" | "es"}
            logo={generalLayout?.logo as LogoType}
            navLinks={generalLayout?.navLinks as NavLink[]}
            navCtaButton={generalLayout?.navCtaButton as NavCtaButtonType}
          />
          {children}
          <Footer
            locale={locale as "en" | "es"}
            companyName={
              generalLayout?.companyName[locale as keyof LocalizedField] || ""
            }
            logo={generalLayout?.logoAlt as LogoType}
            tagline={
              generalLayout?.tagline[locale as keyof LocalizedField] || ""
            }
            footerDescription={
              generalLayout?.footerDescription[
                locale as keyof LocalizedField
              ] || ""
            }
            socialLinks={(generalLayout?.socialLinks as SocialLink[]) || []}
            footerQuickLinks={
              (generalLayout?.footerQuickLinks as FooterQuickLink[]) || []
            }
            email={generalLayout?.email || ""}
            phone={generalLayout?.phone || ""}
            serviceArea={
              generalLayout?.serviceArea[locale as keyof LocalizedField] || ""
            }
            responseTime={
              generalLayout?.responseTime[locale as keyof LocalizedField] || ""
            }
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
