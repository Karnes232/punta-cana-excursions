import { ContactHero } from "@/components/ContactPage/ContactHero/ContactHero";
import { ContactInfo } from "@/components/ContactPage/ContactInfo/ContactInfo";
import { ContactForm } from "@/components/ContactPage/ContactForm/ContactForm";
import {
  getContactPage,
  getContactPageSeo,
} from "@/sanity/queries/ContactPage/ContactPage";
import { getGeneralLayout } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo] = await Promise.all([
    getContactPageSeo(),
    getDefaultSeo(),
  ]);
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, contactData, layout, pageSeo] = await Promise.all([
    params,
    getContactPage(),
    getGeneralLayout(),
    getContactPageSeo(),
  ]);
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const lk = locale as keyof LocalizedField;

  const isEs = locale === "es";

  const infoLabels = isEs
    ? {
        email: "Correo Electrónico",
        whatsapp: "WhatsApp",
        location: "Área de Servicio",
        responseTime: "Tiempo de Respuesta",
        emailUs: "Escríbenos a cualquier hora",
        chatOnWhatsApp: "Respuesta más rápida por WhatsApp",
      }
    : {
        email: "Email",
        whatsapp: "WhatsApp",
        location: "Service Area",
        responseTime: "Response Time",
        emailUs: "Write to us anytime",
        chatOnWhatsApp: "Fastest response via WhatsApp",
      };

  const formLabels = isEs
    ? {
        name: "Nombre completo",
        email: "Correo electrónico",
        phone: "Teléfono (opcional)",
        hotel: "Hotel (opcional)",
        excursion: "Excursión de interés (opcional)",
        message: "Mensaje",
        submit: "Enviar por WhatsApp",
        submitting: "Preparando...",
        successTitle: "¡Mensaje listo!",
        successMessage:
          "Se ha abierto WhatsApp con su mensaje. Haga clic en Enviar para contactarnos directamente.",
        whatsappFallback:
          "Si WhatsApp no se abrió automáticamente, puede escribirnos directamente.",
        required: "Este campo es requerido",
        namePlaceholder: "Juan García",
        emailPlaceholder: "juan@ejemplo.com",
        phonePlaceholder: "+1 (809) 000-0000",
        hotelPlaceholder: "Ej: Barceló Bávaro Palace...",
        excursionPlaceholder: "Ej: Excursión en catamarán, snorkel...",
        messagePlaceholder: "Cuéntenos sobre su grupo, fechas y cualquier pregunta...",
      }
    : {
        name: "Full name",
        email: "Email address",
        phone: "Phone (optional)",
        hotel: "Hotel (optional)",
        excursion: "Excursion of interest (optional)",
        message: "Message",
        submit: "Send via WhatsApp",
        submitting: "Preparing...",
        successTitle: "Message ready!",
        successMessage:
          "WhatsApp has opened with your message. Click Send to contact us directly.",
        whatsappFallback:
          "If WhatsApp didn't open automatically, you can write to us directly.",
        required: "This field is required",
        namePlaceholder: "John Smith",
        emailPlaceholder: "john@example.com",
        phonePlaceholder: "+1 (809) 000-0000",
        hotelPlaceholder: "e.g. Barceló Bávaro Palace...",
        excursionPlaceholder: "e.g. Catamaran trip, snorkeling...",
        messagePlaceholder: "Tell us about your group, dates, and any questions...",
      };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />
      <ContactHero
        headline={contactData?.heroHeadline?.[lk] ?? (isEs ? "Contáctenos" : "Get in Touch")}
        subheadline={contactData?.heroSubheadline?.[lk] ?? ""}
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Info column */}
          <div className="lg:col-span-2">
            <ContactInfo
              headline={
                contactData?.infoHeadline?.[lk] ??
                (isEs ? "Información de Contacto" : "Contact Information")
              }
              email={layout?.email ?? ""}
              phone={layout?.phone ?? ""}
              serviceArea={layout?.serviceArea?.[lk] ?? ""}
              responseTime={layout?.responseTime?.[lk] ?? ""}
              labels={infoLabels}
            />
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <ContactForm
              headline={
                contactData?.formHeadline?.[lk] ??
                (isEs ? "Envíenos un Mensaje" : "Send Us a Message")
              }
              phone={layout?.phone ?? ""}
              labels={formLabels}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
