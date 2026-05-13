import { getAllCategory } from "@/actions/categories.action";
import { getTutorSelectedCategories } from "@/actions/tutor.action";
import { MySubjectModule } from "@/components/modules/dashboard/tutor/MySubjectModule";

export default async function MySubjectPage() {
  // Fetch all categories
  const categoriesRes = await getAllCategory(1, 100); // Fetching 100 to get all for selection
  const categories = categoriesRes?.data?.data || [];

  // Fetch tutor selected categories
  const selectedRes = await getTutorSelectedCategories();
  const selectedData = selectedRes?.data || [];

  // Extract initial selected category IDs
  const initialSelectedIds =
    selectedData?.map((tc: any) => tc.category?.id).filter(Boolean) || [];

  return (
    <div className="py-8">
      <MySubjectModule
        allCategories={categories}
        initialSelectedIds={initialSelectedIds}
      />
    </div>
  );
}
