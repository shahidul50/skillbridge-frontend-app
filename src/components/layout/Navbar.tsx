"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, LayoutDashboard, User, LogOut, Boxes} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToogle";

const navLinks = [
    { title: "Find Tutors", href: "#" },
    { title: "Categories", href: "#" },
    { title: "How it Works", href: "#" },
];

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(true);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">

                {/* --- LEFT: Logo --- */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-emerald-500 text-white"> 
                    <Boxes className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold">SkillBridge</span>
                </Link>

                {/* --- CENTER: Desktop Navigation --- */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>

                {/* --- RIGHT: Actions --- */}
                <div className="flex items-center gap-3">

                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme Toggle Example */}
                        <ModeToggle/>

                        {!isLoggedIn ? (
                            <>
        
                                <Link href="/login"  className="font-semibold text-[14px] text-foreground text-md py-1 px-4 rounded-2xl hover:bg-muted">Login</Link>
                                <Link href="/register"  className="rounded-xl text-[14px] bg-primary px-6 py-1.25 font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">Sign up</Link>
                            
                            </>
                        ) : (
                           <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full border-2 border-primary/20 p-0 overflow-hidden ring-offset-background"
                                    >
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={"https://github.com/shadcn.png"} />
                                            <AvatarFallback>SJ</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-64 rounded-2xl p-2 shadow-2xl border border-border bg-background text-foreground animate-in fade-in zoom-in-95 duration-200"
                                    align="end"
                                    sideOffset={8}
                                >
                                    <DropdownMenuLabel className="font-normal p-3 bg-background rounded-t-xl">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-[11px] font-bold uppercase text-primary tracking-widest">Logged in as</p>
                                            <p className="text-sm font-bold truncate">alex.johnson@example.com</p>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator className="bg-border/50" />

                                    <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-xl focus:bg-accent focus:text-accent-foreground outline-none transition-colors group">
                                        <LayoutDashboard className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-foreground/90 group-focus:text-accent-foreground">Dashboard</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer rounded-xl focus:bg-accent focus:text-accent-foreground outline-none transition-colors group">
                                        <User className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-foreground/90 group-focus:text-accent-foreground">Profile</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-border/50" />

                                    <DropdownMenuItem
                                        className="flex items-center gap-3 p-3 cursor-pointer rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive outline-none font-semibold transition-colors"
                                        onClick={() => setIsLoggedIn(false)}
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* --- Mobile Menu Trigger --- */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                    <Menu className="h-7 w-7" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-background text-foreground border-border w-77.5 p-6 outline-none">
                                <SheetHeader className="text-left mb-8 flex flex-row items-center justify-between">
                                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                                    <ModeToggle/>
                                </SheetHeader>

                                <div className="flex flex-col gap-6">
                                    {isLoggedIn && (
                                        <div className="bg-accent/50 p-4 rounded-2xl border border-border/50">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Account</p>
                                            <p className="text-sm font-bold truncate">alex.johnson@example.com</p>
                                        </div>
                                    )}

                                    <nav className="flex flex-col gap-2">
                                        {navLinks.map((link) => (
                                            <Link key={link.title} href={link.href} className="text-lg font-medium py-3 border-b border-border/50 text-foreground/90">
                                                {link.title}
                                            </Link>
                                        ))}
                                        {isLoggedIn && (
                                            <>
                                                <Link href="/dashboard" className="text-lg font-medium py-3 border-b border-border/50 flex items-center gap-3 hover:text-primary transition-colors">
                                                    <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
                                                </Link>
                                                <Link href="/profile" className="text-lg font-medium py-3 border-b border-border/50 flex items-center gap-3 hover:text-primary transition-colors">
                                                    <User className="h-5 w-5 text-primary" /> Profile
                                                </Link>
                                            </>
                                        )}
                                    </nav>

                                    <div className="mt-auto pt-6 flex flex-col gap-3">
                                        {!isLoggedIn ? (
                                            <>
                                                <Button variant="outline" className="w-full rounded-xl py-6 font-semibold border-border">Login</Button>
                                                <Button className="w-full bg-primary text-primary-foreground rounded-xl py-6 font-bold shadow-lg shadow-primary/20">Sign Up</Button>
                                            </>
                                        ) : (
                                            <Button variant="destructive" className="w-full rounded-xl py-6 font-bold" onClick={() => setIsLoggedIn(false)}>
                                                <LogOut className="mr-2 h-5 w-5" /> Logout
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
            </div>
        </header>
    );
}