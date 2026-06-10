import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// The extra blog locales (fr/de/pt/it) only serve individual blog articles and
// the blog index. Every OTHER path under those prefixes only exists in en/es,
// so redirect it to the en equivalent (en is prefix-less) instead of 404ing —
// this turns the locale-aware chrome/content links that resolve to a foreign
// locale into clean 308s to a live page.
const BLOG_ONLY_LOCALES = ["fr", "de", "pt", "it"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const seg = pathname.split("/")[1];

  if (BLOG_ONLY_LOCALES.includes(seg)) {
    const rest = pathname.slice(seg.length + 1); // strip "/fr" -> "/about" | "" | "/blog/x"
    const isBlogRoute = rest === "/blog" || /^\/blog\/[^/]+$/.test(rest);
    if (!isBlogRoute) {
      const url = request.nextUrl.clone();
      url.pathname = rest || "/";
      return NextResponse.redirect(url, 308);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|es|fr|de|pt|it)/:path*",
    "/((?!api|trpc|_next|_vercel|studio|.*\\..*).*)",
  ],
};
