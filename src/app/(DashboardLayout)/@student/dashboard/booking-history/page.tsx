import { Container } from "@/components/layout/Container";
import BookingModule from "@/components/modules/dashboard/student/BookingModule";
import {
  getAllBookingByStudentIdAction,
  getBookingsMetaDataByStudentIdAction,
} from "@/actions/booking.action";
import { TGetAllBookingByStudentIdQueryParams } from "@/types";

interface BookingHistoryPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function BookingHistoryPage({
  searchParams,
}: BookingHistoryPageProps) {
  const params = await searchParams;

  // Build query parameters with all required fields
  const queryParams: TGetAllBookingByStudentIdQueryParams = {
    page: params.page || "1",
    limit: params.limit || "10",
    searchTerm: params.searchTerm || "",
  };

  if (params.bookingStatus) {
    queryParams.bookingStatus = params.bookingStatus as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  }

  // Fetch data
  const [bookingsResult, metadataResult] = await Promise.all([
    getAllBookingByStudentIdAction(queryParams),
    getBookingsMetaDataByStudentIdAction(),
  ]);

  const bookings = bookingsResult?.data;
  const metadata = metadataResult?.data;

  // If bookings don't exist but no error, return empty state
  if (!bookings) {
    const errorMsg = bookingsResult?.error || metadataResult?.error || "Unable to load booking data";
    console.error("Booking History Load Error:", {
      bookingsResult,
      metadataResult,
    });

    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <h2 className="text-2xl font-bold">Unable to Load Bookings</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {errorMsg}
          </p>
          <p className="text-xs text-muted-foreground">
            Try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </Container>
    );
  }

  // Provide default metadata if not available
  const defaultMetadata = metadata || {
    totalInvestment: 0,
    learningHours: "0 hrs",
    completedSessions: "0",
  };
  return (
    <Container>
      <div className="py-6 md:py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Booking History
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Review and manage your past and upcoming learning sessions with industry experts.
          </p>
        </div>

        {/* Booking Module */}
        <BookingModule bookings={bookings} metadata={defaultMetadata} />
      </div>
    </Container>
  );
}
