"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Banknote,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
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

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { TGetAllBookingByStudentIdResponse, TGetAllBookingByStudentIdMetaResponse, TGetAllBookingByStudentIdQueryParams } from "@/types";
import BookingReciptModal from "./BookingReciptModal";

interface BookingModuleProps {
  bookings: TGetAllBookingByStudentIdResponse;
  metadata: TGetAllBookingByStudentIdMetaResponse;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: "easeOut"
    },
  }),
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

export default function BookingModule({ bookings, metadata }: BookingModuleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [bookingStatus, setBookingStatus] = useState(searchParams.get("bookingStatus") || "ALL");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const updateQueryParams = (newParams: Partial<TGetAllBookingByStudentIdQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (newParams.bookingStatus !== undefined || newParams.searchTerm !== undefined) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const urlSearchTerm = searchParams.get("searchTerm") || "";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("searchTerm") || "";
      if (searchTerm !== currentSearch) {
        updateQueryParams({ searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = (value: string) => {
    setBookingStatus(value);
    const statusValue = value === "ALL" ? "" : value as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    updateQueryParams({ bookingStatus: statusValue || undefined, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page: page.toString() });
  };

  const handleLimitChange = (limit: string) => {
    updateQueryParams({ limit, page: "1" });
  };

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;
  const totalPages = bookings?.pagination?.totalPages || 1;

  const statsCards = [
    {
      title: "TOTAL INVESTMENT",
      value: `${metadata?.totalInvestment?.toLocaleString() || "0.00"} TK`,
      icon: Banknote,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
    {
      title: "LEARNING HOURS",
      value: metadata?.learningHours || "0 hrs",
      icon: Clock,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-900/40",
    },
    {
      title: "COMPLETED SESSIONS",
      value: metadata?.completedSessions ? `${metadata.completedSessions} Sessions` : "0 Sessions",
      icon: GraduationCap,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-sm w-fit min-w-[95px]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
            <span className="capitalize">{status.toLowerCase()}</span>
          </div>
        );
      case "COMPLETED":
        return (
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm w-fit min-w-[95px]">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="capitalize">{status.toLowerCase()}</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-semibold shadow-sm w-fit min-w-[95px]">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="capitalize">{status.toLowerCase()}</span>
          </div>
        );
      case "CANCELLED":
        return (
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold shadow-sm w-fit min-w-[95px]">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="capitalize">{status.toLowerCase()}</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold shadow-sm w-fit min-w-[95px]">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <span className="capitalize">{status.toLowerCase()}</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 1. Main Table Card */}
      <motion.div variants={cardVariants} className="w-full">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm dark:bg-zinc-900/40 overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          <div className="p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-zinc-900/40">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Recent Bookings</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <form onSubmit={(e) => e.preventDefault()} className="relative w-full sm:w-[280px]">
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

              <Select value={bookingStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[140px] h-10 text-sm border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-md shadow-sm font-medium">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-10 px-5 text-sm rounded-md shadow-sm transition-colors duration-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-zinc-900/40 rounded-b-xl">
            <Table>
              <TableHeader className="bg-[#fcfdfc] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6 text-center w-20">SL No</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6">Tutor Name</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6">Subject</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6">Date & Time</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6 text-center">Status</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6 text-center">Amount</TableHead>
                  <TableHead className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-4 px-6 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {bookings?.bookings?.length > 0 ? (
                    bookings.bookings.map((booking, index) => (
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
                        <TableCell className="font-medium text-center text-sm text-zinc-700 dark:text-zinc-300 py-4 px-6">
                          {(currentPage - 1) * currentLimit + index + 1 < 10 ? `0${(currentPage - 1) * currentLimit + index + 1}` : (currentPage - 1) * currentLimit + index + 1}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                              {booking.TutorImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={booking.TutorImage} alt={booking.tutorName} className="object-cover w-full h-full" />
                              ) : (
                                <span className="absolute inset-0 flex items-center justify-center font-bold text-zinc-400">{booking.tutorName.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100">{booking.tutorName}</span>
                              <span className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{booking.tutorTitle}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {Array.isArray(booking.categories) ? booking.categories.join(", ") : booking.categories}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">
                              {format(new Date(booking.availabilitySlotDate), "MMM dd, yyyy")}
                            </span>
                            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {booking.availabilityStartTime} - {booking.availabilityEndTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-4 px-6">
                          {renderStatus(booking.status)}
                        </TableCell>
                        <TableCell className="font-semibold text-[15px] text-center text-zinc-900 dark:text-zinc-100 py-4 px-6">
                          Tk {booking.price?.toLocaleString() || "0"}
                        </TableCell>
                        <TableCell className="text-center py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className="inline-block"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:text-indigo-300 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-full shadow-sm transition-all duration-300 group-hover:shadow-md"
                              title="View Action"
                              disabled={booking.status !== "CONFIRMED" && booking.status !== "COMPLETED"}
                              onClick={() => {
                                setSelectedBookingId(booking.id);
                                setIsReceiptModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </motion.div>
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
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                          <p>No bookings found.</p>
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
                Showing {(currentPage - 1) * currentLimit + 1} to {Math.min(currentPage * currentLimit, bookings?.pagination?.total || 0)} of {bookings?.pagination?.total || 0} bookings
              </p>

              <div className="flex items-center gap-2 ml-0 sm:ml-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Show Items</span>
                <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
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
                    .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && <span className="text-zinc-400 px-1">...</span>}
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

      {/* 2. Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {statsCards.map((card, index) => (
          <motion.div key={index} variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm dark:bg-zinc-900/50 hover:shadow-lg transition-all duration-300 rounded-xl bg-white cursor-default group">
              <CardContent className="p-6 md:p-8 flex items-center gap-5">
                <div
                  className={`${card.iconBg} p-4 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <card.icon
                    className={`h-7 w-7 ${card.iconColor}`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
                    {card.title}
                  </p>
                  <h3 className="text-[26px] font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                    {card.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <BookingReciptModal 
        isOpen={isReceiptModalOpen}
        onOpenChange={setIsReceiptModalOpen}
        bookingId={selectedBookingId}
      />
    </motion.div>
  );
}
