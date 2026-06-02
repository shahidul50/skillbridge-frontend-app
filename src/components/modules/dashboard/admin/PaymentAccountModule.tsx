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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  PlusCircle,
  Pencil,
  X,
  FileDown,
} from "lucide-react";
import {
  TPaymentAccount,
  TPaymentAccountParams,
  TPaymentAccountResponse,
} from "@/types/admin.type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddPaymentAccountModal from "./AddPaymentAccountModal";

interface PaymentAccountModuleProps {
  accounts: TPaymentAccountResponse;
  searchParams: TPaymentAccountParams;
}

const PaymentAccountModule = ({
  accounts,
  searchParams,
}: PaymentAccountModuleProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.searchTerm || "");

  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TPaymentAccount | null>(null);

  // Sync searchTerm with URL params
  useEffect(() => {
    const urlSearchTerm = urlSearchParams.get("searchTerm") || "";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [urlSearchParams]);

  // Handle URL updates
  const updateQueryParams = (newParams: Partial<TPaymentAccountParams>) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (newParams.searchTerm !== undefined || "isActive" in newParams) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
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
    let isActive: boolean | undefined = undefined;
    if (status === "active") isActive = true;
    if (status === "inactive") isActive = false;
    updateQueryParams({ isActive });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleLimitChange = (limit: string) => {
    updateQueryParams({ limit: Number(limit), page: 1 });
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: TPaymentAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Add Payment Account
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Configure a new disbursement method for tutor payouts and system transactions. 
            These accounts will be used for automated weekly settlements.
          </p>
        </div>
        <Button 
          onClick={handleAddAccount}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 px-6 h-12 rounded-xl shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Add Account
        </Button>
      </div>

      <hr className="border-zinc-100 dark:border-zinc-800" />

      {/* Table Section */}
      <Card className="border-none shadow-sm dark:bg-zinc-900/50 overflow-hidden">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800 px-6">
          <CardTitle className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
            Platform Payment Accounts
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search method, account number...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500 h-11 rounded-xl transition-all font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Select 
              value={
                searchParams.isActive?.toString() === "true" 
                  ? "active" 
                  : searchParams.isActive?.toString() === "false" 
                  ? "inactive" 
                  : "all"
              } 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[130px] bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 h-11 rounded-xl font-bold">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="font-bold">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 h-11 px-5 rounded-xl transition-all shadow-lg shadow-emerald-700/10 active:scale-95">
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50/50 border-b border-zinc-100 dark:border-zinc-800">
                  <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-widest py-5 pl-8">
                    SL
                  </TableHead>
                  <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-widest py-5">
                    ACCOUNT TYPE
                  </TableHead>
                  <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-widest py-5">
                    ACCOUNT METHOD
                  </TableHead>
                  <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-widest py-5">
                    ACCOUNT NUMBER
                  </TableHead>
                  <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-widest py-5">
                    STATUS
                  </TableHead>
                  <TableHead className="font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-widest py-5 text-center pr-8">
                    ACTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-zinc-500 font-medium italic">
                      No payment accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.data.map((account, index) => (
                    <TableRow 
                      key={account.id} 
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 transition-colors"
                    >
                      <TableCell className="pl-8 font-bold text-zinc-500">
                        {String(index + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                        {account.accountType}
                      </TableCell>
                      <TableCell className="font-black text-zinc-900 dark:text-zinc-100">
                        {account.method}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-zinc-600 dark:text-zinc-400">
                        {account.accountNumber}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`rounded-full px-3 py-1 border-none font-bold text-[10px] uppercase tracking-wider ${
                            account.isActive 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${account.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                          {account.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center pr-8">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-emerald-600"
                          onClick={() => handleEditAccount(account)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Footer Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-[13px] font-bold text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                Showing <span className="text-zinc-900 dark:text-zinc-100">{accounts.data.length}</span> of <span className="text-zinc-900 dark:text-zinc-100">{accounts.pagination.total}</span> accounts
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span>Show Items:</span>
                
                  <Select 
                  value={accounts.pagination.limit.toString()} 
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="h-8 w-16 text-xs border-zinc-200 dark:border-zinc-800">
                    <SelectValue placeholder={accounts.pagination.limit} />
                  </SelectTrigger>
                  <SelectContent className="min-w-[70px] font-normal">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {accounts.pagination.totalPages > 1 && (
              <Pagination className="w-auto lg:mx-0">
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious 
                      className={`h-10 w-10 p-0 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer ${accounts.pagination.page === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handlePageChange(accounts.pagination.page - 1)}
                    />
                  </PaginationItem>
                  
                  {[...Array(accounts.pagination.totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={accounts.pagination.page === i + 1}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl font-black transition-all cursor-pointer ${
                          accounts.pagination.page === i + 1 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md border-none' 
                          : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      className={`h-10 w-10 p-0 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer ${accounts.pagination.page === accounts.pagination.totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handlePageChange(accounts.pagination.page + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      <AddPaymentAccountModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        account={selectedAccount}
      />
    </div>
  );
};

export default PaymentAccountModule;
