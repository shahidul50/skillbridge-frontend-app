import { getAllCategory } from "@/actions/categories.action";
import { Container } from "@/components/layout/Container";
import { CategoryCard } from "@/components/modules/categories/CategoryCard";
import { CategorySearch } from "@/components/modules/categories/CategorySearch";
import { CategoryPagination } from "@/components/modules/categories/CategoryPagination";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

interface CategoriesPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
  }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchTerm = params.searchTerm || "";
  const limit = 12;

  const response = await getAllCategory(currentPage, limit, searchTerm);
  const categories = response?.data?.data || [];
  const pagination = response?.data?.pagination;
  const totalPages = pagination?.totalPages || 0;

  return (
    <main className="py-16 md:py-24 bg-[oklch(0.982_0.018_155.826/0.05)] min-h-screen">
      <Container>
        {/* Header Section */}
        <ScrollMotion>
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Explore All Categories
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Discover your next passion from our curated list of professional
              subjects taught by world-class mentors.
            </p>
          </div>
        </ScrollMotion>

        {/* Search Bar */}
        <ScrollMotion delay={0.1}>
          <CategorySearch />
        </ScrollMotion>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.length > 0 ? (
            categories.map((category: any, index: number) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                index={index} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-muted-foreground font-medium">
                No categories found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <ScrollMotion delay={0.2}>
          <CategoryPagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
          />
        </ScrollMotion>
      </Container>
    </main>
  );
}
