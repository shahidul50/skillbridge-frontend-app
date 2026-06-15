"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const ReadyToTakeSkill = () => {
  return (
    <section className="py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-zinc-950 rounded-[2rem] p-8 md:p-16 lg:p-20 text-center relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Ready to take your skills <br className="hidden md:block" />
              to the next level?
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mt-6">
              Join thousands of students who are already learning with
              SkillBridge experts today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-[#22c55e] hover:bg-[#1eb054] text-black transition-all duration-300 rounded-xl"
              >
                <Link href="/register?role=student">Get Started Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-zinc-800 bg-transparent text-white hover:bg-zinc-900 transition-all duration-300 rounded-xl"
              >
                <Link href="/register?role=tutor">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default ReadyToTakeSkill;
