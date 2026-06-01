import { getDashboardStatsAction } from "@/actions/admin.action";
import DashboardModule from "@/components/modules/dashboard/admin/DashboardModule";

const AdminDashboardPage = async () => {
  const { data, error } = await getDashboardStatsAction();

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-xl font-semibold text-red-500">Error loading dashboard</h2>
        <p className="text-zinc-500">{error || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <DashboardModule stats={data} />
    </div>
  );
};

export default AdminDashboardPage;
