import AboutHeroModule from "@/components/modules/About/About-HeroModule";
import AboutPlatformFeatures from "@/components/modules/About/About-PlatformFeaturesModule";
import AboutOurMissionModule from "@/components/modules/About/About-OurMissionModule";
import AboutPoweredByTechModule from "@/components/modules/About/About-PoweredByTechModule";
import { bookingService } from "@/services/booking.service";
import { TGetAboutUsStatsResponse } from "@/types/bookings.type";

export const metadata = {
  title: "About Us | SkillBridge",
  description:
    "Learn about SkillBridge — a modern online tutoring platform bridging the gap between eager learners and expert mentors.",
};

const FALLBACK_STATS: TGetAboutUsStatsResponse = {
  activeStudent: 15000,
  expertTutors: 800,
  totalSessions: 45000,
  successRate: 98,
};

export default async function AboutUsPage() {
  const { data, error } = await bookingService.getAboutUsStats();
  const stats = error || !data ? FALLBACK_STATS : data;

  return (
    <main>
      <AboutHeroModule />
      <AboutOurMissionModule stats={stats} />
      <AboutPlatformFeatures />
      <AboutPoweredByTechModule />
    </main>
  );
}