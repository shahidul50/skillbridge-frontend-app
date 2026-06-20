import DashboardModule from "@/components/modules/dashboard/student/DashboardModule";
import { 
  getDashboardMetaDataAction, 
  getDashboardRecentBookingsAction, 
  getDashboardUpcomingSessionsAction 
} from "@/actions/student.action";
import { userService } from "@/services/user.service";

export default async function UserDashboard() {
  const metaDataResponse = await getDashboardMetaDataAction();
  const upcomingSessionsResponse = await getDashboardUpcomingSessionsAction();
  const recentBookingsResponse = await getDashboardRecentBookingsAction();

  const metaData = metaDataResponse?.data || null;
  const upcomingSessions = upcomingSessionsResponse?.data || null;
  const recentBookings = recentBookingsResponse?.data || null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <DashboardModule
        metaData={metaData}
        upcomingSessions={upcomingSessions}
        recentBookings={recentBookings}
      />
    </div>
  );
}
