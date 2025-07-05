import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/builder(.*)"]);

const isCustomDomain = (hostname: string): boolean => {


    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "prensmedya.com";

    const hostingDomains = [
        "localhost",
        "localhost:3000",
        "127.0.0.1",
        appDomain,
        `www.${appDomain}` 
    ];

    const hostingProviders = [
        "vercel.app",
        "vercel.com",
        "netlify.app"
    ];



    // Exact match check first (most important)
    const isExactHostingDomain = hostingDomains.includes(hostname);

    // Subdomain check for hosting providers
    const isSubdomainOfHosting = hostingProviders.some(provider =>
        hostname.endsWith(`.${provider}`)
    );

    const isHostingDomain = isExactHostingDomain || isSubdomainOfHosting;



    // If it's a hosting domain, it's NOT a custom domain
    return !isHostingDomain;
};

// Helper function to normalize domain (remove www)
const normalizeDomain = (hostname: string): string => {
    return hostname.replace(/^www\./, '');
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
    try {
        const { hostname, pathname } = req.nextUrl;

        // Get real hostname from X-Forwarded-Host or Host header (for ngrok)
        const realHostname = req.headers.get('x-forwarded-host') ||
            req.headers.get('host') ||
            hostname;



        // Skip static files and API routes early
        if (
            pathname.includes(".") &&
            !pathname.includes("/api/") &&
            (pathname.includes("/_next/") || pathname.includes("/favicon.ico") || pathname.includes("/robots.txt") || pathname.includes("/sitemap.xml"))
        ) {

            return NextResponse.next();
        }

        // Handle custom domains using real hostname
        if (isCustomDomain(realHostname)) {


            // Normalize domain (remove www for consistent routing)
            const normalizedDomain = normalizeDomain(realHostname);



            // Her zaman normalize edilmiş domain ile rewrite yap
            // Custom domain page'de hem www'li hem www'siz kontrolü yapılacak
            const url = req.nextUrl.clone();
            url.pathname = `/custom-domain/${normalizedDomain}${pathname === "/" ? "" : pathname}`;

            // Orijinal hostname'i header olarak geç
            url.searchParams.set('original_host', realHostname);


            return NextResponse.rewrite(url);
        }


        // For main app domain, handle auth
        const { userId } = await auth();


        // Redirect unauthenticated users from protected routes
        if (isProtectedRoute(req) && !userId) {
            const signInUrl = new URL("/sign-in", req.url);
            return NextResponse.redirect(signInUrl);
        }

        // Handle root redirect for authenticated users
        if (pathname === "/" && userId) {
            const dashboardUrl = new URL("/admin/dashboard", req.url);
            return NextResponse.redirect(dashboardUrl);
        }

        return NextResponse.next();
    } catch (err) {
        console.error("❌ Middleware error:", err);

        // Safe fallback for custom domains
        const hostname = req.nextUrl.hostname;

        if (isCustomDomain(hostname)) {
            const url = req.nextUrl.clone();
            const normalizedDomain = normalizeDomain(hostname);
            url.pathname = `/custom-domain/${normalizedDomain}`;
            url.searchParams.set('original_host', hostname);
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