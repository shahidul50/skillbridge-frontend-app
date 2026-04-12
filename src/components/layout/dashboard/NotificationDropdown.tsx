"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
  {
    title: "Bank feed synced",
    description: "42 new transactions imported from Northwind Business Checking.",
    time: "4m ago",
  },
  {
    title: "Budget threshold",
    description: "Marketing spend is at 88% of the quarterly envelope.",
    time: "1h ago",
  },
  {
    title: "Reconciliation reminder",
    description: "3 accounts are due for month-end close review.",
    time: "3h ago",
  },
  {
    title: "CFO report ready",
    description: "Consolidated P&L for last month is available to export.",
    time: "Yesterday",
  },
]

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 border rounded-full">
          <Bell className="size-4" />
          <Badge className="absolute -top-3 -right-2 size-6 p-0 flex items-center justify-center text-[10px] bg-destructive text-white border-2 border-background">
            9
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-85 p-0 overflow-hidden">
        <DropdownMenuLabel className="p-4 font-semibold text-base border-b">
          Notifications
        </DropdownMenuLabel>
        
        <ScrollArea className="h-87.5">
          <div className="flex flex-col">
            {notifications.map((item, index) => (
              <DropdownMenuItem 
                key={index} 
                className="flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 border-b last:border-0"
              >
                <span className="font-bold text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {item.time}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-2 border-t bg-muted/20">
          <Button variant="ghost" className="w-full text-sm font-bold h-9 hover:bg-transparent hover:text-primary">
            See All...
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}