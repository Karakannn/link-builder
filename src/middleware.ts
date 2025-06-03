import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/builder(.*)'])

export default clerkMiddleware(async (auth, req) => {
  try {
    const session = await auth()
    const { userId } = session || {}

    console.log("userId", userId)
    console.log("isProtectedRoute(req)", isProtectedRoute(req))

    if (!userId && isProtectedRoute(req)) {
      const customSignInUrl = new URL('/sign-in', req.url)
      // customSignInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(customSignInUrl)
    }

    return NextResponse.next()
  } catch (err) {
    console.error("Middleware error:", err)
    return NextResponse.next() 
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
