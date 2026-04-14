
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
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserSession } from "@/actions/auth.action"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
function SidebarUserMenu() {
    const { isMobile } = useSidebar()
        const [session, setSession] = useState<any>(null);
        const router = useRouter();
     
        useEffect(() => {
            const fetchSession = async () => {
                const sessionData = await getUserSession();
                setSession(sessionData?.data);
            };
            fetchSession();
        }, []);
    
        const handleLogout = async () => {
            try {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            setSession(null);
                            router.push("/login"); // Redirect after logout
                            router.refresh();
                        },
                    },
                });
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };
    
        // const isLoggedIn = !!session;
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-secondary"
                    >
                        <Avatar className="size-8 border">
                            <AvatarImage src={session?.user?.image} />
                            <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{session?.user?.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{session?.user?.email}</span>
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
                                <AvatarImage src={session?.user?.image} />
                                <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{session?.user?.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{session?.user?.email}</span>
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
                    <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 size-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SidebarUserMenu
