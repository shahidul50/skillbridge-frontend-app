"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  MessageSquarePlus,
  Send,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  TGetAllBookingWithReview,
  TGetAllBookingWithReviewResponse,
  TGetAllBookingWithReviewQueryParams,
} from "@/types/review.type";
import { createReviewAction } from "@/actions/review.action";

interface ReviewModuleProps {
  reviewData: TGetAllBookingWithReviewResponse;
}

/* ── animation variants ── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

/* ── star rating renderer ── */
function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onRate,
  size = "sm",
}: {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (star: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const filled = interactive
          ? starIndex <= (hovered || rating)
          : starIndex <= rating;

        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive}
            className={`transition-transform duration-150 ${
              interactive
                ? "cursor-pointer hover:scale-125 active:scale-95"
                : "cursor-default"
            }`}
            onClick={() => interactive && onRate?.(starIndex)}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(0)}
          >
            <Star
              className={`${sizeMap[size]} transition-colors duration-150 ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-200 text-zinc-300 dark:fill-zinc-700 dark:text-zinc-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewModule({ reviewData }: ReviewModuleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [reviewFilter, setReviewFilter] = useState(
    searchParams.get("reviewStatus") || "ALL"
  );

  /* ── add‑review dialog state ── */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<TGetAllBookingWithReview | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── query param helpers ── */
  const updateQueryParams = (
    newParams: Partial<TGetAllBookingWithReviewQueryParams>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (
      newParams.reviewStatus !== undefined ||
      newParams.searchTerm !== undefined
    ) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  /* sync URL search back to state */
  useEffect(() => {
    const urlSearchTerm = searchParams.get("searchTerm") || "";
    if (urlSearchTerm !== searchTerm) setSearchTerm(urlSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* debounced search */
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("searchTerm") || "";
      if (searchTerm !== currentSearch) updateQueryParams({ searchTerm });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleFilterChange = (value: string) => {
    setReviewFilter(value);
    const filterValue =
      value === "ALL"
        ? undefined
        : (value as "Reviewed" | "Unreviewed");
    updateQueryParams({ reviewStatus: filterValue, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleLimitChange = (limit: string) => {
    updateQueryParams({ limit: Number(limit), page: 1 });
  };

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;
  const totalPages = reviewData?.pagination?.totalPages || 1;

  /* ── open the review dialog ── */
  const openReviewDialog = (booking: TGetAllBookingWithReview) => {
    setSelectedBooking(booking);
    setNewRating(0);
    setNewComment("");
    setIsDialogOpen(true);
  };

  /* ── submit a review ── */
  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    if (newRating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReviewAction({
        bookingId: selectedBooking.id,
        rating: newRating,
        comment: newComment || "",
      });

      if (result?.error) {
        toast.error(result.error as string);
      } else {
        toast.success("Review submitted successfully!");
        setIsDialogOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── render action column ── */
  const renderAction = (booking: TGetAllBookingWithReview) => {
    if (booking.review) {
      return (
        <div className="flex flex-col items-center gap-1">
          <StarRating rating={booking.review.rating} />
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Review Submitted
          </span>
        </div>
      );
    }

    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-full px-5 h-8 shadow-sm transition-all duration-300"
          onClick={() => openReviewDialog(booking)}
        >
          Add Review
        </Button>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ── Submission Policy Alert ── */}
      <motion.div variants={cardVariants}>
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 md:p-5">
          <div className="shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60">
              <Info className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">
              Submission Policy
            </h3>
            <p className="text-[13px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5 leading-relaxed">
              Reviews are permanent once submitted. You will not be able to edit
              or delete your feedback once it is published on a tutor&apos;s
              profile.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Main Table Card ── */}
      <motion.div variants={cardVariants} className="w-full">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm dark:bg-zinc-900/40 overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          {/* Table Header / Controls */}
          <div className="p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-zinc-900/40">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Recent Completed Bookings
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative w-full sm:w-[280px]"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, subject and date"
                  className="pl-9 pr-9 h-10 text-sm border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500 dark:bg-zinc-800 dark:text-white rounded-md shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>

              <Select value={reviewFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[140px] h-10 text-sm border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-md shadow-sm font-medium">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Unreviewed">Unreviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white dark:bg-zinc-900/40 rounded-b-xl">
            <Table>
              <TableHeader className="bg-[#fcfdfc] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6">
                    Tutor
                  </TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6">
                    Subject
                  </TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6 text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6 text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {reviewData?.data?.length > 0 ? (
                    reviewData.data.map((booking, index) => (
                      <motion.tr
                        key={booking.id || index}
                        custom={index}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="border-b border-zinc-100 dark:border-zinc-800/50 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group"
                      >
                        {/* Tutor */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                              {booking.TutorImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={booking.TutorImage}
                                  alt={booking.tutorName}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <span className="absolute inset-0 flex items-center justify-center font-bold text-zinc-400">
                                  {booking.tutorName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100">
                                {booking.tutorName}
                              </span>
                              <span className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {booking.tutorTitle}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Subject */}
                        <TableCell className="py-4 px-6">
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {Array.isArray(booking.categories)
                              ? booking.categories.join(", ")
                              : booking.categories}
                          </span>
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
                              {format(
                                new Date(booking.availabilitySlotDate),
                                "MMM dd, yyyy"
                              )}
                            </span>
                            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {booking.availabilityStartTime} -{" "}
                              {booking.availabilityEndTime}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center py-4 px-6">
                          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-sm w-fit min-w-[95px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
                            <span className="capitalize">
                              {booking.status.toLowerCase()}
                            </span>
                          </div>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="text-center py-4 px-6">
                          {renderAction(booking)}
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      key="empty-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                          <p>No completed bookings found.</p>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          <div className="p-4 md:py-4 md:px-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 rounded-b-xl">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                Showing{" "}
                {(currentPage - 1) * currentLimit + 1} to{" "}
                {Math.min(
                  currentPage * currentLimit,
                  reviewData?.pagination?.total || 0
                )}{" "}
                of {reviewData?.pagination?.total || 0} bookings
              </p>

              <div className="flex items-center gap-2 ml-0 sm:ml-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  Show Items
                </span>
                <Select
                  value={currentLimit.toString()}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="h-8 w-16 text-sm border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 rounded-md shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination className="w-auto mx-0">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis =
                        prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="text-zinc-400 px-1">...</span>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => handlePageChange(page)}
                              className={`h-8 w-8 text-[13px] font-semibold cursor-pointer rounded-md transition-all duration-300 ${
                                currentPage === page
                                  ? "bg-emerald-700 text-white hover:bg-emerald-800 hover:text-white shadow-sm"
                                  : "hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </div>
                      );
                    })}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </Card>
      </motion.div>

      {/* ── Add Review Dialog ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <MessageSquarePlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Add Review
            </DialogTitle>
            <DialogDescription>
              Share your experience with{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedBooking?.tutorName}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Tutor info mini card */}
            {selectedBooking && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50">
                <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 shrink-0 border border-zinc-200 dark:border-zinc-600">
                  {selectedBooking.TutorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedBooking.TutorImage}
                      alt={selectedBooking.tutorName}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-zinc-400 text-sm">
                      {selectedBooking.tutorName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {selectedBooking.tutorName}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {Array.isArray(selectedBooking.categories)
                      ? selectedBooking.categories.join(", ")
                      : selectedBooking.categories}
                  </span>
                </div>
              </div>
            )}

            {/* Star rating */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={newRating}
                  interactive
                  onRate={setNewRating}
                  size="lg"
                />
                {newRating > 0 && (
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {newRating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Comment{" "}
                <span className="text-xs text-zinc-400 font-normal">
                  (Optional)
                </span>
              </label>
              <Textarea
                placeholder="Share details about your experience with this tutor..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-24 resize-none text-sm dark:bg-zinc-800 dark:border-zinc-700"
                maxLength={500}
              />
              <p className="text-[11px] text-zinc-400 text-right">
                {newComment.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
              className="dark:border-zinc-700 dark:text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || newRating === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
