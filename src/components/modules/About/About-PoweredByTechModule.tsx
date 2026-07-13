"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

/* ─── Animation Variants ──────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Tech Stack Data ─────────────────────────────────────── */

const techCategories = [
  {
    id: "frontend",
    label: "FRONTEND",
    icon: Monitor,
    items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "backend",
    label: "BACKEND",
    icon: Server,
    items: ["Express.js (Node.js Framework)", "TypeScript"],
  },
  {
    id: "persistence",
    label: "PERSISTENCE",
    icon: Database,
    items: ["PostgreSQL", "Prisma ORM"],
  },
  {
    id: "security",
    label: "SECURITY",
    icon: ShieldCheck,
    items: ["Better-Auth", "RBAC Implementation", "Bcrypt.js Hashing"],
  },
];

/* ─── Tech Card ───────────────────────────────────────────── */

interface TechCardProps {
  label: string;
  icon: React.ElementType;
  items: string[];
}

function TechCard({ label, icon: Icon, items }: TechCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="
        flex flex-col gap-4 rounded-2xl border border-white/10
        bg-white/5 p-6
        backdrop-blur-sm
        transition-all duration-300
        hover:border-emerald-500/40 hover:bg-white/10
        dark:border-white/10 dark:bg-white/5
        dark:hover:border-emerald-500/40 dark:hover:bg-white/10
      "
    >
      {/* Category Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30">
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-xs font-bold tracking-[0.15em] text-zinc-300 dark:text-zinc-300">
          {label}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/10" />

      {/* Tech Items */}
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-px h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-sm leading-snug text-zinc-200 dark:text-zinc-200">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export default function AboutPoweredByTechModule() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1a2e1e] py-20 lg:py-28 dark:bg-[#111a13]">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[800px] rounded-full bg-emerald-700/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          className="mb-14 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.h2
            variants={headingVariants}
            className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Powered by Modern Technology
          </motion.h2>
          <motion.p
            variants={headingVariants}
            className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            SkillBridge is built with the world&apos;s most robust and performant
            technologies to ensure 99.9% uptime and lightning-fast interactions.
          </motion.p>
        </motion.div>

        {/* ── Tech Cards Grid ── */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {techCategories.map((cat) => (
            <TechCard
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              items={cat.items}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
