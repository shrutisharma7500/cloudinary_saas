import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
]);

const isPublicRouteApi = createRouteMatcher([
    "/api/videos",
]);

export default clerkMiddleware(async (auth, req) => {
    // Call `auth()` to get the auth details
       // Access `userId` from `req.auth` if it exists
    const userId =auth();

    const currentUrl = new URL(req.url);
    const isAccessingHomepage = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    if (await userId && isPublicRoute(req) && isAccessingHomepage) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // If user is not logged in
    if (!userId) {
        // Redirect to sign-in if user tries to access a protected route
        if (!isPublicRoute(req) && !isPublicRouteApi(req)) {
            return NextResponse.redirect(new URL('sign-in', req.url));
        }
        // Redirect to sign-in for protected API routes
        if (isApiRequest && !isPublicRouteApi(req)) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
    }

    if (isPublicRoute(req)) {
        return NextResponse.next(); // Allow access to public routes without any redirection
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
