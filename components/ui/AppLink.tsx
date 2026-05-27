import type { ComponentProps } from "react";
import { Link, isExternalHref, parseInternalHref } from "@/i18n/navigation";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** A plain href string — internal canonical path (e.g. "/excursions") or external URL. */
  href: string;
  /** Force a plain <a> (e.g. for CMS-provided absolute URLs). */
  external?: boolean;
};

/**
 * Renders the right link for a plain string href. Internal paths go through the
 * locale-aware <Link> (so segments get localized, e.g. /about -> /es/sobre-nosotros);
 * external/absolute/anchor hrefs render a plain <a>. Use this for hrefs sourced
 * from Sanity or other data, where the value is a string rather than a typed route.
 */
export function AppLink({ href, external, ...rest }: AppLinkProps) {
  if (external || isExternalHref(href)) {
    // Drop next-intl-only props that aren't valid DOM attributes.
    const { locale: _locale, prefetch: _prefetch, ...anchorProps } = rest as Record<
      string,
      unknown
    >;
    void _locale;
    void _prefetch;
    return <a href={href} {...(anchorProps as ComponentProps<"a">)} />;
  }
  return <Link href={parseInternalHref(href)} {...rest} />;
}
