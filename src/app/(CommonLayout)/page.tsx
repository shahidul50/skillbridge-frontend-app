import HeroSection from "@/components/modules/Home/HeroSection"
import ExploreCategorySection from "@/components/modules/Home/ExploreCategorySection"
import FeaturedTutor from "@/components/modules/Home/FeaturedTutor"
import { tutorService } from "@/services/tutor.service"
import HowItsWork from "@/components/modules/Home/HowItsWork"
import ReadyToTakeSkill from "@/components/modules/Home/ReadyToTakeSkill"
import WhatStudentSaysModule from "@/components/modules/Home/WhatStudentSaysModule"
import { bookingService } from "@/services/booking.service"
import { reviewService } from "@/services/review.service"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SkillBridge | Learn from Expert Tutors",
  description: "SkillBridge is the ultimate platform for students to connect with expert tutors. Improve your skills with personalized one-on-one sessions.",
}

export default async function Home() {
  const { data: tutors } = await tutorService.getAllTutor(undefined, { revalidate: 10 });
  const totalTutors = tutors?.pagination?.total || 0;
  const { data } = await bookingService.getBookingSuccessRate();
  const { data: featuredReviews } = await reviewService.getFeaturedReviews();

  return (
    <>
      <HeroSection totalTutors={totalTutors} successRate={data.successRate} />
      <ExploreCategorySection />
      <FeaturedTutor />
      <HowItsWork />
      <WhatStudentSaysModule reviews={featuredReviews ?? []} />
      <ReadyToTakeSkill />
    </>
  )
}
