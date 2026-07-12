"use client";

import { TGetAllReviewByTutorProfileIdResponse, TGetAllReviewStatsByTutorProfileIdResponse } from "@/types/review.type";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import BookingModal from "@/components/shared/BookingModal";
import { motion } from "framer-motion";

interface ReviewModuleProps {
  tutorProfileId: string;
  stats: TGetAllReviewStatsByTutorProfileIdResponse;
  reviewsData: TGetAllReviewByTutorProfileIdResponse;
}

export default function ReviewModule({ tutorProfileId, stats, reviewsData }: ReviewModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (!stats) return <div className="text-center py-10">Tutor data not available.</div>;

  const { tutor, ratingBreakdown } = stats;
  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortOrder", e.target.value);
    params.set("page", "1"); // reset page on sort
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sortOrder") || "most-recent";

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-zinc-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "U";
  };

  const renderPaginationButtons = () => {
    if (!pagination) return null;
    const { page, totalPages } = pagination;
    const items = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (page <= 4) {
        items.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page > 4 && page < totalPages - 3) {
        items.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      } else {
        items.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return items.map((item, index) => {
      if (item === '...') {
        return <span key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10 text-gray-500 font-bold tracking-widest">...</span>;
      }
      return (
        <Button
          key={item}
          variant={page === item ? "default" : "outline"}
          onClick={() => handlePageChange(item as number)}
          className={`w-10 h-10 rounded-xl font-bold transition-all ${
            page === item
              ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
              : "border-gray-200 text-gray-600 dark:border-zinc-700 dark:text-zinc-300 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          {item}
        </Button>
      );
    });
  };

  return (
    <div className="w-full pb-12 lg:pb-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-zinc-400 mb-6 font-medium">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-zinc-200">Home</Link> /{" "}
        <Link href="/tutors" className="hover:text-gray-900 dark:hover:text-zinc-200">Tutors</Link> /{" "}
        <Link href={`/tutors/${tutor.profileId}`} className="hover:text-gray-900 dark:hover:text-zinc-200">{tutor.name}</Link> /{" "}
        <span className="text-gray-900 dark:text-zinc-200 font-semibold">All Reviews</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content - Left Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full min-w-0 bg-white dark:bg-zinc-900 rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-zinc-800"
        >
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-stretch gap-6 mb-8">
            {/* Stats Left */}
            <div className="flex-1 w-full">
              <h1 className="text-[28px] font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Reviews for {tutor.name}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-[22px] h-[22px] ${
                        star <= Math.round(tutor.averageRating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-gray-200 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-extrabold text-2xl text-gray-900 dark:text-white">{Number(tutor.averageRating).toFixed(1)}</span>
                <span className="text-gray-500 dark:text-zinc-400 font-medium">out of 5 • {tutor.totalReviewsCount}+ reviews</span>
              </div>

              {/* Rating Bars */}
              <div className="space-y-3">
                {[
                  { star: 5, data: ratingBreakdown?.fiveStars },
                  { star: 4, data: ratingBreakdown?.fourStars },
                  { star: 3, data: ratingBreakdown?.threeStars },
                  { star: 2, data: ratingBreakdown?.twoStars },
                  { star: 1, data: ratingBreakdown?.oneStars },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-3 text-sm">
                    <span className="w-14 text-gray-700 dark:text-zinc-300 font-semibold">{item.star} stars</span>
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-zinc-800 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-md"
                        style={{ width: `${item.data?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <span className="w-9 text-right text-gray-500 dark:text-zinc-400 font-medium">
                      {item.data?.percentage || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-zinc-800 my-8" />

          {/* Subheader and Controls */}
          <div className="flex flex-row justify-between items-center gap-4 mb-8">
            <h2 className="font-bold text-gray-900 dark:text-white text-[17px]">
              Showing {tutor.totalReviewsCount}{tutor.totalReviewsCount > 100 ? "+" : ""} Reviews
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-gray-500 dark:text-zinc-400">Sort by:</span>
              <div className="relative">
                <select 
                  value={currentSort}
                  onChange={handleSortChange}
                  className="appearance-none border border-gray-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold shadow-sm cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 transition-colors"
                >
                  <option value="most-recent">Most Recent</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="lowest-rated">Lowest Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-10">
            {reviews.map((review, i) => (
              <motion.div 
                key={review.id || i} 
                className="group"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-row justify-between mb-4 gap-3">
                  <div className="flex items-center gap-4">
                    {review.studentAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.studentAvatar}
                        alt={review.studentName}
                        className="rounded-full object-cover w-12 h-12 ring-4 ring-transparent group-hover:ring-emerald-50 dark:group-hover:ring-emerald-900/30 transition-all border border-gray-100 dark:border-zinc-800"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border border-gray-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-500 dark:text-zinc-400 text-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                        {getInitials(review.studentName)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-[15px]">
                        {review.studentName}
                      </h4>
                      <p className="text-[13px] font-medium text-gray-400 dark:text-zinc-500 mt-0.5">
                        {review.time || "Recently"}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 dark:text-zinc-300 leading-relaxed text-[15px]">
                  {review.comment}
                </p>
                {i < reviews.length - 1 && (
                  <hr className="border-gray-100 dark:border-zinc-800 mt-10 group-hover:border-gray-200 transition-colors" />
                )}
              </motion.div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-zinc-400 font-medium">No reviews found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-16 pb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="w-10 h-10 rounded-xl border-gray-200 text-gray-600 dark:border-zinc-700 dark:text-zinc-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {renderPaginationButtons()}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="w-10 h-10 rounded-xl border-gray-200 text-gray-600 dark:border-zinc-700 dark:text-zinc-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Sticky Sidebar - Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-[320px] xl:w-[340px] relative lg:sticky lg:top-24 shrink-0 z-10 lg:mb-10"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tutor.avatar || "https://github.com/shadcn.png"}
                  alt={tutor.name}
                  className="rounded-xl object-cover w-16 h-16 shadow-sm border border-gray-100 dark:border-zinc-800"
                />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-[17px] leading-tight">
                    {tutor.name}
                  </h3>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1 font-medium">
                    {tutor.pricePerSession} Tk / 60 min session
                  </p>
                </div>
              </div>

              <BookingModal tutor={tutor}>
                <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold h-12 rounded-xl text-[15px] shadow-sm shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:-translate-y-[1px] mb-6">
                  Book {tutor.name.split(" ")[0]} Now
                </Button>
              </BookingModal>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#10b981] shrink-0 mt-px" strokeWidth={2.5} />
                  <span className="text-[13px] text-gray-600 dark:text-zinc-300 font-semibold tracking-tight">100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-[18px] h-[18px] text-[#10b981] shrink-0 mt-px" strokeWidth={2.5} />
                  <span className="text-[13px] text-gray-600 dark:text-zinc-300 font-semibold tracking-tight">Instant Booking</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50/80 dark:bg-zinc-800/80 p-4 text-center border-t border-gray-100 dark:border-zinc-800">
              <Link 
                href={`/tutors/${tutor.profileId}`} 
                className="text-[#10b981] dark:text-emerald-400 font-bold text-[13px] hover:underline hover:text-[#059669] transition-colors"
              >
                View tutor profile
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
