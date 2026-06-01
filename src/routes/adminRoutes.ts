import { Route } from "@/types";
import { LayoutDashboard, CopyPlus, Users, CreditCard, SquarePlus, CalendarCheck } from "lucide-react";
export const adminRoutes: Route[] = [
    {
        title: "Overview",
        items: [
            {
                name: "Dashboard",
                url: "/admin-dashboard",
                icon: LayoutDashboard
            },
        ],
    },
    {
        title: "User Management",
        items: [
            {
                name: "Users",
                url: "/admin-dashboard/users",
                icon: Users
            },
        ],
    },
    {
        title: "Content Management",
        items: [
            {
                name: "Add Category",
                url: "/admin-dashboard/add-category",
                icon: CopyPlus
            },
        ],
    },
    {
        title: "Core Operations",
        items: [
            {
                name: "Bookings",
                url: "/admin-dashboard/bookings",
                icon: CalendarCheck
            },
        ],
    },
    {
        title: "Financials",
        items: [
            {
                name: "Payments",
                url: "/admin-dashboard/payments",
                icon: CreditCard
            },
            {
                name: "Add Payment Account",
                url: "/admin-dashboard/add-payment-account",
                icon: SquarePlus
            },
        ],
    },
];