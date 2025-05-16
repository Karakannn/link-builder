import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/builder(.*)'])

export default clerkMiddleware(async (auth, req) => {

  const session = await auth()
  const { userId } = session

 

  if (!userId && isProtectedRoute(req)) {
    const customSignInUrl = new URL('/sign-in', req.url)
/*     customSignInUrl.searchParams.set('redirect_url', req.url)
    customSignInUrl.searchParams.set('source', 'protected-route') */
    return NextResponse.redirect(customSignInUrl)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}