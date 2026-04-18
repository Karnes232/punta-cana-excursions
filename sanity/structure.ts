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
        .title("Diving & Snorkeling page")
        .icon(() => "🧭")
        .child(
          S.document()
            .schemaType("divingSnorkelingPage")
            .documentId("divingSnorkelingPage")
            .title("Diving & Snorkeling page"),
        ),
    ]);
