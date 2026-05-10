import HeroSection from "@/components/modules/Home/HeroSection"
import ExploreCategorySection from "@/components/modules/Home/ExploreCategorySection"
import FeaturedTutor from "@/components/modules/Home/FeaturedTutor"
import { tutorService } from "@/services/tutor.service"
import HowItsWork from "@/components/modules/Home/HowItsWork"
import ReadyToTakeSkill from "@/components/modules/Home/ReadyToTakeSkill"

export default async function Home() {
  const { data: tutors } = await tutorService.getAllTutor();
  const totalTutors = tutors?.pagination?.total || 0;

  return (
    <>
      <HeroSection totalTutors={totalTutors} />
      <ExploreCategorySection />
      <FeaturedTutor />
      <HowItsWork />
      <ReadyToTakeSkill />
    </>
  )
}
