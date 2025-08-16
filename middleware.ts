// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to auth pages for unauthenticated users
    if (pathname.startsWith('/auth/')) {
      // Redirect to home if already authenticated
      if (token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      
      // Check if user is verified for sensitive routes
      if (pathname.startsWith('/dashboard/admin')) {
        if (!token.isverified) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname === '/' || pathname.startsWith('/public')) {
          return true;
        }
        
        // Allow access to auth pages
        if (pathname.startsWith('/auth/')) {
          return true;
        }
        
        // Require authentication for protected routes
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};