import { Route } from "@/types";
import { LayoutDashboard, CopyPlus, Users, ShieldUser } from "lucide-react";
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
            {
                name: "Tutors",
                url: "/admin-dashboard/tutors",
                icon: ShieldUser
            },
            {
                name: "Add Category",
                url: "/admin-dashboard/add-category",
                icon: CopyPlus
            },
        ],
    },
];