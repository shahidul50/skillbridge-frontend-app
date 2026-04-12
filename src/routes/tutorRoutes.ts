import { Route } from "@/types";
import { LayoutDashboard } from "lucide-react";

export const tutorRoutes: Route[] = [
    {
        title: "Account Management",
        items: [
            {
                name: "Profile",
                url: "/tutor-dashboard/profile",
                icon: LayoutDashboard
            },
            {
                name: "Availability",
                url: "/tutor-dashboard/availability",
                icon: LayoutDashboard
            },
            {
                name: "Exceptions",
                url: "/tutor-dashboard/exceptions",
                icon: LayoutDashboard
            },
            {
                name: "My Subjects",
                url: "/tutor-dashboard/my-subjects",
                icon: LayoutDashboard
            }
        ],
    },
];