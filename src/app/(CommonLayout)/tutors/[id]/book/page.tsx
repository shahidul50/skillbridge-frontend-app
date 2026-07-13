import { getTutorProfileByProfileId } from "@/actions/tutor.action";
import BookingModule from "@/components/modules/book/BookingModule";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { getUserSession } from "@/actions/auth.action";
import { Metadata } from "next";

interface IBookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: IBookPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const response = await getTutorProfileByProfileId(resolvedParams.id);
  const tutor = response?.data;

  if (!tutor) {
    return {
      title: "Book Tutor | SkillBridge",
    };
  }

  const tutorName = tutor?.user?.fullName || tutor?.user?.name || "Tutor";
  
  return {
    title: `Book ${tutorName} | SkillBridge`,
    description: `Book a learning session with ${tutorName} on SkillBridge. Select a time and enhance your skills.`,
  };
}

async function BookPage({ params }: IBookPageProps) {
  const resolvedParams = await params;
  const response = await getTutorProfileByProfileId(resolvedParams.id);
  const tutor = response?.data;

  const sessionResponse = await getUserSession();
  const user = sessionResponse?.data?.user;

  if (!tutor) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Tutor Not Found</h2>
        <p className="text-zinc-500 mb-6">
          The tutor profile you are looking for does not exist or has been
          removed.
        </p>
        <Button
          asChild
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
        >
          <a href="/tutors">Go to Tutors</a>
        </Button>
      </Container>
    );
  }

  return (
    <BookingModule
      user={user}
      tutor={{
        id: tutor.id,
        user: tutor.user,
        title: tutor.title,
        rating: tutor.rating,
        hourlyRate: tutor.hourlyRate,
      }}
    />
  );
}

export default BookPage;
