import { NextResponse, NextRequest } from "next/server"; 
import createMiddleware from "next-intl/middleware"; 
import { routing } from "./src/i18n/routing";  

// Create the middleware with full configuration object
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  // Add any other config options needed
});

export default function middleware(req: NextRequest) {
  // Remove async since intlMiddleware doesn't return a Promise
  const token = req.cookies.get("token")?.value;
  const locale = req.cookies.get("NEXT_LOCALE")?.value || routing.defaultLocale;
  const url = req.nextUrl.clone();
  
  // Handle redirects for authenticated users
  if (token && (url.pathname === "/" || url.pathname === `/${locale}`)) {
    url.pathname = `/${locale}/`;
    return NextResponse.redirect(url);
  }
  
  // Let the intl middleware handle everything else
  return intlMiddleware(req);
}

export const config = {
  // Match all paths except static files, api routes, etc.
  matcher: ['/((?!api|_next|.*\\..*).*)']
};