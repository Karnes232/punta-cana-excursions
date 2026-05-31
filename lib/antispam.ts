// A human cannot realistically complete a multi-field form faster than this.
const MIN_FILL_MS = 1500;

/**
 * Heuristic spam check layered on top of Vercel BotID. Returns true when a
 * submission looks automated — either the hidden honeypot field was filled
 * (real users never see it) or the form was submitted implausibly fast.
 */
export function looksLikeSpam(input: {
  honeypot?: unknown;
  elapsedMs?: unknown;
}): boolean {
  if (typeof input.honeypot === "string" && input.honeypot.trim().length > 0)
    return true;
  if (typeof input.elapsedMs === "number" && input.elapsedMs < MIN_FILL_MS)
    return true;
  return false;
}
