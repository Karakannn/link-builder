import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)", "/settings(.*)"]);

function isCustomDomain(hostname: string): boolean {
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";

    const hostingDomains = [appDomain, "localhost", "localhost:3000", "localhost:3001", "127.0.0.1", "linkbuilder.com"];

    return !hostingDomains.includes(hostname);
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || req.nextUrl.hostname;

    console.log("🚀 Processing request:", {
        hostname,
        pathname: url.pathname,
        isCustomDomain: isCustomDomain(hostname),
    });

    // ÖNEMLİ: Static dosyaları custom domain logic'inden muaf tut
    // Bu kontroller matcher'dan önce geldiği için daha güvenli
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/favicon") || url.pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp)$/)) {
        console.log("📁 Static file request - bypassing custom domain logic");
        return NextResponse.next();
    }

    // Custom domain kontrolü
    if (isCustomDomain(hostname)) {
        console.log("🌐 Custom domain detected:", hostname);

        // Custom domain'de sadece root path'e izin ver
        if (url.pathname !== "/") {
            console.log("❌ Custom domain - only root path allowed:", url.pathname);
            return new NextResponse(null, { status: 404 });
        }

        // Custom domain homepage'e rewrite et
        console.log("🔄 Rewriting to:", `/custom-domain/${hostname}`);
        return NextResponse.rewrite(new URL(`/custom-domain/${hostname}`, req.url));
    }

    // Ana domain için normal auth flow
    console.log("🏠 Main app domain request - proceeding with auth");

    const { userId } = await auth();
    console.log("👤 Auth check:", {
        userId,
        pathname: url.pathname,
        isProtected: isProtectedRoute(req),
    });

    // Authenticated user homepage'den dashboard'a yönlendir
    if (userId && url.pathname === "/") {
        console.log("📊 Redirecting authenticated user to dashboard");
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Protected route kontrolü
    if (isProtectedRoute(req) && !userId) {
        console.log("🔒 Protected route - redirecting to login");
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    console.log("✅ Proceeding normally");
    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)).*)",
    ],
};
