import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define route matchers
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/courses(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
])

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/my-courses(.*)',
  '/profile(.*)',
  '/notifications(.*)',
  '/admin(.*)'
])

export default clerkMiddleware((auth, req) => {
  // Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Protect routes
  if (isProtectedRoute(req)) {
    auth.protect();
  }

  return response
})

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