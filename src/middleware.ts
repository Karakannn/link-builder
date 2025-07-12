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

    const isExactHostingDomain = hostingDomains.includes(hostname);
    const isSubdomainOfHosting = hostingProviders.some(provider =>
        hostname.endsWith(`.${provider}`)
    );

    const isHostingDomain = isExactHostingDomain || isSubdomainOfHosting;
    const result = !isHostingDomain;
    return result;
};

const normalizeDomain = (hostname: string): string => {
    const normalized = hostname.replace(/^www\./, '');
    return normalized;
};

export default clerkMiddleware(async (auth, req: NextRequest) => {

    try {
        const { hostname, pathname } = req.nextUrl;

        const realHostname = req.headers.get('x-forwarded-host') ||
            req.headers.get('host') ||
            hostname;

        if (
            pathname.includes(".") &&
            !pathname.includes("/api/") &&
            (pathname.includes("/_next/") || pathname.includes("/favicon.ico") || pathname.includes("/robots.txt") || pathname.includes("/sitemap.xml"))
        ) {
            return NextResponse.next();
        }

        if (isCustomDomain(realHostname)) {

            const normalizedDomain = normalizeDomain(realHostname);
            const url = req.nextUrl.clone();
            url.pathname = `/custom-domain/${normalizedDomain}${pathname === "/" ? "" : pathname}`;
            url.searchParams.set('original_host', realHostname);

            return NextResponse.rewrite(url);
        }

        const { userId } = await auth();

        if (isProtectedRoute(req) && !userId) {
            const signInUrl = new URL("/sign-in", req.url);
            return NextResponse.redirect(signInUrl);
        }

        if (pathname === "/" && userId) {
            const dashboardUrl = new URL("/admin/dashboard", req.url);
            return NextResponse.redirect(dashboardUrl);
        }

        return NextResponse.next();
    } catch (err) {
        const hostname = req.nextUrl.hostname;

        if (isCustomDomain(hostname)) {
            const url = req.nextUrl.clone();
            const normalizedDomain = normalizeDomain(hostname);
            url.pathname = `/custom-domain/${normalizedDomain}`;
            url.searchParams.set('original_host', hostname);
            return NextResponse.rewrite(url);
        }

        if (isProtectedRoute(req)) {
            const signInUrl = new URL("/sign-in", req.url);
            return NextResponse.redirect(signInUrl);
        }

        return NextResponse.next();
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};