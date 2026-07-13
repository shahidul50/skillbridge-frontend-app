"use client";

import { motion } from "framer-motion";
import { TGetAboutUsStatsResponse } from "@/types/bookings.type";

/* ─── Animation Variants ──────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Stat formatter ──────────────────────────────────────── */

function formatStat(
  value: number,
  key: keyof TGetAboutUsStatsResponse
): string {
  if (key === "successRate") return `${value}%`;
  if (value >= 1000) return `${Math.round((value / 1000) * 10) / 10}k+`;
  return `${value}+`;
}

/* ─── Stat Card ───────────────────────────────────────────── */

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="
        flex flex-col items-center justify-center gap-1.5 rounded-2xl
        border border-emerald-200/80 bg-white/70 px-6 py-6
        backdrop-blur-sm shadow-sm
        transition-all duration-300
        hover:border-emerald-400/60 hover:shadow-md
        dark:border-emerald-800/50 dark:bg-zinc-800/70 dark:hover:border-emerald-600/60
      "
    >
      <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-3xl">
        {value}
      </span>
      <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Props ───────────────────────────────────────────────── */

interface Props {
  stats: TGetAboutUsStatsResponse;
}

/* ─── Main Component ──────────────────────────────────────── */

export default function AboutOurMissionModule({ stats }: Props) {
  const statItems = [
    { key: "activeStudent" as const, label: "Active Students" },
    { key: "expertTutors" as const, label: "Expert Tutors" },
    { key: "totalSessions" as const, label: "Sessions Booked" },
    { key: "successRate" as const, label: "Satisfaction Rate" },
  ];

  return (
    <section className="w-full bg-[#eef5ed] py-20 lg:py-28 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* ── Header + Mission text ── */}
        <motion.div
          className="mb-14 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Label */}
          <motion.p
            variants={fadeUpVariants}
            className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400"
          >
            Our Mission
          </motion.p>

          {/* Large italic quote */}
          <motion.blockquote
            variants={fadeUpVariants}
            className="mb-6 text-2xl font-extrabold italic leading-snug tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl"
          >
            &ldquo;At SkillBridge, we believe that finding the right mentor
            shouldn&apos;t be complicated.&rdquo;
          </motion.blockquote>

          {/* Body paragraph */}
          <motion.p
            variants={fadeUpVariants}
            className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-zinc-400 sm:text-base"
          >
            Our mission is to eliminate scheduling conflicts and communication
            barriers, allowing students to connect with top-tier tutors across
            various subjects and book live sessions with just a few clicks.
            We&apos;re building the infrastructure for the next generation of
            digital education.
          </motion.p>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {statItems.map(({ key, label }) => (
            <StatCard
              key={key}
              value={formatStat(stats[key], key)}
              label={label}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
