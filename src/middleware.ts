import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/builder(.*)"]);

// Function to check if hostname is a custom domain
const isCustomDomain = (hostname: string): boolean => {

  console.log("hostname", hostname);
  
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";
  
  console.log("appDomain", appDomain);

  // List of known hosting domains
  const hostingDomains = [
    appDomain,
    "localhost",
    "127.0.0.1",
    "vercel.app",
    "vercel.com"
  ];
  console.log("hostingDomains", hostingDomains);
  
  // Check if it's not a hosting domain and is a valid domain format
  const isNotHostingDomain = !hostingDomains.some(domain => 
    hostname === domain || hostname.endsWith(`.${domain}`)
  );
  console.log("isNotHostingDomain", isNotHostingDomain);
  
  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?)*$/;
  const isValidDomain = domainRegex.test(hostname);
  console.log("domainRegex", domainRegex);
  console.log("isValidDomain", isValidDomain);
  
  return isNotHostingDomain && isValidDomain;
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const { hostname, pathname } = req.nextUrl;
    
    console.log("Processing request:", { hostname, pathname });

    // Skip static files and API routes early
    if (
      pathname.includes(".") && 
      !pathname.includes("/api/") &&
      (pathname.includes("/_next/") || 
       pathname.includes("/favicon.ico") ||
       pathname.includes("/robots.txt") ||
       pathname.includes("/sitemap.xml"))
    ) {
      return NextResponse.next();
    }

    console.log("isCustomDomain", isCustomDomain(hostname));
    
    // Handle custom domains
    if (isCustomDomain(hostname)) {
      console.log("Custom domain detected:", hostname);
      
      // Rewrite to the site route with the domain as parameter
      const url = req.nextUrl.clone();
      url.pathname = `/site/${hostname}${pathname === "/" ? "" : pathname}`;
      url.hostname = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";
      
      console.log("Rewriting to:", url.pathname);
      return NextResponse.rewrite(url);
    }

    // For main app domain, handle auth
    const { userId } = await auth();

    console.log("Main app request:", { userId, pathname, isProtected: isProtectedRoute(req) });

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute(req) && !userId) {
      const signInUrl = new URL("/sign-in", req.url);
      console.log("Redirecting to sign-in from protected route");
      return NextResponse.redirect(signInUrl);
    }

    // Handle root redirect for authenticated users
    if (pathname === "/" && userId) {
      const dashboardUrl = new URL("/admin/dashboard", req.url);
      console.log("Redirecting authenticated user to dashboard");
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    console.error("Request details:", {
      url: req.nextUrl.href,
      hostname: req.nextUrl.hostname,
      pathname: req.nextUrl.pathname,
    });

    // Safe fallback for custom domains
    if (isCustomDomain(req.nextUrl.hostname)) {
      const url = req.nextUrl.clone();
      url.pathname = `/site/${req.nextUrl.hostname}`;
      url.hostname = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";
      return NextResponse.rewrite(url);
    }

    // Fallback for protected routes
    if (isProtectedRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};