import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

const roleAccessMap: Record<string, string[]> = {
    admin: ["/", "/dashboard", "/result", "/user"],
    voter: ["/", "/vote", "/vote/confirmation", "/profile"],
};

// Function to check if role has access
function doesRoleHaveAccessToURL(role: string, url: string) {
    const accessibleRoutes = roleAccessMap[role] || [];

    return accessibleRoutes.some((route) =>
        route === "/" ? url === "/" : url.startsWith(route)
    );
}

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;

        // Allow public & static files
        if (
            pathname.startsWith("/_next/") ||
            pathname.startsWith("/favicon.ico") ||
            pathname.startsWith("/public/") ||
            /\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot|json|txt|webp)$/i.test(pathname)
        ) {
            return NextResponse.next();
        }

        // Get token from next-auth
        const token = req.nextauth.token as { role?: string } | null;
        const role = token?.role?.toLowerCase();

        // ✅ Redirect logged-in users away from /signin
        if (role && pathname.startsWith("/signin")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Redirect unauthenticated users to /signin
        if (!role || !roleAccessMap[role]) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        // Ensure user has access to the requested route
        if (!doesRoleHaveAccessToURL(role, pathname)) {
            return NextResponse.rewrite(new URL("/404", req.url)); // Redirect to 404
        }

        return NextResponse.next();
    },
    {
        pages: {
            signIn: "/signin",
        },
    }
);

// Apply middleware only to protected routes
export const config = {
    matcher: ["/((?!api|_next|public|favicon.ico).*)"],
  };