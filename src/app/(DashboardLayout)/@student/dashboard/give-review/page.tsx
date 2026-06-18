import { Container } from "@/components/layout/Container";
import ReviewModule from "@/components/modules/dashboard/student/ReviewModule";
import { getAllBookingWithReviewAction } from "@/actions/review.action";
import { TGetAllBookingWithReviewQueryParams } from "@/types/review.type";

interface GiveReviewPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function GiveReviewPage({
  searchParams,
}: GiveReviewPageProps) {
  const params = await searchParams;

  const queryParams: TGetAllBookingWithReviewQueryParams = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "desc",
  };

  if (params.searchTerm) {
    queryParams.searchTerm = params.searchTerm;
  }

  if (params.reviewStatus && params.reviewStatus !== "ALL") {
    queryParams.reviewStatus = params.reviewStatus as "Reviewed" | "Unreviewed";
  }

  const result = await getAllBookingWithReviewAction(queryParams);
  const reviewData = result?.data;

  if (!reviewData) {
    const errorMsg = result?.error || "Unable to load review data";
    console.error("Give Review Page Load Error:", result);

    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <h2 className="text-2xl font-bold">Unable to Load Reviews</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {errorMsg as string}
          </p>
          <p className="text-xs text-muted-foreground">
            Try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6 md:py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Review Your Sessions
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Share your experience with your tutors for completed bookings.
          </p>
        </div>

        {/* Review Module */}
        <ReviewModule reviewData={reviewData} />
      </div>
    </Container>
  );
}
