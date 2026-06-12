"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  X,
  Pencil,
} from "lucide-react";
import {
  TPayment,
  TPaymentParams,
  TPaymentResponse,
  TPaymentStatsResponse,
  TPaymentVerifyStatus,
} from "@/types/admin.type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyPaymentTransactionForAdminDashboardAction } from "@/actions/payment.action";

import PaymentVerifyModal from "./PaymentVerifyModal";

interface PaymentModuleProps {
  payments: TPaymentResponse;
  stats: TPaymentStatsResponse;
  searchParams: TPaymentParams;
}

const PaymentModule = ({
  payments,
  stats,
  searchParams,
}: PaymentModuleProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.searchTerm || "");

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);

  // Sync searchTerm with URL params
  useEffect(() => {
    const urlSearchTerm = urlSearchParams.get("searchTerm") || "";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [urlSearchParams]);

  // Handle URL updates
  const updateQueryParams = (newParams: Partial<TPaymentParams>) => {
    startTransition(() => {
      const params = new URLSearchParams(urlSearchParams.toString());
      
      // Update parameters
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === "all" || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 if searching, filtering, or changing limit
      // But only if page isn't explicitly provided in newParams
      if (
        (newParams.searchTerm !== undefined || 
         newParams.status !== undefined || 
         newParams.limit !== undefined) && 
        newParams.page === undefined
      ) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Automated search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = urlSearchParams.get("searchTerm") || "";
      if (searchTerm !== currentSearch) {
        updateQueryParams({ searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = (status: string) => {
    updateQueryParams({ status: status === "ALL" ? "" : status as any });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleLimitChange = (limit: string) => {
    updateQueryParams({ limit: Number(limit), page: 1 });
  };

  const handleVerify = async (id: string, status: TPaymentVerifyStatus) => {
    startTransition(async () => {
      const result = await verifyPaymentTransactionForAdminDashboardAction(id, {
        status,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Payment ${status.toLowerCase()} successfully`);
        router.refresh();
      }
    });
  };

  const statCardsData = [
    {
      title: "Total Earning",
      value: `Tk ${stats.totalEarning.toLocaleString()}`,
      trend: stats.earningGrowthMetric > 0 ? `+${stats.earningGrowthMetric}%` : `${stats.earningGrowthMetric}%`,
      trendValue: stats.earningGrowthMetric,
      icon: CircleDollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Pending Payments",
      value: stats.totalPendingPayments.toString(),
      trend: stats.pendingPaymentGrowthMetric > 0 ? `+${stats.pendingPaymentGrowthMetric}%` : `${stats.pendingPaymentGrowthMetric}%`,
      trendValue: stats.pendingPaymentGrowthMetric,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      title: "Successful Payments",
      value: stats.totalSuccessfulPayments.toString(),
      trend: stats.successfulPaymentGrowthMetric > 0 ? `+${stats.successfulPaymentGrowthMetric}%` : `${stats.successfulPaymentGrowthMetric}%`,
      trendValue: stats.successfulPaymentGrowthMetric,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Failed Payments",
      value: stats.totalFailedPayments.toString(),
      trend: stats.failedPaymentGrowthMetric > 0 ? `+${stats.failedPaymentGrowthMetric}%` : `${stats.failedPaymentGrowthMetric}%`,
      trendValue: stats.failedPaymentGrowthMetric,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCardsData.map((stat, index) => (
          <Card 
            key={index} 
            className="border-none shadow-sm dark:bg-zinc-900/50 overflow-hidden relative group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-t-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          >
            <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 ${stat.color.replace('text-', 'bg-')}`} />
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-5">
                <div className={`${stat.bgColor} p-3.5 rounded-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-sm group-hover:shadow-md`}>
                  <stat.icon className={`h-6 w-6 ${stat.color} transition-transform duration-500`} />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`border-none ${
                    stat.trendValue > 0 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' 
                      : stat.trendValue < 0 
                      ? 'bg-red-50 text-red-600 dark:bg-red-500/10' 
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                  } flex items-center gap-1 font-bold`}
                >
                  {stat.trendValue > 0 && <TrendingUp className="h-3 w-3" />}
                  {stat.trendValue < 0 && <TrendingDown className="h-3 w-3" />}
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Content */}
      <Card className="border-none shadow-sm dark:bg-zinc-900/50">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Payments Overview</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Detailed history of all platform transactions
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search transaction, student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 h-10 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Select 
              value={searchParams.status || "ALL"} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[140px] bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Payments</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 h-10 transition-all duration-300 transform active:scale-95 shadow-md">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
            <div className={`overflow-x-auto transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4 pl-6">
                      TRANSACTION ID
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4">
                      STUDENT NAME
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4">
                      TUTOR NAME
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4">
                      SUBJECT
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4">
                      DATE
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4">
                      AMOUNT
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4">
                      STATUS
                    </TableHead>
                    <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[11px] tracking-wider py-4 text-center pr-6">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-48 text-center text-zinc-500">
                        {isPending ? "Refreshing..." : "No transactions found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.data.map((payment) => (
                      <TableRow 
                        key={payment.paymentId} 
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 transition-colors duration-200"
                      >
                        <TableCell className="pl-6 font-mono text-[13px] font-bold text-emerald-600 dark:text-emerald-500">
                          #{payment.transactionId}
                        </TableCell>
                        <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {payment.studentName}
                        </TableCell>
                        <TableCell className="text-zinc-700 dark:text-zinc-300 capitalize">
                          {payment.tutorName}
                        </TableCell>
                        <TableCell className="text-zinc-500 dark:text-zinc-400 text-sm italic">
                          {payment.tutorCategoryName.join(", ")}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {payment.paymentSummitedDate}
                        </TableCell>
                        <TableCell className="font-extrabold text-zinc-900 dark:text-emerald-100">
                          Tk {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${
                               payment.status === "SUCCESS" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                               payment.status === "PENDING" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                               "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                             }`} />
                             <span className={`text-xs font-bold ${
                               payment.status === "SUCCESS" ? "text-emerald-600 dark:text-emerald-400" :
                               payment.status === "PENDING" ? "text-amber-600 dark:text-amber-400" :
                               "text-red-600 dark:text-red-400"
                             }`}>
                               {payment.status}
                             </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-full transition-colors group/edit"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setIsVerifyModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-zinc-400 group-hover/edit:text-emerald-600 transition-colors" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          
          {/* Footer & Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-6 py-6 border-t border-zinc-100 dark:border-zinc-800">
            {/* Left side: Showing and Show Items Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium w-full lg:w-auto">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {payments.pagination.total === 0 ? 0 : (payments.pagination.page - 1) * payments.pagination.limit + 1}
                </span> to <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {Math.min(payments.pagination.page * payments.pagination.limit, payments.pagination.total)}
                </span> of <span className="font-bold text-zinc-900 dark:text-zinc-100">{payments.pagination.total}</span> transactions
              </div>
              
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap">Show Items:</span>
                <Select 
                  value={payments.pagination.limit.toString()} 
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="w-[70px] h-9 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <SelectValue placeholder={payments.pagination.limit} />
                  </SelectTrigger>
                  <SelectContent className="min-w-[70px] dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Right side: Pagination Controls */}
            {(() => {
              const totalItems = Number(payments.pagination.total) || 0;
              const currentLimit = Number(payments.pagination.limit) || 10;
              // Use totalPage from backend, fallback to manual calculation
              const totalPages = Number(payments.pagination.totalPage) || Math.ceil(totalItems / currentLimit) || 1;
              const currentPage = Number(payments.pagination.page) || 1;

              if (totalPages <= 1) return null;

              return (
                <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                  <Pagination className="mx-0 w-auto">
                    <PaginationContent className="gap-1">
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          className={`cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg h-9 px-3 ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                      
                      {(() => {
                        const items = [];
                        
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) items.push(i);
                        } else {
                          items.push(1);
                          if (currentPage > 3) items.push("ellipsis1");
                          
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          
                          for (let i = start; i <= end; i++) items.push(i);
                          
                          if (currentPage < totalPages - 2) items.push("ellipsis2");
                          items.push(totalPages);
                        }
                        
                        return items.map((item, idx) => {
                          if (typeof item === 'string') {
                            return (
                              <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return (
                            <PaginationItem key={item}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === item}
                                className={`cursor-pointer rounded-lg font-bold transition-all duration-200 h-9 w-9 flex items-center justify-center ${
                                  currentPage === item 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md border-none' 
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(item);
                                }}
                              >
                                {item}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        });
                      })()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          className={`cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg h-9 px-3 ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      <PaymentVerifyModal
        isOpen={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentModule;
