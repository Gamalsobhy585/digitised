import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
export default async function middleware(req: NextRequest) {
  const response = intlMiddleware(req);
  const token = req.cookies.get("token")?.value;
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "ar";  
  const url = req.nextUrl.clone();

  if (token  && (url.pathname === "/" || url.pathname === `/${locale}`)) {
    url.pathname = `/${locale}/`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
