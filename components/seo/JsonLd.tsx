interface JsonLdProps {
  data: string | null | undefined;
}

/**
 * Renders a schema.org JSON-LD <script> tag.
 * Returns null when the data is missing or invalid JSON.
 * The Sanity schema validates JSON at edit-time, but we re-validate here
 * to avoid emitting broken markup if data was bypassed.
 */
export function JsonLd({ data }: JsonLdProps) {
  if (!data || typeof data !== "string" || data.trim() === "") return null;

  try {
    JSON.parse(data);
  } catch {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}
