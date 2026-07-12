import HeroSection from "@/components/modules/Home/HeroSection"
import ExploreCategorySection from "@/components/modules/Home/ExploreCategorySection"
import FeaturedTutor from "@/components/modules/Home/FeaturedTutor"
import { tutorService } from "@/services/tutor.service"
import HowItsWork from "@/components/modules/Home/HowItsWork"
import ReadyToTakeSkill from "@/components/modules/Home/ReadyToTakeSkill"
import { bookingService } from "@/services/booking.service"

export default async function Home() {
  const { data: tutors } = await tutorService.getAllTutor(undefined, { revalidate: 10 });
  const totalTutors = tutors?.pagination?.total || 0;
  const {data} = await bookingService.getBookingSuccessRate();
  return (
    <>
      <HeroSection totalTutors={totalTutors} successRate={data.successRate}/>
      <ExploreCategorySection />
      <FeaturedTutor />
      <HowItsWork />
      <ReadyToTakeSkill />
    </>
  )
}
