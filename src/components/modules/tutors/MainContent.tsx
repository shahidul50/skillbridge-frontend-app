"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TutorCard from "./TutorCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function FindTutorMainContent({ tutors, meta }: { tutors: any[]; meta: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = meta?.totalPage || meta?.totalPages || meta?.total_pages || 1;
  const totalTutors = meta?.total || meta?.totalCount || 0;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sort); // Assuming backend uses sortBy
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Find your perfect tutor
          </h1>
          <p className="text-muted-foreground text-sm">
            <span className="font-bold text-emerald-600">{totalTutors} Tutors</span> available matching your criteria
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select
            defaultValue={searchParams.get("sortBy") || "highest-rated"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs font-medium border-border shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
              <SelectItem value="low-to-high">Lowest Price</SelectItem>
              <SelectItem value="high-to-low">Highest Price</SelectItem>
              <SelectItem value="most-reviews">Most Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(tutors) && tutors.length > 0 ? (
          tutors.map((tutor) => (
            <TutorCard key={tutor._id || tutor.id} tutor={tutor} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground">No tutors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-1">
            {pages.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                className={`size-8 rounded-lg p-0 ${
                  currentPage === page ? "bg-emerald-600 text-white" : "hover:bg-muted"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default FindTutorMainContent;
