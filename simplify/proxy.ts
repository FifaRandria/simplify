import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/app/auth'

const protectedRoutes = ['/agent', '/medecin-chef']
const publicRoutes = ['/', '/auth/connexion']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const session = await auth()

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  )
  const isPublic = publicRoutes.some((route) => path === route)

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/connexion', request.url))
  }

  if (session && path === '/auth/connexion') {
    if (session.user?.role === 'MEDECIN_CHEF') {
      return NextResponse.redirect(new URL('/medecin-chef/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/agent/dashboard', request.url))
  }

  if (session && isProtected) {
    const role = session.user?.role
    if (path.startsWith('/agent') && role !== 'AGENT') {
      return NextResponse.redirect(new URL('/medecin-chef/dashboard', request.url))
    }
    if (path.startsWith('/medecin-chef') && role !== 'MEDECIN_CHEF') {
      return NextResponse.redirect(new URL('/agent/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
}
