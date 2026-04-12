"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, LayoutDashboard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "../ModeToogle"
import { NotificationDropdown } from "./NotificationDropdown"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 pr-6 py-8">
      {/* Sidebar Toggle Button */}
      <SidebarTrigger className="hover:bg-secondary" />
      
      {/* Left side  */}
      <div className="hidden md:flex items-center gap-2 ml-2">
        <LayoutDashboard className="size-4 text-muted-foreground" />
        <h1 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overview</h1>
      </div>
        
       {/* Right side  */}
      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 h-9 bg-secondary/50 border-none w-64" />
        </div>
        <ModeToggle/>
        <NotificationDropdown/>
      </div>
    </header>
  )
}