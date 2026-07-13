"use client";

import { motion, } from "framer-motion";
import {
  BadgeCheck,
  CalendarClock,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

/* ─── Decorative SVGs ─────────────────────────────────────── */

function GraduationDecor() {
  return (
    <div className="pointer-events-none absolute right-6 bottom-6 opacity-[0.08] dark:opacity-[0.06]">
      <svg
        width="96"
        height="96"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-emerald-600 dark:text-emerald-400"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    </div>
  );
}

function DashboardDecor() {
  return (
    <div className="pointer-events-none absolute right-6 bottom-8 flex flex-col gap-[10px] opacity-[0.09] dark:opacity-[0.07]">
      <div className="h-3 w-28 rounded-full bg-emerald-500 dark:bg-emerald-400" />
      <div className="h-3 w-20 rounded-full bg-emerald-500 dark:bg-emerald-400" />
      <div className="h-3 w-24 rounded-full bg-emerald-500 dark:bg-emerald-400" />
    </div>
  );
}

/* ─── Animation variants ──────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Icon Badge ──────────────────────────────────────────── */

interface IconBadgeProps {
  icon: React.ElementType;
  accent?: boolean;
}

function IconBadge({ icon: Icon, accent = false }: IconBadgeProps) {
  if (accent) {
    return (
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 dark:bg-emerald-700 ring-1 ring-emerald-500/50">
        <Icon className="h-5 w-5 text-white" />
      </div>
    );
  }
  return (
    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-100 dark:ring-emerald-800">
      <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export default function AboutPlatformFeatures() {
  return (
    <section className="w-full bg-emerald-50/60 dark:bg-zinc-900/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Key Platform Features
          </h2>
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
            Engineered for a superior learning experience.
          </p>
        </motion.div>

        {/* ── Bento Grid — 3-column base on lg ── */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >

          {/* ── Row 1 wrapper (forces both row-1 cards onto the same row) ── */}
          {/* Card 1 — Expert Tutors (wide, col-span-2) */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[20px] border border-gray-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-1 lg:col-span-2"
          >
            <IconBadge icon={BadgeCheck} />
            <h3 className="mb-3 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Expert Tutors
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Browse verified profiles of industry experts and experienced
              educators to find the perfect match for your specific learning
              goals and career trajectory.
            </p>
            <GraduationDecor />
          </motion.div>

          {/* Card 2 — Direct & Instant Booking (accent green, col-span-1) */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[20px] bg-emerald-700 p-7 shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-emerald-800 sm:col-span-1 lg:col-span-1"
          >
            <IconBadge icon={CalendarClock} accent />
            <h3 className="mb-3 text-xl font-extrabold leading-snug tracking-tight text-white">
              Direct &amp; Instant Booking
            </h3>
            <p className="text-sm leading-relaxed text-emerald-100 dark:text-emerald-200">
              No back-and-forth emails. View real-time availability slots and
              book your sessions instantly with automated calendar sync.
            </p>
          </motion.div>

          {/* Card 3 — Role-Based Ecosystem (grey, col-span-1) */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[20px] border border-gray-200/60 bg-gray-100/80 p-7 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-800/60 sm:col-span-1 lg:col-span-1"
          >
            {/* grey-variant icon badge */}
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-zinc-700 ring-1 ring-gray-200 dark:ring-zinc-600">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-3 text-xl font-extrabold leading-snug tracking-tight text-gray-900 dark:text-white">
              Role-Based Ecosystem
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              A securely structured environment with dedicated dashboards and
              custom access controls for Students, Tutors, and Admins.
            </p>
          </motion.div>

          {/* Card 4 — Comprehensive Dashboards (wide, col-span-2) */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[20px] border border-gray-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-1 lg:col-span-2"
          >
            <IconBadge icon={LayoutDashboard} />
            <h3 className="mb-3 text-xl font-extrabold leading-snug tracking-tight text-gray-900 dark:text-white">
              Comprehensive Dashboards
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Tutors can manage their availability and track earnings, while
              students can view upcoming schedules and history in one place.
            </p>
            <DashboardDecor />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
