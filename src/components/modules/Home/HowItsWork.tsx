import { Container } from "@/components/layout/Container";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { RiSearchLine, RiCalendarCheckLine, RiFlashlightLine } from "@remixicon/react";

const steps = [
  {
    id: 1,
    title: "1. Find your tutor",
    description: "Browse through our directory of thousands of expert tutors and find the one that fits your needs.",
    icon: <RiSearchLine className="size-8 text-white" />,
  },
  {
    id: 2,
    title: "2. Book a session",
    description: "Check availability and schedule your first lesson at a time that works best for your schedule.",
    icon: <RiCalendarCheckLine className="size-8 text-white" />,
  },
  {
    id: 3,
    title: "3. Start learning",
    description: "Join your virtual classroom and begin mastering your new skills with 1-on-1 expert guidance.",
    icon: <RiFlashlightLine className="size-8 text-white" />,
  },
];

export default function HowItsWork() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-slate-50/30 dark:bg-slate-900/10">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <ScrollMotion>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              How it Works
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Get started on your learning journey in three simple steps. We make finding the perfect tutor effortless.
            </p>
          </ScrollMotion>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-emerald-200 dark:border-emerald-900/50 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <ScrollMotion key={step.id} delay={index * 0.2} variant="fadeUp">
                <div className="flex flex-col items-center text-center group">
                  <div className="size-20 md:size-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-8 relative transition-transform duration-500 group-hover:scale-110">
                    {step.icon}
                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </ScrollMotion>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
