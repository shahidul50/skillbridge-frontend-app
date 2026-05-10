import { tutorService } from "@/services/tutor.service";
import TutorCard from "../tutors/TutorCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Container } from "@/components/layout/Container";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

export default async function FeaturedTutor() {
    const { data: tutors } = await tutorService.getAllTutor({ limit: 4 });

    // If no tutors are found, we could show a message or just return null
    if (!tutors || tutors.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-background overflow-hidden">
            <Container>
                <div className="container px-4 mx-auto">
                    <ScrollMotion>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div className="space-y-3">
                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Featured Tutors
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                                    Highly-rated experts ready to help you succeed in your learning journey.
                                </p>
                            </div>
                            <Link href="/tutors">
                                <Button variant="ghost" className="group font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all p-0 h-auto">
                                    Browse All Tutors
                                    <RiArrowRightLine className="ml-1 size-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollMotion>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {tutors.data.slice(0, 4).map((tutor: any, index: number) => (
                            <ScrollMotion key={tutor.id} delay={index * 0.1} className="h-full">
                                <TutorCard tutor={tutor} />
                            </ScrollMotion>
                        ))}
                    </div>
                </div>
            </Container>

        </section>
    );
}

