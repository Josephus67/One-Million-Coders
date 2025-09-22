import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/courses/:path*",
  "/my-courses",
  "/profile",
  "/settings",
  "/notifications",
  "/api/notifications/:path*",
  "/api/enrollments/:path*",
];

// Define admin routes
const adminRoutes = [
  "/admin/:path*",
];

// Define public routes (accessible without authentication)
const publicRoutes = [
  "/",
  "/auth/:path*",
  "/api/auth/:path*",
  "/api/courses",
  "/api/courses/:path*",
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to public routes
    if (publicRoutes.some(route => {
      const pattern = route.replace(":path*", ".*");
      return new RegExp(`^${pattern}$`).test(pathname);
    })) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (adminRoutes.some(route => {
      const pattern = route.replace(":path*", ".*");
      return new RegExp(`^${pattern}$`).test(pathname);
    })) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Allow access to protected routes for authenticated users
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow access to public routes
        if (publicRoutes.some(route => {
          const pattern = route.replace(":path*", ".*");
          return new RegExp(`^${pattern}$`).test(pathname);
        })) {
          return true;
        }

        // For protected routes, check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};