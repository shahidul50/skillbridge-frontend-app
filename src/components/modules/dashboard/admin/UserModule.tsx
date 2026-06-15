"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Eye, Ban, CheckCircle, Loader2, X } from "lucide-react";
import { TUser, TUserParams } from "@/types/admin.type";
import { bannedUserAccountAction, getUserProfileDetailsByUserIdAction } from "@/actions/admin.action";
import { format } from "date-fns";
import { toast } from "sonner";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { TStudentProfileResponse, TTutorProfileResponse } from "@/types/admin.type";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

interface UserModuleProps {
  initialData: TUser[] | any;
  initialMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UserModule({ initialData, initialMeta }: UserModuleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<TTutorProfileResponse | TStudentProfileResponse | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Local state for instant UI feedback on search
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

  // Extract actual user data array
  const users = (Array.isArray(initialData) ? initialData : initialData?.data) || [];
  const meta = initialMeta;
  const totalPages = meta.totalPages || Math.ceil(meta.total / (meta.limit || 10)) || 1;

  // Helper to update URL search params
  const updateParams = (updates: TUserParams) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 if any filter other than page changes
    if (!updates.page) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Debounce search term update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("searchTerm") || "")) {
        updateParams({ searchTerm });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage });
    }
  };

  const handleToggleUserStatus = async (id: string, currentStatus: boolean) => {
    const toastId = toast.loading("Updating user status...");
    try {
      const res = await bannedUserAccountAction(id, { isActive: !currentStatus });
      if (res.error) {
        toast.error(res.error, { id: toastId });
      } else {
        toast.success(`User successfully ${!currentStatus ? "activated" : "banned"}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const handleViewProfile = async (id: string) => {
    setIsFetchingProfile(true);
    const toastId = toast.loading("Fetching user profile...");
    try {
      const res = await getUserProfileDetailsByUserIdAction(id);
      if (res.error) {
        toast.error(res.error, { id: toastId });
      } else if (res.data) {
        toast.dismiss(toastId);
        
        // Safely handle potentially nested data structure
        const profile = (res.data as any)?.data || res.data;
        setActiveProfile(profile);
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to fetch profile", { id: toastId });
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveProfile(null);
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="container mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
            {isPending && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>
        <p className="text-muted-foreground">
          Oversee and manage student and tutor accounts.
        </p>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-5 rounded-xl border border-border shadow-sm"
      >
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 h-11 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select
            value={searchParams.get("role") || "all"}
            onValueChange={(value) => updateParams({ role: value })}
          >
            <SelectTrigger className="w-full md:w-[160px] h-11 bg-background">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="TUTOR">Tutor</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("isActive") || "all"}
            onValueChange={(value) => {
              if (value === "all") updateParams({ isActive: undefined });
              else updateParams({ isActive: value === "true" });
            }}
          >
            <SelectTrigger className="w-full md:w-[160px] h-11 bg-background">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-border bg-card overflow-hidden shadow-sm relative"
      >
        {isPending && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider">USER</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider">ROLE</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider">STATUS</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider">JOINING DATE</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-xs tracking-wider text-right">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout" initial={false}>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-20 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-10 w-10 opacity-20" />
                      <p className="text-lg">
                        No users found match your criteria.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: TUser, index: number) => (
                  <motion.tr
                    key={user.id}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="hover:bg-muted/30 transition-colors border-b"
                  >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-border shadow-sm">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground break-all max-w-[150px] md:max-w-none">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      variant="secondary"
                      className="uppercase font-bold tracking-wider rounded-md h-7 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-none shadow-none"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                      <span className="text-sm font-medium">
                        {user.isActive ? "Active" : "Banned"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                          title="View Profile"
                          onClick={() => handleViewProfile(user.id)}
                          disabled={isFetchingProfile}
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-9 w-9 transition-all ${
                            user.isActive
                              ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                              : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          }`}
                          title={user.isActive ? "Ban User" : "Activate User"}
                          onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                          disabled={isPending}
                        >
                          {user.isActive ? (
                            <Ban className="h-4.5 w-4.5" />
                          ) : (
                            <CheckCircle className="h-4.5 w-4.5" />
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
        <div className="flex items-center gap-4 order-2 sm:order-1">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Showing <span className="font-bold text-foreground">{users.length}</span> of{" "}
            <span className="font-bold text-foreground">{meta.total}</span> users
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={(searchParams.get("limit") || "10").toString()}
              onValueChange={(v) => updateParams({ limit: Number(v), page: 1 })}
            >
              <SelectTrigger className="w-[70px] h-8 bg-card shadow-none border-border">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground whitespace-nowrap">per page</span>
          </div>
        </div>

        <div className="order-1 sm:order-2">
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    className={meta.page === 1 ? "pointer-events-none opacity-30" : "cursor-pointer hover:bg-primary/10"}
                    onClick={() => handlePageChange(meta.page - 1)}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    const currentPage = meta.page;
                    return p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1);
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsis && <span className="text-muted-foreground px-1">...</span>}
                        <PaginationItem>
                          <PaginationLink
                            isActive={meta.page === page}
                            className="cursor-pointer h-9 w-9 rounded-md transition-all"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </div>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    className={meta.page === totalPages ? "pointer-events-none opacity-30" : "cursor-pointer hover:bg-primary/10"}
                    onClick={() => handlePageChange(meta.page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <ProfileDetailsModal
        isOpen={isModalOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
        data={activeProfile}
      />
    </motion.div>
  );
}
