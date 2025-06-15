import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

// Configure le middleware pour qu'il s'exécute uniquement sur le chemin racine
export const config = {
  matcher: '/',
};
