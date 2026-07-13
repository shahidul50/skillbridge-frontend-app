import { getAllReviewStatsByTutorProfileIdAction, getAllReviewByTutorProfileIdAction } from "@/actions/review.action";
import { getTutorProfileByProfileId } from "@/actions/tutor.action";
import { Container } from "@/components/layout/Container";
import ReviewModule from "@/components/modules/tutors/ReviewModule";
import { Metadata } from "next";

type TProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
  const resolvedParams = await params;
  const response = await getTutorProfileByProfileId(resolvedParams.id);
  const tutor = response?.data;

  if (!tutor) {
    return {
      title: "Reviews Not Found | SkillBridge",
    };
  }

  const tutorName = tutor?.user?.fullName || tutor?.user?.name || "Tutor";
  
  return {
    title: `Reviews for ${tutorName} | SkillBridge`,
    description: `Read what students are saying about ${tutorName} on SkillBridge. Check out their ratings and student feedback.`,
  };
}

export default async function TutorReviewPage({ params, searchParams }: TProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const tutorProfileId = resolvedParams.id;
  const limit = (resolvedSearchParams.limit as string) || "10";
  const page = (resolvedSearchParams.page as string) || "1";
  const sortBy = (resolvedSearchParams.sortBy as string) || "createdAt";
  const sortOrder = (resolvedSearchParams.sortOrder as any) || "most-recent";

  const [statsResponse, reviewsResponse] = await Promise.all([
    getAllReviewStatsByTutorProfileIdAction(tutorProfileId),
    getAllReviewByTutorProfileIdAction(tutorProfileId, { limit, page, sortBy, sortOrder }),
  ]);

  return (
    <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen">
      <Container className="py-8">
      <ReviewModule
        tutorProfileId={tutorProfileId}
        stats={statsResponse?.data as any}
        reviewsData={reviewsResponse?.data as any}
      />
      </Container>
    </div>
  );
}
