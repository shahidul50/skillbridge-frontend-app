import {
  getAllBookingForAdminDashboardAction,
  getBookingStatsForAdminDashboardAction,
} from "@/actions/booking.action";
import BookingModule from "@/components/modules/dashboard/admin/BookingModule";
import { TBookingParams, TBookingResponse, TBookingStatsResponse } from "@/types/admin.type";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;

  const filterParams: TBookingParams = {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10,
    searchTerm: (query.searchTerm as string) || "",
    bookingStatus: (query.bookingStatus as string) || "",
  };

  // Fetch data concurrently
  const [bookingsRes, statsRes] = await Promise.all([
    getAllBookingForAdminDashboardAction(filterParams),
    getBookingStatsForAdminDashboardAction(),
  ]);

  const bookings = (bookingsRes?.data || {
    data: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  }) as TBookingResponse;
  
  const stats = (statsRes?.data || {
    totalBookings: 0,
    bookingGrowthMetric: 0,
    pendingBooking: 0,
    totalCompletedSession: 0,
    sessionSuccessRate: 0,
    uncompletedBooking: 0,
  }) as TBookingStatsResponse;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
        <p className="text-muted-foreground">
          View and manage all session bookings across the platform.
        </p>
      </div>
      
      <BookingModule bookings={bookings} stats={stats} />
    </div>
  );
}
