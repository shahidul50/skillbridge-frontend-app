import { Route } from "@/types";
import { LayoutDashboard, Star, UserRound, History, CalendarCheck } from "lucide-react";

export const studentRoutes: Route[] = [
    {
        title: "",
        items: [
            {
                name: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard
            },
        ],
    },
    {
        title: "Booking Management",
        items: [
            {
                name: "Booking History",
                url: "/dashboard/booking-history",
                icon: History,
            },
            {
                name: "Schedule",
                url: "/dashboard/schedule",
                icon: CalendarCheck,
            },
        ],
    },
    {
        title: "Account & Reviews",
        items: [
            {
                name: "Give Review",
                url: "/dashboard/give-review",
                icon: Star,
            },
            {
                name: "Profile",
                url: "/dashboard/profile",
                icon: UserRound,
            },
        ],
    },
];