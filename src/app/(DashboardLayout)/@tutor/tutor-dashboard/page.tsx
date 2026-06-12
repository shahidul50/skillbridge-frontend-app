import { getDashboardMetaAction, getDashboardRevenueTrendsAction } from "@/actions/tutor.action";
import DashboardModule from "@/components/modules/dashboard/tutor/DashboardModule";

export const metadata = {
  title: "Tutor Dashboard | SkillBridge",
  description: "View your tutor performance, earnings, and upcoming sessions.",
};

async function TutorDashboard() {
  const [metaRes, trendsRes] = await Promise.all([
    getDashboardMetaAction(),
    getDashboardRevenueTrendsAction({ trendPeriod: "six-month" })
  ]);

  if (!metaRes.data || !trendsRes.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return <DashboardModule meta={metaRes.data} initialTrends={trendsRes.data} />;
}

export default TutorDashboard;
