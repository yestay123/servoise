import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Since we're using localStorage (client-side only), we can't check tokens in middleware
  // The client-side auth context will handle redirects instead
  // This middleware only handles basic route protection for public routes
  
  // Public routes that don't require authentication
  const publicRoutes = ["/sign-in", "/sign-up", "/callback"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow all routes - client-side will handle auth redirects
  // This prevents infinite redirect loops
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
