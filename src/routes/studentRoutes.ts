import { Route } from "@/types";
import { LayoutDashboard } from "lucide-react";

export const studentRoutes: Route[] = [
    {
        title: "Account Management",
        items: [
            {
                name: "Profile",
                url: "/dashboard/profile",
                icon: LayoutDashboard
            },
            {
                name: "Booking History",
                url: "/dashboard/booking-history",
                icon: LayoutDashboard
            },
        ],
    },
];