// middleware.ts (Corrected)
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export const middleware = (request: NextRequest): NextResponse => {
    const { pathname } = request.nextUrl;
    const tokenCookie = request.cookies.get("token")?.value;
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    if (isPublicRoute) {
        return NextResponse.next();
    }
    if (!tokenCookie) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
};

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/login", "/register", "/forgot-password"],
};