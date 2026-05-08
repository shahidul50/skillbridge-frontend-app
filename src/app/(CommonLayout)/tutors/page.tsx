import FindTutorMainContent from "@/components/modules/tutors/MainContent"
import FindTutorSidebar from "@/components/modules/tutors/Sidebar"
import { Container } from "@/components/layout/Container"
import { getAllTutor } from "@/actions/tutor.action";
import { getAllCategory } from "@/actions/categories.action";
import { GetTutorParams } from "@/types";

interface ITutorsPageProps {
  searchParams: Promise<GetTutorParams>;
}

async function TutorsPage({ searchParams }: ITutorsPageProps) {
  const params = await searchParams;
  const tutorsData = await getAllTutor(params);
  const categoriesData = await getAllCategory();

  return (
    <Container className="py-10 flex flex-col lg:flex-row gap-8 items-start">
      <FindTutorSidebar categories={categoriesData?.data?.data || []} />
      <FindTutorMainContent 
        tutors={tutorsData?.data?.data || tutorsData?.data?.tutors || tutorsData?.data || []} 
        meta={tutorsData?.data?.meta || tutorsData?.data?.pagination} 
      />
    </Container>
  )
}

export default TutorsPage
