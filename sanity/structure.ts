import type { StructureResolver } from "sanity/structure";
import { CogIcon, HomeIcon } from "@sanity/icons";
const apiVersion = "v2025-02-19";
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(() => "⚙️")
        .child(
          S.list()
            .title("Site settings")
            .items([
              S.listItem()
                .title("General layout")
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType("generalLayout")
                    .title("General layout"),
                ),
              // S.listItem()
              //   .title("Legal documents")
              //   .child(
              //     S.documentList()
              //       .title("Legal documents")
              //       .filter("_type == 'legalDocuments'"),
              //   ),
            ]),
        ),

      S.divider(),
      S.listItem()
        .title("Home page")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Home page"),
        ),
      S.divider(),
      S.listItem()
        .title("Excursions page")
        .icon(() => "📝")
        .child(
          S.document()
            .schemaType("excursionsPage")
            .documentId("excursionsPage")
            .title("Excursions page"),
        ),
      S.divider(),
      S.listItem()
        .title("Excursion category")
        .icon(() => "📝")
        .child(
          S.documentList()
            .title("Excursion categories")
            .apiVersion(apiVersion)
            .filter("_type == 'excursionCategory'")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Excursion")
        .icon(() => "🧭")
        .child(
          S.documentList()
            .title("Excursions")
            .apiVersion(apiVersion)
            .filter("_type == 'excursion'")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Scuba Diving page")
        .icon(() => "🧭")
        .child(
          S.document()
            .schemaType("divingSnorkelingPage")
            .documentId("divingSnorkelingPage")
            .title("Scuba Diving page"),
        ),
      S.divider(),
      S.listItem()
        .title("Scuba Diving Excursions")
        .icon(() => "🤿")
        .child(
          S.documentList()
            .title("Scuba Diving Excursions")
            .apiVersion(apiVersion)
            .filter("_type == 'divingExcursion'")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Blog")
        .icon(() => "📰")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.listItem()
                .title("Blog page")
                .child(
                  S.document()
                    .schemaType("blogPage")
                    .documentId("blogPage")
                    .title("Blog page"),
                ),
              S.listItem()
                .title("Blog categories")
                .child(
                  S.documentList()
                    .title("Blog categories")
                    .apiVersion(apiVersion)
                    .filter("_type == 'blogCategory'")
                    .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
                ),
              S.listItem()
                .title("Blog articles")
                .child(
                  S.documentList()
                    .title("Blog articles")
                    .apiVersion(apiVersion)
                    .filter("_type == 'blogArticle'")
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("FAQ page")
        .icon(() => "❓")
        .child(
          S.document()
            .schemaType("faqPage")
            .documentId("faqPage")
            .title("FAQ page"),
        ),
      S.divider(),
      S.listItem()
        .title("Contact page")
        .icon(() => "✉️")
        .child(
          S.document()
            .schemaType("contactPage")
            .documentId("contactPage")
            .title("Contact page"),
        ),
      S.divider(),
      S.listItem()
        .title("About page")
        .icon(() => "👋")
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId("aboutPage")
            .title("About page"),
        ),
      S.divider(),
      S.listItem()
        .title("Legal documents")
        .icon(() => "📄")
        .child(
          S.list()
            .title("Legal documents")
            .items([
              S.listItem()
                .title("Privacy Policy")
                .child(
                  S.document()
                    .schemaType("legalDocument")
                    .documentId("privacy-policy")
                    .title("Privacy Policy"),
                ),
              S.listItem()
                .title("Terms of Service")
                .child(
                  S.document()
                    .schemaType("legalDocument")
                    .documentId("terms-of-service")
                    .title("Terms of Service"),
                ),
              S.listItem()
                .title("Cancellation Policy")
                .child(
                  S.document()
                    .schemaType("legalDocument")
                    .documentId("cancellation-policy")
                    .title("Cancellation Policy"),
                ),
            ]),
        ),
    ]);
