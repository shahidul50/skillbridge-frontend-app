"use client"

import Image from "next/image"
import { Search, CheckCircle, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Container } from "@/components/layout/Container"

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Connect with <span className="text-primary">Expert</span> Tutors
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Master any skill with 1-on-1 personalized lessons from the world&apos;s best educators. 
                From coding to creative arts.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-lg">
              <InputGroup className="h-14 rounded-full border-border/60 bg-white shadow-sm pr-1.5 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
                <InputGroupAddon align="inline-start" className="pl-5 text-muted-foreground">
                  <Search className="size-5" />
                </InputGroupAddon>
                <InputGroupInput 
                  placeholder="Search by subject or tutor name..." 
                  className="text-base h-full placeholder:text-muted-foreground/60"
                />
                <Button 
                  className="h-11 rounded-full bg-primary hover:bg-primary/90 text-white px-8 font-semibold transition-all shadow-md"
                >
                  Search
                </Button>
              </InputGroup>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-5 text-primary" />
                <span>10,000+ Tutors</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-5 text-primary" />
                <span>Verified Profiles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-1000">
            {/* Main Hero Image */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-muted aspect-4/3 lg:aspect-auto">
              <Image
                src="/images/hero-banner.png"
                alt="Expert tutor working with a laptop"
                width={800}
                height={600}
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-5 rounded-2xl shadow-xl border border-border/10 max-w-[220px] hidden sm:block animate-bounce-subtle dark:bg-muted">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-sidebar-primary/10 p-2 rounded-lg dark:bg-sidebar-primary/20">
                    <GraduationCap className="size-5 text-sidebar-primary"/>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-sidebar-primary uppercase">Education</span>
                </div>
                <p className="text-sm font-semibold text-foreground leading-snug ">
                  98% Success rate in computer science sessions.
                </p>
              </div>
            </div>
            
            {/* Decorative element - light green glow */}
            <div className="absolute -z-10 -top-10 -right-10 size-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
