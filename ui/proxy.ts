import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken, getUserRole } from './utils/auth';

/*
export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');

  const url = req.nextUrl.pathname;

  // Public routes → always allow
  if (url.startsWith('/login') || url.startsWith('/signup') || url.startsWith('/public')) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = decodeToken(token);
  const role = getUserRole(decoded);

  // Customer protected routes
  if (url.startsWith('/customer') && role !== 'Customer') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Seller protected routes
  if (url.startsWith('/seller') && role !== 'Seller') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Admin protected routes
  if (url.startsWith('/(admin)') && role !== 'Admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(customer)/:path*',
    '/(seller)/:path*',
    '/(admin)/:path*'
  ],
};
*/

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/customer': ['Customer'],
  '/seller': ['Seller'],
  '/admin': ['Admin'],
};

const publicRoutes = ['/login', '/signup', '/', '/categories', '/customer/products'];
const authRoutes = ['/login', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists and trying to access auth route, redirect to home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
