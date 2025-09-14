import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/quizzes',
    '/leaderboard',
    '/results'
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '/')
  );

  // Allow public routes and Next.js internal routes
  if (isPublicRoute || request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  // This is a simple check - in a real app you might want to verify JWT tokens
  const userCookie = request.cookies.get('quiz_user');
  
  if (!userCookie) {
    // Redirect to sign-in if not authenticated
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
