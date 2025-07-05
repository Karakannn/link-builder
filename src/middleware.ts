import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/builder(.*)"]);

const isCustomDomain = (hostname: string): boolean => {
    console.log("🔍 Checking if custom domain:", hostname);

    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "prensmedya.com";
    console.log("🏠 App domain:", appDomain);

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

    console.log("📋 Hosting domains:", hostingDomains);
    console.log("🌐 Hosting providers:", hostingProviders);

    // Exact match check first (most important)
    const isExactHostingDomain = hostingDomains.includes(hostname);
    console.log("✅ Is exact hosting domain:", isExactHostingDomain);

    // Subdomain check for hosting providers
    const isSubdomainOfHosting = hostingProviders.some(provider =>
        hostname.endsWith(`.${provider}`)
    );
    console.log("🌐 Is subdomain of hosting:", isSubdomainOfHosting);

    const isHostingDomain = isExactHostingDomain || isSubdomainOfHosting;
    console.log("🏠 Is hosting domain:", isHostingDomain);

    // If it's a hosting domain, it's NOT a custom domain
    const result = !isHostingDomain;
    console.log("🎯 Final result - is custom domain:", result);
    return result;
};

// Helper function to normalize domain (remove www)
const normalizeDomain = (hostname: string): string => {
    const normalized = hostname.replace(/^www\./, '');
    console.log("🔄 Normalizing domain:", hostname, "->", normalized);
    return normalized;
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
    console.log("🚀 Middleware started");
    console.log("📍 Request URL:", req.url);
    console.log("🏠 Hostname:", req.nextUrl.hostname);
    console.log("🛣️ Pathname:", req.nextUrl.pathname);
    
    try {
        const { hostname, pathname } = req.nextUrl;

        // Get real hostname from X-Forwarded-Host or Host header (for ngrok)
        const realHostname = req.headers.get('x-forwarded-host') ||
            req.headers.get('host') ||
            hostname;

        console.log("🌐 Real hostname:", realHostname);
        console.log("📋 All headers:", Object.fromEntries(req.headers.entries()));

        // Skip static files and API routes early
        if (
            pathname.includes(".") &&
            !pathname.includes("/api/") &&
            (pathname.includes("/_next/") || pathname.includes("/favicon.ico") || pathname.includes("/robots.txt") || pathname.includes("/sitemap.xml"))
        ) {
            console.log("⏭️ Skipping static file:", pathname);
            return NextResponse.next();
        }

        // Handle custom domains using real hostname
        if (isCustomDomain(realHostname)) {
            console.log("🎯 Processing as custom domain:", realHostname);

            // Normalize domain (remove www for consistent routing)
            const normalizedDomain = normalizeDomain(realHostname);

            console.log("🔄 Normalized domain:", normalizedDomain);

            // Her zaman normalize edilmiş domain ile rewrite yap
            // Custom domain page'de hem www'li hem www'siz kontrolü yapılacak
            const url = req.nextUrl.clone();
            url.pathname = `/custom-domain/${normalizedDomain}${pathname === "/" ? "" : pathname}`;

            // Orijinal hostname'i header olarak geç
            url.searchParams.set('original_host', realHostname);

            console.log("🔄 Rewriting to:", url.pathname);
            console.log("📋 Search params:", Object.fromEntries(url.searchParams.entries()));

            return NextResponse.rewrite(url);
        }

        console.log("🏠 Processing as main app domain");

        // For main app domain, handle auth
        const { userId } = await auth();
        console.log("👤 User ID:", userId);

        // Redirect unauthenticated users from protected routes
        if (isProtectedRoute(req) && !userId) {
            console.log("🚫 Unauthenticated user trying to access protected route");
            const signInUrl = new URL("/sign-in", req.url);
            console.log("🔄 Redirecting to:", signInUrl.toString());
            return NextResponse.redirect(signInUrl);
        }

        // Handle root redirect for authenticated users
        if (pathname === "/" && userId) {
            console.log("🏠 Authenticated user on root, redirecting to dashboard");
            const dashboardUrl = new URL("/admin/dashboard", req.url);
            console.log("🔄 Redirecting to:", dashboardUrl.toString());
            return NextResponse.redirect(dashboardUrl);
        }

        console.log("✅ Proceeding with request");
        return NextResponse.next();
    } catch (err) {
        console.error("❌ Middleware error:", err);

        // Safe fallback for custom domains
        const hostname = req.nextUrl.hostname;
        console.log("🔄 Fallback - checking hostname:", hostname);

        if (isCustomDomain(hostname)) {
            console.log("🎯 Fallback - processing as custom domain");
            const url = req.nextUrl.clone();
            const normalizedDomain = normalizeDomain(hostname);
            url.pathname = `/custom-domain/${normalizedDomain}`;
            url.searchParams.set('original_host', hostname);
            console.log("🔄 Fallback rewrite to:", url.pathname);
            return NextResponse.rewrite(url);
        }

        // Fallback for protected routes
        if (isProtectedRoute(req)) {
            console.log("🚫 Fallback - redirecting to sign-in");
            const signInUrl = new URL("/sign-in", req.url);
            return NextResponse.redirect(signInUrl);
        }

        console.log("✅ Fallback - proceeding with request");
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