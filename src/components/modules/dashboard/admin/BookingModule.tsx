"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Search,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  TBooking,
  TBookingParams,
  TBookingResponse,
  TBookingStatsResponse,
} from "@/types/admin.type";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import BookingReciptModal from "./BookingReciptModal";

interface BookingModuleProps {
  bookings: TBookingResponse;
  stats: TBookingStatsResponse;
}

export default function BookingModule({ bookings, stats }: BookingModuleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [bookingStatus, setBookingStatus] = useState(searchParams.get("bookingStatus") || "all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Handle URL updates
  const updateQueryParams = (newParams: Partial<TBookingParams>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 if filter changes
    if (newParams.bookingStatus || newParams.searchTerm) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Sync searchTerm state with URL parameters (for browser back/forward navigation)
  useEffect(() => {
    const urlSearchTerm = searchParams.get("searchTerm") || "";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

  // Handle automated search with debounce
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
    updateQueryParams({ bookingStatus: value });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleLimitChange = (limit: string) => {
    updateQueryParams({ limit: Number(limit), page: 1 });
  };

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;
  const totalPages = bookings?.pagination?.totalPages || 1;

  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings?.toLocaleString() || "0",
      description: `${stats.bookingGrowthMetric > 0 ? "+" : ""}${stats.bookingGrowthMetric}% from last month`,
      icon: Calendar,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      trendIcon: stats.bookingGrowthMetric >= 0 ? TrendingUp : TrendingDown,
      trendColor: stats.bookingGrowthMetric >= 0 ? "text-emerald-500" : "text-red-500",
    },
    {
      title: "Pending Booking",
      value: stats.pendingBooking?.toString() || "0",
      description: "Waiting for tutor approval",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      title: "Completed Sessions",
      value: stats.totalCompletedSession?.toLocaleString() || "0",
      description: `${stats.sessionSuccessRate}% success rate`,
      icon: CheckCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      trendIcon: CheckCircle,
      trendColor: "text-blue-500",
    },
    {
      title: "Uncompleted Sessions",
      value: stats.uncompletedBooking?.toString() || "0",
      description: "Requires attention",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-500/10",
      trendIcon: AlertCircle,
      trendColor: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index} className="border-none shadow-sm dark:bg-zinc-900/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-default">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className={`${card.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-2">
                {card.trendIcon && <card.trendIcon className={`h-3.5 w-3.5 ${card.trendColor}`} />}
                <p className={`text-xs font-medium ${card.trendColor || "text-muted-foreground"}`}>
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-sm dark:bg-zinc-900/50 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Recent Bookings</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                className="pl-9 pr-9 h-10 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500"
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
              <SelectTrigger className="w-full sm:w-[130px] h-10 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-emerald-50/50 dark:bg-zinc-800">
              <TableRow className="border-none">
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400 text-center">SL No</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Student Name</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Tutor Name</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Subject</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Date & Time</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Amount</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400 text-center">Status</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 dark:text-emerald-400 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.data?.length > 0 ? (
                bookings.data.map((booking, index) => (
                  <TableRow key={booking.bookingId} className="border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <TableCell className="font-medium text-center">
                      {(currentPage - 1) * currentLimit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{booking.studentName}</span>
                        <span className="text-xs text-muted-foreground">{booking.studentEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{booking.tutorName}</span>
                        <span className="text-xs text-muted-foreground">{booking.tutorEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                        {Array.isArray(booking.tutorCategoryName) ? booking.tutorCategoryName.join(", ") : booking.tutorCategoryName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{format(new Date(booking.availabilitySlotDate), "MMM dd, yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{booking.availabilitySlotStartTime} - {booking.availabilitySlotEndTime}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-sm">
                      Tk {booking.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold uppercase py-1 px-3 rounded-full border-none ${
                          booking.bookingStatus === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : booking.bookingStatus === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : booking.bookingStatus === "COMPLETED"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {booking.bookingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        title="View Receipt"
                        onClick={() => {
                          setSelectedBookingId(booking.bookingId);
                          setIsReceiptModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="text-xs text-muted-foreground font-medium">
              Showing {(currentPage - 1) * currentLimit + 1} to {Math.min(currentPage * currentLimit, bookings?.pagination?.total || 0)} of {bookings?.pagination?.total || 0} bookings
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Show Items</span>
              <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="h-8 w-16 text-xs border-zinc-200 dark:border-zinc-800">
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
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
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
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="text-muted-foreground px-1">...</span>}
                        <PaginationItem>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => handlePageChange(page)}
                            className={`h-8 w-8 text-xs cursor-pointer ${
                              currentPage === page
                                ? "bg-emerald-700 text-white hover:bg-emerald-800 hover:text-white"
                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                    className="h-8 w-8"
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

      <BookingReciptModal
        isOpen={isReceiptModalOpen}
        onOpenChange={setIsReceiptModalOpen}
        bookingId={selectedBookingId}
      />
    </div>
  );
}
