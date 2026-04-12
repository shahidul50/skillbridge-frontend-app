
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, User, LogOut, ChevronRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"
function SidebarUserMenu() {
    const { isMobile } = useSidebar()
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-secondary"
                    >
                        <Avatar className="size-8 border">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>SI</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Shahidul Islam</span>
                            <span className="truncate text-xs text-muted-foreground">Developer</span>
                        </div>
                        <ChevronRight className="ml-auto size-4 text-muted-foreground md:hidden" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "end"}
                    sideOffset={4}
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>SI</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Shahidul Islam</span>
                                <span className="truncate text-xs text-muted-foreground">shahidul@dev.com</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <Link href="/dashboard/profile" className="flex">
                            <User className="mr-3 size-4" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive cursor-pointer">
                        <LogOut className="mr-2 size-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SidebarUserMenu
