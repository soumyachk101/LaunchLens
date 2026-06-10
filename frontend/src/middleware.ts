import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('launchlens_user');
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isProtectedPath = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/diagnosis') || 
    pathname.startsWith('/sessions') || 
    pathname.startsWith('/projects') || 
    pathname.startsWith('/settings');

  // If unauthorized and visiting protected routes, redirect to login
  if (isProtectedPath && !userCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authorized and visiting login, redirect to dashboard
  if (pathname === '/login' && userCookie) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Map the matcher pattern precisely
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/diagnosis/:path*',
    '/sessions/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/login',
  ],
};
