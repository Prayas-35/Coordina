import { NextResponse } from "next/server";

export function middleware(req) {

    const token = req.cookies.get("token")?.value;

    if (req.nextUrl.pathname === "/") {
        if (token) {
            return NextResponse.redirect(new URL('/home', req.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ['/', '/dashboard', '/resources', '/discussion', '/conflicts', '/home']
};