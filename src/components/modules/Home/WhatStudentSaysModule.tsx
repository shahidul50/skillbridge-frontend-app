"use client";

import { TFeaturesReviewResponse } from "@/types/review.type";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Helper: Star Rating (no animation)                                  */
/* ------------------------------------------------------------------ */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-emerald-500" : "text-gray-200 dark:text-gray-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review Card (hover animation only)                                  */
/* ------------------------------------------------------------------ */
function ReviewCard({ review }: { review: TFeaturesReviewResponse }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(16,185,129,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="
        flex flex-col h-full
        bg-white dark:bg-gray-800/60
        border border-gray-100 dark:border-white/10
        rounded-2xl p-7
        shadow-sm
        select-none cursor-default
        will-change-transform
      "
    >
      <StarRating rating={review.rating} />

      {/* Comment */}
      <blockquote className="flex-1 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic mb-7">
        &ldquo;{review.comment.length > 150 ? review.comment.slice(0, 150) + "..." : review.comment}&rdquo;
      </blockquote>

      {/* Student Info */}
      <div className="flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-white/10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
          className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-emerald-100 dark:bg-emerald-900/40"
        >
          {review.studentAvatar ? (
            <Image
              src={review.studentAvatar}
              alt={review.studentName}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg uppercase">
              {review.studentName.charAt(0)}
            </span>
          )}
        </motion.div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
            {review.studentName}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mt-0.5">
            {review.studentTitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */
interface WhatStudentSaysModuleProps {
  reviews: TFeaturesReviewResponse[];
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */
export default function WhatStudentSaysModule({ reviews }: WhatStudentSaysModuleProps) {
  const VISIBLE = 3;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = reviews.length > 0 ? reviews : [];
  const total = items.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = (i: number) => {
    setCurrent(i);
  };

  /* Auto-play */
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    intervalRef.current = setInterval(next, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, isPaused, total]);

  if (total === 0) return null;

  const getVisibleIndices = (count: number) =>
    Array.from({ length: count }, (_, i) => (current + i) % total);

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gray-50/60 dark:bg-gray-900/40 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Student Testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Discover how SkillBridge has helped students achieve their learning goals around the world.
          </p>
        </div>

        {/* ── Mobile: 1 card ── */}
        <div className="block sm:hidden">
          <ReviewCard review={items[current]} />
        </div>

        {/* ── SM: 2 cards ── */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6">
          {getVisibleIndices(Math.min(2, total)).map((idx) => (
            <ReviewCard key={idx} review={items[idx]} />
          ))}
        </div>

        {/* ── LG+: 3 cards ── */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {getVisibleIndices(Math.min(VISIBLE, total)).map((idx) => (
            <ReviewCard key={idx} review={items[idx]} />
          ))}
        </div>

        {/* ── Controls ── */}
        {total > 1 && (
          <div className="mt-10 flex flex-col items-center gap-5">

            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
              {items.map((_, i) => (
                <motion.button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  animate={{
                    width: i === current ? 28 : 10,
                    backgroundColor: i === current ? "#10b981" : "#d1d5db",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex items-center gap-3">
              {[
                { onClick: prev, label: "Previous testimonial", d: "M15 19l-7-7 7-7" },
                { onClick: next, label: "Next testimonial", d: "M9 5l7 7-7 7" },
              ].map(({ onClick, label, d }) => (
                <motion.button
                  key={label}
                  onClick={onClick}
                  aria-label={label}
                  whileHover={{ scale: 1.1, backgroundColor: "#10b981", color: "#fff", borderColor: "#10b981" }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="
                    w-10 h-10 rounded-full flex items-center justify-center
                    border border-gray-200 dark:border-white/10
                    bg-white dark:bg-gray-800
                    text-gray-600 dark:text-gray-300
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                  "
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
