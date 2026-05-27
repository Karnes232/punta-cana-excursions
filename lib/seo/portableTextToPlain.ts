import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

/**
 * Flatten Portable Text into plain text for non-HTML outputs (e.g. llms-full.txt).
 * Joins the span text within each block; separates blocks with blank lines.
 * Non-text blocks (images, embeds) are skipped.
 */
export function portableTextToPlain(
  blocks?: PortableTextBlock[] | null,
): string {
  if (!blocks?.length) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children
        .map((child) =>
          child._type === "span" &&
          typeof (child as PortableTextSpan).text === "string"
            ? (child as PortableTextSpan).text
            : "",
        )
        .join("");
    })
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
}
