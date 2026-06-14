"use client";

import { getTutorAllSessionAction } from "@/actions/tutor.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { TBookingHistoryResponse } from "@/types";
import { 
  Search, 
  Download, 
  Edit2, 
  Eye, 
  ExternalLink,
  Loader2,
  X,
  LinkIcon
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import BookingDetailsModal from "./BookingDetailsModal";
import BookingUpdateModal from "./BookingUpdateModal";
import Link from "next/link";

const BookingHistoryModule = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<TBookingHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const status = searchParams.get("status") || "all";
  const limit = Number(searchParams.get("limit")) || 10;

  const [localSearch, setLocalSearch] = useState(searchTerm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBookingData, setSelectedBookingData] = useState<{ meetingLink: string | null; status: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        searchTerm: searchTerm || undefined,
        status: status === "all" ? undefined : status,
      };
      const response = await getTutorAllSessionAction(params);
      if (response.error) {
        toast.error(response.error);
      } else {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch booking history");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, status, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    // Reset page if filters change (except for page itself)
    if (!newParams.page) {
      params.set("page", "1");
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        updateFilters({ searchTerm: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, updateFilters]);

  const handleStatusChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };



  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string }> = {
      CONFIRMED: { className: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-100 dark:border-green-500/20" },
      COMPLETED: { className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" },
      PENDING: { className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20" },
      CANCELLED: { className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20" },
    };

    const style = statusMap[status] || { className: "" };
    return (
      <Badge variant="outline" className={`font-semibold px-3 py-1 uppercase tracking-wider text-[10px] ${style.className}`}>
        {status}
      </Badge>
    );
  };

  const renderPaginationItems = () => {
    if (!data?.pagination) return null;
    const { totalPages, page } = data.pagination;
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        onClick={() => handlePageChange(i)} 
                        isActive={page === i}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        } else if (i === page - 2 || i === page + 2) {
            items.push(<PaginationEllipsis key={i} />);
        }
    }
    return items;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground font-outfit">Booking Management</h1>
        <p className="text-muted-foreground">Oversee your session requests from students.</p>
      </div>

      <Card className="border shadow-sm overflow-hidden bg-card text-card-foreground">
        <CardContent className="p-0">
          <div className="p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, subject and date(dd/MM/YYYY)"
                  className="pl-10 pr-10 h-11 bg-muted/50 border-input focus:bg-background transition-all rounded-xl"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
                {localSearch && (
                  <button
                    onClick={() => {
                      setLocalSearch("");
                      updateFilters({ searchTerm: "" });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select defaultValue={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-[150px] h-11 bg-muted/50 border-input rounded-xl">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="default" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground transition-colors gap-2 h-11 rounded-xl px-6">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] font-bold text-muted-foreground uppercase text-xs tracking-wider text-center">SL</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider">STUDENT</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider">SUBJECT</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider">DATE & TIME</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider">STATUS</TableHead>
                  <TableHead className="text-right font-bold text-muted-foreground uppercase text-xs tracking-wider pr-6">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground font-medium">Loading bookings...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                                ) : !data?.data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-60 text-center text-muted-foreground font-medium">
                      <div className="flex flex-col items-center gap-2">
                          <Search className="h-10 w-10 opacity-20" />
                          <p>No results found matching your selection.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (

                  data?.data.map((booking, index) => (
                    <TableRow key={booking.bookingId} className="hover:bg-muted/20 transition-colors border-border group whitespace-nowrap">
                      <TableCell className="font-medium text-muted-foreground text-center">
                        {((currentPage - 1) * limit + index + 1).toString().padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border shadow-sm">
                            <AvatarImage src={booking.studentImage} alt={booking.studentName} className="object-cover" />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {booking.studentName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-foreground">{booking.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate text-muted-foreground font-medium">
                            {booking.categories.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">
                            {new Date(booking.availabilitySlotDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">
                            {booking.availabilityStartTime} - {booking.availabilityEndTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 px-1">
                           {
                            booking.status === "CONFIRMED" && booking.meetingLink &&  (
                           <Button size="sm" variant="ghost" disabled className="h-7 p-0 text-emerald-500 hover:text-emerald-400 hover:bg-transparent">
                             <LinkIcon className="w-3.5 h-3.5" />
                           </Button>
                         )
                           }
                           {booking.status === "CONFIRMED" && (
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                                onClick={() => {
                                  setSelectedBookingId(booking.bookingId);
                                  setSelectedBookingData({ meetingLink: booking.meetingLink, status: booking.status });
                                  setIsUpdateModalOpen(true);
                                }}
                             >
                                  <Edit2 className="h-4 w-4" />
                             </Button>
                           )}
                           {booking.status === "COMPLETED" && (
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                                onClick={() => {
                                  setSelectedBookingId(booking.bookingId);
                                  setIsModalOpen(true);
                                }}
                             >
                                  <Eye className="h-4 w-4" />
                             </Button>
                           )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && data?.data && data.data.length > 0 && (
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border bg-muted/10">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <p className="text-sm text-muted-foreground font-medium">
                    Showing <span className="text-foreground">{((currentPage - 1) * limit) + 1}</span> to <span className="text-foreground">{Math.min(currentPage * limit, data.pagination.total)}</span> of <span className="text-foreground">{data.pagination.total}</span> entries
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Show items:</span>
                  <Select value={limit.toString()} onValueChange={(val) => updateFilters({ limit: val, page: 1 })}>
                    <SelectTrigger className="h-9 w-[80px] bg-background border-border rounded-lg">
                      <SelectValue placeholder={limit} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {data.pagination.totalPages > 1 && (
                <Pagination className="w-auto mx-auto md:ml-auto md:mr-0">

                  <PaginationContent className="gap-1 sm:gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={`cursor-pointer h-9 px-3 rounded-lg border-border hover:bg-muted ${currentPage === 1 ? 'opacity-40 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext 
                          onClick={() => currentPage < data.pagination.totalPages && handlePageChange(currentPage + 1)}
                          className={`cursor-pointer h-9 px-3 rounded-lg border-border hover:bg-muted ${currentPage === data.pagination.totalPages ? 'opacity-40 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

            </div>
          )}

        </CardContent>
      </Card>
      
      {/* Mobile only indicator */}
      <div className="md:hidden flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest py-2 bg-muted/20 rounded-lg">
          <span className="animate-pulse">Scroll horizontally to view data</span>
      </div>

      <BookingDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBookingId(null);
        }}
        bookingId={selectedBookingId}
      />

      {selectedBookingData && (
        <BookingUpdateModal 
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedBookingId(null);
            setSelectedBookingData(null);
          }}
          bookingId={selectedBookingId}
          initialMeetingLink={selectedBookingData.meetingLink}
          initialStatus={selectedBookingData.status}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default BookingHistoryModule;
