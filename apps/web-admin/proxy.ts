import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTE_PATHS, AUTH_ROUTES } from '@cbc/config/routes';

const PUBLIC_ROUTES = [...PUBLIC_ROUTE_PATHS, ...Object.values(AUTH_ROUTES)];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route)
    )
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('sanctum_token')?.value;

  if (!token) {
    const loginUrl = new URL(AUTH_ROUTES.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
