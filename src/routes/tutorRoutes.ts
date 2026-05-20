import { Route } from "@/types";
import { LayoutDashboard, UserRound, Clock, CalendarX2, Album, CalendarCheck } from "lucide-react";

export const tutorRoutes: Route[] = [
    {
        title: "",
        items: [
            {
                name: "Dashboard",
                url: "/tutor-dashboard",
                icon: LayoutDashboard
            },
        ],
    },
    {
        title: "Profile Management",
        items: [
            {
                name: "Profile",
                url: "/tutor-dashboard/profile",
                icon: UserRound
            },
        ],
    },
    {
        title: "Courses Management",
        items: [
            {
                name: "My Subjects",
                url: "/tutor-dashboard/my-subject",
                icon: Album
            },
            {
                name: "Availability",
                url: "/tutor-dashboard/availability",
                icon: Clock
            },
            {
                name: "Exceptions",
                url: "/tutor-dashboard/exceptions",
                icon: CalendarX2
            }
        ],
    },
    {
        title: "Booking Management",
        items: [
            {
                name: "Schedule",
                url: "/tutor-dashboard/schedule",
                icon: CalendarCheck
            }
        ]
    }
];