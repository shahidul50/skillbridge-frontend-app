import { Route } from "@/types";
import { LayoutDashboard } from "lucide-react";

export const studentRoutes: Route[] = [
    {
        title: "Account Management",
        items: [
            {
                name: "Create Blog",
                url: "/dashboard/create-blog",
                icon: LayoutDashboard
            },
            {
                name: "History",
                url: "/dashboard/history",
                icon: LayoutDashboard
            },
        ],
    },
];