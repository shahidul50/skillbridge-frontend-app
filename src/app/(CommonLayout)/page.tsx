import { Container } from "@/components/layout/Container"
import HeroSection from "@/components/modules/Home/HeroSection"
import ExploreCategorySection from "@/components/modules/Home/ExploreCategorySection"

export default function Home() {
  return (
    <Container>
      <HeroSection />
      <ExploreCategorySection />
    </Container>
  )
}
