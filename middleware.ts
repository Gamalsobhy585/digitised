import { NextResponse, NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  
  if (token && url.pathname === "/") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};