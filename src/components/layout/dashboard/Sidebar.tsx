"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { Route } from "@/types"
import { Roles } from "@/constants/roles"
import { adminRoutes } from "@/routes/adminRoutes"
import { studentRoutes } from "@/routes/studentRoutes"
import { tutorRoutes } from "@/routes/tutorRoutes"
import SidebarUserMenu from "./SidebarUserMenu"

    

export function AppSidebar({ user, ...props }: {user:{role:string} & React.ComponentProps<typeof Sidebar>}) {
  const pathname = usePathname()
  const { state } = useSidebar() // check sidebar collapsible state

  let routes: Route[] = [];

  switch (user.role) {
    case Roles.admin:
      routes = adminRoutes;
      break;
    case Roles.student:
      routes = studentRoutes;
      break;
    case Roles.tutor:
      routes = tutorRoutes;
      break;
    default:
      routes = [];
      break;
  }

  return (
    <Sidebar collapsible="icon" className="border-r bg-card">
      <SidebarHeader className="h-16 border-b flex items-center justify-center">
        <div className="flex items-center gap-3 w-full">
          <div className="size-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
            <div className="p-1.5 rounded-md bg-emerald-500 text-white">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          {state !== "collapsed" && (
            <span className="font-bold text-lg tracking-tight transition-opacity duration-300">
              SkillBridge
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="uppercase text-[10px] font-bold tracking-widest">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        isActive={isActive}
                        className={cn(isActive && "bg-secondary text-primary")}
                      >
                        <Link href={item.url}>
                          <item.icon className={cn("size-4", isActive && "text-primary")} />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarUserMenu/>
      </SidebarFooter>
    </Sidebar>
  )
}