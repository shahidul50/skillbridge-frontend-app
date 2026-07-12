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

    // 1. Optimistic Authentication Check
    // Check for both dev and production (Secure) cookie names
    const sessionToken =
        request.cookies.get('better-auth.session_token')?.value ||
        request.cookies.get('__Secure-better-auth.session_token')?.value ||
        request.cookies.get('accessToken')?.value;

    const isAuthRoute = AuthRoutes.some((route) => pathname.startsWith(route));

    // If user is not authenticated and trying to access a protected route
    if (!sessionToken && !isAuthRoute) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
        return NextResponse.redirect(url);
    }

    // 2. Role-Based Access Control
    let userRole: string | undefined = undefined;

    if (sessionToken) {
        try {
            // Note: AUTH_URL must be an absolute URL in production env variables
            const res = await fetch(`${process.env.AUTH_URL}/get-session`, {
                headers: {
                    Cookie: request.headers.get('cookie') || ''
                },
                cache: "no-store"
            });

            if (res.ok) {
                const sessionData = await res.json();
                userRole = sessionData?.user?.role;
            }
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
        const isAccessingStudentRoute = pathname.startsWith('/dashboard') && !isAccessingAdminRoute && !isAccessingTutorRoute;

        // Specific task: If admin tries to access student (/dashboard) or tutor (/tutor-dashboard)
        if (userRole === Roles.admin && (isAccessingStudentRoute || isAccessingTutorRoute)) {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        }

        // Redirect if a role tries to access another role's dashboard 
        // (e.g. Student trying to access /admin-dashboard)
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
        '/tutors/:id/book',
        '/tutors/:id/book/success',
    ],
};
