import { Route } from "@/types";
import { LayoutDashboard } from "lucide-react";
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
                icon: LayoutDashboard
            },
            {
                name: "Tutors",
                url: "/admin-dashboard/tutors",
                icon: LayoutDashboard
            },
            {
                name: "Categories",
                url: "/admin-dashboard/categories",
                icon: LayoutDashboard
            },
        ],
    },
];