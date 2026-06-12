import { getTutorProfileByProfileId } from "@/actions/tutor.action";
import TutorDetailsModule from "@/components/modules/tutors/TutorDetailsModule";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

interface ITutorDetailsPageProps {
  params: Promise<{ id: string }>;
}
 
async function TutorDetailsPage({ params }: ITutorDetailsPageProps) {
  const resolvedParams = await params;
  const response = await getTutorProfileByProfileId(resolvedParams.id);
  const tutor = response?.data;
  if (!tutor) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Tutor Profile Not Found</h2>
        <p className="text-zinc-500 mb-6">The tutor profile you are looking for does not exist or has been removed.</p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <a href="/tutors">Go to Tutors</a>
        </Button>
      </Container>
    );
  }

  return <TutorDetailsModule tutor={tutor} />;
}

export default TutorDetailsPage;
