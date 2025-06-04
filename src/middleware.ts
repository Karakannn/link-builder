import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/builder(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Statik dosyalar için hızlı çıkış
    if (req.nextUrl.pathname.includes(".") && !req.nextUrl.pathname.includes("/api/")) {
      return NextResponse.next();
    }

    console.log("Processing route:", req.nextUrl.pathname);

    // auth() çağrısını destructure ederek al
    const { userId} = await auth();

    console.log("userId:", userId);
    console.log("isProtectedRoute(req):", isProtectedRoute(req));

    // Korumalı route'larda userId kontrolü
    if (isProtectedRoute(req) && !userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    console.error("Request URL:", req.nextUrl.href);
    console.error("Environment vars check:", {
      hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    });

    // Hata durumunda güvenli fallback
    if (isProtectedRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }
});

// Daha performanslı ve basit matcher
export const config = {
  matcher: [
    // API route'ları dahil et
    "/(api|trpc)(.*)",
    // Statik dosyalar hariç tüm route'lar
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
