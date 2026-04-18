export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-04-04";

/** Required for Studio + Content Lake; empty strings break WebSockets (wss://.api.sanity.io). */
export const dataset = assertEnv(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertEnv(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

function assertEnv(v: string | undefined, name: string): string {
  if (v === undefined || v.trim() === "") {
    throw new Error(
      `Missing or empty environment variable: ${name}. Sanity Studio needs a real project ID and dataset or it stays on "Trying to connect…".`,
    );
  }
  return v.trim();
}
