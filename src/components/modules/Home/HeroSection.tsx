"use client"

import Image from "next/image"
import { Search, CheckCircle, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Container } from "@/components/layout/Container"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function HeroSection({ totalTutors, successRate }: { totalTutors: number, successRate: number }) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/tutors?searchTerm=${encodeURIComponent(searchTerm)}`)
    } else {
      router.push("/tutors")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative w-full py-12 overflow-hidden bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
              >
                Connect with <span className="text-primary">Expert</span> Tutors
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
              >
                Master any skill with 1-on-1 personalized lessons from the world&apos;s best educators. 
                From academic subjects to modern tech skills.
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full max-w-lg"
            >
              <InputGroup className="h-14 rounded-full border-border/60 bg-white shadow-sm pr-1.5 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
                <InputGroupAddon align="inline-start" className="pl-5 text-muted-foreground">
                  <Search className="size-5" />
                </InputGroupAddon>
                <InputGroupInput 
                  placeholder="Search by subject or tutor name..." 
                  className="text-base h-full placeholder:text-muted-foreground/60 border-none focus-visible:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  onClick={handleSearch}
                  className="h-11 rounded-full bg-primary hover:bg-primary/90 text-white px-8 font-semibold transition-all shadow-md active:scale-95"
                >
                  Search
                </Button>
              </InputGroup>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center gap-6 pt-2"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-5 text-primary" />
                <span>{totalTutors >=100 ? "100+" : totalTutors.toString()} Tutors</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-5 text-primary" />
                <span>Verified Profiles</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Hero Image */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-muted aspect-4/3 lg:aspect-auto"
            >
              <Image
                src="/images/hero-banner.png"
                alt="Expert tutor working with a laptop"
                width={800}
                height={600}
                className="object-cover w-full h-full transition-transform duration-700"
                priority
              />
            </motion.div>

            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -bottom-6 -right-3 lg:-left-10 bg-white p-5 rounded-2xl shadow-xl border border-border/10 max-w-55  sm:block dark:bg-muted"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-sidebar-primary/10 p-2 rounded-lg dark:bg-sidebar-primary/20">
                    <GraduationCap className="size-5 text-sidebar-primary"/>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-sidebar-primary uppercase">OUR IMPACT</span>
                </div>
                <p className="text-sm font-sans font-semibold text-foreground leading-snug ">
                  {successRate}% Success rate in total sessions.
                </p>
              </div>
            </motion.div>
            
            {/* Decorative element - light green glow */}
            <div className="absolute -z-10 -top-10 -right-10 size-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
