import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutHeroModule() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about-hero-banner.png')" }}
      />
      {/* Dark overlay for contrast — stronger in light mode */}
      <div className="absolute inset-0 bg-white/70 dark:bg-zinc-950/75" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center bg-emerald-700 dark:bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full shadow-md">
            Bridging Potential
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          About{" "}
          <span className="text-emerald-700 dark:text-emerald-500">
            SkillBridge
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-700 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto mb-10 font-semibold drop-shadow-sm">
          Welcome to SkillBridge, a modern full-stack online tutoring and session
          scheduling platform designed to bridge the gap between eager learners
          and expert mentors. Whether you are a student looking to master a new
          skill or an educator wanting to share your knowledge, SkillBridge
          provides a seamless, structured, and secure ecosystem to make learning
          impactful and accessible.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/tutors">
            <Button className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-base px-8 h-12 rounded-full shadow-lg shadow-emerald-700/25 transition-all hover:-translate-y-0.5">
              Explore Tutors
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/register?role=tutor">
            <Button
              variant="outline"
              className="bg-white/90 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 text-gray-900 dark:text-white border-white dark:border-zinc-700 font-bold text-base px-8 h-12 rounded-full shadow-md backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              Join as Tutor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
