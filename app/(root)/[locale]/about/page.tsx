import { AboutCTA } from "@/components/AboutPage/AboutCTA/AboutCTA";
import { AboutHero } from "@/components/AboutPage/AboutHero/AboutHero";
import { ByTheNumbers } from "@/components/AboutPage/ByTheNumbers/ByTheNumbers";
import { OurStory } from "@/components/AboutPage/OurStory/OurStory";
import { OurTeam } from "@/components/AboutPage/OurTeam/OurTeam";
import { OurValues } from "@/components/AboutPage/OurValues/OurValues";
import { getAboutPage } from "@/sanity/queries/AboutPage/AboutPage";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page] = await Promise.all([params, getAboutPage()]);

  const lk = locale as keyof LocalizedField;

  return (
    <>
      <AboutHero
        backgroundImage={page?.heroImage ?? null}
        badge={page?.heroBadge?.[lk] ?? ""}
        headline={page?.heroHeadline?.[lk] ?? ""}
        subheadline={page?.heroSubheadline?.[lk] ?? ""}
      />

      <OurStory
        tagline={page?.storyTagline?.[lk] ?? ""}
        headline={page?.storyHeadline?.[lk] ?? ""}
        body={page?.storyBody?.[lk] ?? ""}
        image={page?.storyImage ?? null}
        foundedYear={page?.foundedYear ?? 0}
      />

      <ByTheNumbers
        headline={page?.statsHeadline?.[lk] ?? ""}
        stats={
          page?.stats?.map((s) => ({
            value: s.value?.[lk] ?? "",
            label: s.label?.[lk] ?? "",
          })) ?? []
        }
      />

      <OurValues
        headline={page?.valuesHeadline?.[lk] ?? ""}
        subheading={page?.valuesSubheading?.[lk] ?? ""}
        values={
          page?.values?.map((v) => ({
            icon: v.icon,
            title: v.title?.[lk] ?? "",
            description: v.description?.[lk] ?? "",
          })) ?? []
        }
      />

      <OurTeam
        headline={page?.teamHeadline?.[lk] ?? ""}
        subheading={page?.teamSubheading?.[lk] ?? ""}
        members={
          page?.teamMembers?.map((m) => ({
            name: m.name,
            role: m.role?.[lk] ?? "",
            bio: m.bio?.[lk] ?? "",
            photo: m.photo ?? null,
          })) ?? []
        }
      />

      <AboutCTA
        headline={page?.ctaHeadline?.[lk] ?? ""}
        subheadline={page?.ctaSubheadline?.[lk] ?? ""}
        whatsappButtonText={page?.ctaButtonText?.[lk] ?? ""}
        whatsappNumber={page?.ctaWhatsappNumber ?? ""}
        contactButtonText={page?.ctaContactText?.[lk] ?? ""}
      />
    </>
  );
}
