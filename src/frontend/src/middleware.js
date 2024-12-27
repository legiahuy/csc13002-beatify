// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token');
  //const token = tokenObject ? tokenObject.value : null;

  // Define paths to protect with logged-in and verified checks
  const protectedPaths = ['/admin', '/curator', '/profile'];
  const needsVerification = protectedPaths.some(path => pathname.startsWith(path));

  if (needsVerification) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    //try {
    //  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
     // const { payload } = await jwtVerify(token, secret);

    //} catch (error) {
    //  console.log("JWT verification error:", error);
    //  return NextResponse.redirect(new URL('/login', req.url));
    //}
  }

  return NextResponse.next();
}
