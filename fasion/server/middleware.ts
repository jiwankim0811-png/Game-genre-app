import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthorizedAdminEmail } from './lib/adminAuth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminEmail = request.cookies.get('genre_admin_email')?.value;

    if (!adminEmail || !isAuthorizedAdminEmail(decodeURIComponent(adminEmail))) {
      // Redirect to /admin/login with next param
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
