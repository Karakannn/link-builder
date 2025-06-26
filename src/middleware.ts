/* import { NextRequest, NextResponse } from "next/server";
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

    // Debug logları - error olarak at ki Vercel'de gözüksün
    console.error("🚀 MIDDLEWARE:", {
        hostname,
        pathname: url.pathname,
        isCustomDomain: isCustomDomain(hostname),
    });

    // ÖNEMLİ: Static dosyaları custom domain logic'inden muaf tut
    // Bu kontroller matcher'dan önce geldiği için daha güvenli
    if (
        url.pathname.startsWith("/_next/") ||
        url.pathname.startsWith("/favicon") ||
        url.pathname.includes("static") ||
        url.pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp|ttf|eot)$/)
    ) {
        console.error("📁 STATIC FILE:", url.pathname);
        return NextResponse.next();
    }

    // Debug: Tüm istekleri logla
    console.error("🔍 REQUEST:", {
        pathname: url.pathname,
        hostname,
        search: url.search,
        isStatic: url.pathname.startsWith("/_next/") || url.pathname.includes("static"),
    });

    // Custom domain kontrolü
    if (isCustomDomain(hostname)) {
        console.error("🌐 CUSTOM DOMAIN:", hostname);

        // Static dosyaları ana domain'e yönlendir
        if (
            url.pathname.startsWith("/_next/") ||
            url.pathname.startsWith("/favicon") ||
            url.pathname.includes("static") ||
            url.pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp|ttf|eot)$/)
        ) {
            const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";
            const redirectUrl = `https://${appDomain}${url.pathname}${url.search}`;
            console.error("🔄 REDIRECTING STATIC:", redirectUrl);
            return NextResponse.redirect(redirectUrl);
        }

        // Custom domain'de sadece root path'e izin ver
        if (url.pathname !== "/") {
            console.error("❌ CUSTOM DOMAIN NOT ROOT:", url.pathname);
            return new NextResponse(null, { status: 404 });
        }

        // Custom domain homepage'e rewrite et
        console.error("🔄 REWRITING TO:", `/custom-domain/${hostname}`);
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
    
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
    ],
};
 */

import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)", "/settings(.*)"]);

// Custom domain logic'i tamamen comment out
/*
function isCustomDomain(hostname: string): boolean {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";
  
  const hostingDomains = [
    appDomain,
    "localhost",
    "localhost:3000", 
    "localhost:3001",
    "127.0.0.1",
    "linkbuilder.com"
  ];
  
  return !hostingDomains.includes(hostname);
}
*/

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || req.nextUrl.hostname;

    console.log("🚀 Simple auth middleware:", {
        hostname,
        pathname: url.pathname,
    });

    // Custom domain logic tamamen kapalı
    /*
  // Debug logları - error olarak at ki Vercel'de gözüksün
  console.error("🚀 MIDDLEWARE:", { 
    hostname, 
    pathname: url.pathname,
    isCustomDomain: isCustomDomain(hostname)
  });

  // ÖNEMLİ: Static dosyaları custom domain logic'inden muaf tut
  // Bu kontroller matcher'dan önce geldiği için daha güvenli
  if (url.pathname.startsWith('/_next/') || 
      url.pathname.startsWith('/favicon') ||
      url.pathname.includes('static') ||
      url.pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp|ttf|eot)$/)) {
    console.error("📁 STATIC FILE:", url.pathname);
    return NextResponse.next();
  }

  // Debug: Tüm istekleri logla
  console.error("🔍 REQUEST:", {
    pathname: url.pathname,
    hostname,
    search: url.search,
    isStatic: url.pathname.startsWith('/_next/') || url.pathname.includes('static')
  });

  // Custom domain kontrolü
  if (isCustomDomain(hostname)) {
    console.error("🌐 CUSTOM DOMAIN:", hostname);
    
    // Static dosyaları ana domain'e yönlendir
    if (url.pathname.startsWith('/_next/') || 
        url.pathname.startsWith('/favicon') ||
        url.pathname.includes('static') ||
        url.pathname.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico|webp|ttf|eot)$/)) {
      const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "link-builder-phi.vercel.app";
      const redirectUrl = `https://${appDomain}${url.pathname}${url.search}`;
      console.error("🔄 REDIRECTING STATIC:", redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Custom domain'de sadece root path'e izin ver
    if (url.pathname !== '/') {
      console.error("❌ CUSTOM DOMAIN NOT ROOT:", url.pathname);
      return new NextResponse(null, { status: 404 });
    }
    
    // Custom domain homepage'e rewrite et
    console.error("🔄 REWRITING TO:", `/custom-domain/${hostname}`);
    return NextResponse.rewrite(new URL(`/custom-domain/${hostname}`, req.url));
  }
  */

    // Ana domain için normal auth flow
    console.log("🏠 Processing auth");

    const { userId } = await auth();
    console.log("👤 Auth result:", {
        userId: userId ? "logged-in" : "not-logged-in",
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
         * Sadece basit auth için matcher
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
    ],
};