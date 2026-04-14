import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Roles } from './constants/roles';

// Auth routes that unauthenticated users can access
const AuthRoutes = ['/login', '/register'];

// Role-based route configurations
const roleBasedProtectedRoutes = {
    [Roles.admin]: ['/admin-dashboard'],
    [Roles.student]: ['/dashboard'],
    [Roles.tutor]: ['/tutor-dashboard'],
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Optimistic Authentication Check (Next.js 16 Proxy layer)
    // Check for the better-auth session token or your custom authentication cookie
    const sessionToken = request.cookies.get('better-auth.session_token')?.value || request.cookies.get('accessToken')?.value;

    const isAuthRoute = AuthRoutes.some((route) => pathname.startsWith(route));

    // If user is not authenticated and trying to access a protected route
    if (!sessionToken && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Role-Based Access Control
    let userRole: string | undefined = undefined;

    if (sessionToken) {
        try {
            const res = await fetch(`${process.env.AUTH_URL}/get-session`, {
                headers: {
                    Cookie: request.headers.get('cookie') || ''
                },
                cache: "no-store"
            });
            const sessionData = await res.json();
            userRole = sessionData?.user?.role;
        } catch (err) {
            console.error("Proxy session fetch error:", err);
        }
    }

    if (sessionToken && userRole) {
        const dashboardPath = roleBasedProtectedRoutes[userRole as keyof typeof roleBasedProtectedRoutes]?.[0] || '/';

        // If an authenticated user tries to access login/register, push them to their dashboard
        if (isAuthRoute) {
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }

        // Checking path authorizations
        const isAccessingAdminRoute = pathname.startsWith('/admin-dashboard');
        const isAccessingTutorRoute = pathname.startsWith('/tutor-dashboard');
        // Need to ensure /dashboard doesn't match /admin-dashboard or /tutor-dashboard
        const isAccessingStudentRoute = pathname.startsWith('/dashboard') && !isAccessingAdminRoute && !isAccessingTutorRoute;

        // Redirect if a role tries to access another role's dashboard by sending them to their own dashboard
        if (isAccessingAdminRoute && userRole !== Roles.admin) {
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
        if (isAccessingStudentRoute && userRole !== Roles.student) {
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
        if (isAccessingTutorRoute && userRole !== Roles.tutor) {
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
    }

    return NextResponse.next();
}

// Matcher Configuration for Proxy
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin-dashboard/:path*',
        '/tutor-dashboard/:path*',
        '/login',
        '/register',
    ],
};
