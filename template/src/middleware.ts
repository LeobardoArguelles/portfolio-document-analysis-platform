import { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { i18n } from "./i18n-config";

// Get the preferred locale
function getLocale(request: NextRequest): string {
  // Check if there's a cookie with preferred locale
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Get accepted languages from headers
  const acceptedLanguages = request.headers.get("accept-language");
  let languages = acceptedLanguages?.split(",")
    .map(lang => lang.split(";")[0])
    .map(lang => lang.trim()) || [];

  // If no accepted languages, use default locale
  if (languages.length === 0) {
    return i18n.defaultLocale;
  }

  // Match the locale using intl-localematcher
  try {
    return matchLocale(
      languages,
      i18n.locales,
      i18n.defaultLocale
    );
  } catch (error) {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Skip middleware for specific files and paths
  const shouldSkip = [
    '/favicon.ico',
    '/api/',
    '/_next/',
    '/images/',
    '/service-worker.js',
    '/manifest.json',
    '/robots.txt'
  ].some(path => pathname.startsWith(path));

  if (shouldSkip) return;

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return Response.redirect(
      new URL(`/${locale}${pathname}`, request.url)
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
