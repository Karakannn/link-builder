import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/builder(.*)"]);

// Function to check if hostname is a custom domain
const isCustomDomain = (hostname: string): boolean => {
    console.log("🔍 Checking hostname:", hostname);

    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-one.vercel.app";

    // List of known hosting domains
    const hostingDomains = [
        appDomain, // Bu en önemli - environment variable'dan gelir
        "localhost",
        "localhost:3000",
        // "localhost:3001", // Bu satırı kaldırdım - artık custom domain olarak algılanacak
        "127.0.0.1",
        "linkbuilder.com", // Eğer production domain'iniz varsa
    ];

    // Separate check for hosting providers (these should NOT be treated as custom domains)
    const hostingProviders = [
        "vercel.app",
        "vercel.com", 
        "netlify.app"
        // ngrok.app, ngrok.io, ngrok-free.app deliberately EXCLUDED
        // so ngrok URLs are treated as custom domains for testing
    ];

    console.log("🏠 App domain:", appDomain);
    console.log("🏠 Hosting domains:", hostingDomains);

    // Exact match check first (most important)
    const isExactHostingDomain = hostingDomains.includes(hostname);
    
    // Subdomain check for hosting providers
    const isSubdomainOfHosting = hostingProviders.some(provider => 
        hostname.endsWith(`.${provider}`)
    );

    const isHostingDomain = isExactHostingDomain || isSubdomainOfHosting;

    console.log("✅ Domain analysis:", {
        hostname,
        isExactHostingDomain,
        isSubdomainOfHosting,
        isHostingDomain,
        isCustomDomain: !isHostingDomain
    });

    // If it's a hosting domain, it's NOT a custom domain
    return !isHostingDomain;
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
    try {
        const { hostname, pathname } = req.nextUrl;
        
        // Get real hostname from X-Forwarded-Host or Host header (for ngrok)
        const realHostname = req.headers.get('x-forwarded-host') || 
                           req.headers.get('host') || 
                           hostname;

        console.log("🚀 Processing request:", { 
            hostname, 
            realHostname, 
            pathname,
            appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN,
            headers: {
                'x-forwarded-host': req.headers.get('x-forwarded-host'),
                'host': req.headers.get('host')
            }
        });

        // Skip static files and API routes early
        if (
            pathname.includes(".") &&
            !pathname.includes("/api/") &&
            (pathname.includes("/_next/") || pathname.includes("/favicon.ico") || pathname.includes("/robots.txt") || pathname.includes("/sitemap.xml"))
        ) {
            console.log("⏭️  Skipping static file:", pathname);
            return NextResponse.next();
        }

        // Handle custom domains using real hostname
        if (isCustomDomain(realHostname)) {
            console.log("🌐 Custom domain detected:", realHostname);

            // Rewrite to the custom domain route
            const url = req.nextUrl.clone();
            url.pathname = `/custom-domain/${realHostname}${pathname === "/" ? "" : pathname}`;
            // Don't change hostname, keep original request host
            
            console.log("🔄 Rewriting to:", url.pathname);
            return NextResponse.rewrite(url);
        }

        console.log("🏠 Main app domain request - proceeding with auth");

        // For main app domain, handle auth
        const { userId } = await auth();

        console.log("👤 Auth check:", { userId, pathname, isProtected: isProtectedRoute(req) });

        // Redirect unauthenticated users from protected routes
        if (isProtectedRoute(req) && !userId) {
            const signInUrl = new URL("/sign-in", req.url);
            console.log("🔐 Redirecting to sign-in from protected route");
            return NextResponse.redirect(signInUrl);
        }

        // Handle root redirect for authenticated users
        if (pathname === "/" && userId) {
            const dashboardUrl = new URL("/admin/dashboard", req.url);
            console.log("📊 Redirecting authenticated user to dashboard");
            return NextResponse.redirect(dashboardUrl);
        }

        console.log("✅ Proceeding normally");
        return NextResponse.next();
    } catch (err) {
        console.error("❌ Middleware error:", err);
        console.error("Request details:", {
            url: req.nextUrl.href,
            hostname: req.nextUrl.hostname,
            pathname: req.nextUrl.pathname,
        });

        // Safe fallback for custom domains
        const hostname = req.nextUrl.hostname;
        const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-one.vercel.app";
        
        if (isCustomDomain(hostname)) {
            const url = req.nextUrl.clone();
            url.pathname = `/custom-domain/${hostname}`;
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
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};