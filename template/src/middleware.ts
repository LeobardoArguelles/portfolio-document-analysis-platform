import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";

var Negotiator = require("negotiator");

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = [...i18n.locales];
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Handle root path
  if (pathname === "/") {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
