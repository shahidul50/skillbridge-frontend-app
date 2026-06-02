"use client";

import { useEffect, useState } from "react";
import { Printer, Download, X, Loader2 } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TBookingReciptResponse } from "@/types/admin.type";
import { getBookingReceiptForAdminDashboardAction } from "@/actions/booking.action";

interface BookingReciptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string | null;
}

export default function BookingReciptModal({
  isOpen,
  onOpenChange,
  bookingId,
}: BookingReciptModalProps) {
  const [receipt, setReceipt] = useState<TBookingReciptResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!bookingId) return;
      
      setLoading(true);
      try {
        const result = await getBookingReceiptForAdminDashboardAction(bookingId);
        if (result.data) {
          setReceipt(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && bookingId) {
      fetchReceipt();
    } else {
      setReceipt(null);
    }
  }, [isOpen, bookingId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl dark:bg-zinc-950 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Booking Receipt</DialogTitle>
        </DialogHeader>
        <div className="relative p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Header */}
          <div className="flex flex-row justify-between items-start sm:items-center gap-4 pr-12">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-emerald-950 dark:text-emerald-500">
                  SkillBridge
                </h2>
              </div>
              <h3 className="text-lg font-bold mt-2 leading-none uppercase tracking-wide">Booking Receipt</h3>
            </div>
            {receipt && (
              <div className="text-left sm:text-right bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg sm:bg-transparent sm:p-0">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Invoice Number</p>
                <p className="text-sm font-bold">#{receipt.invoiceId || receipt.bookingId.slice(0, 8).toUpperCase()}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
              <p className="text-sm text-muted-foreground">Generating your receipt...</p>
            </div>
          ) : receipt ? (
            <>
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Student</p>
                  <p className="font-bold text-base leading-tight">{receipt.studentName}</p>
                  <p className="text-sm text-muted-foreground">{receipt.studentEmail}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tutor</p>
                  <p className="font-bold text-base leading-tight">{receipt.tutorName}</p>
                  <p className="text-sm text-muted-foreground">{receipt.tutorEmail}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Subject</p>
                  <p className="font-bold text-base">{receipt.tutorCategoryName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status</p>
                  <div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-bold uppercase px-3 py-0.5 rounded-full border-none ${
                        receipt.bookingStatus === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : receipt.bookingStatus === "PENDING"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : receipt.bookingStatus === "COMPLETED"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {receipt.bookingStatus}
                    </Badge>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Date & Time</p>
                  <p className="font-bold text-base">
                    {format(new Date(receipt.availabilitySlotDate), "MMM dd, yyyy")} | {receipt.availabilitySlotStartTime} - {receipt.availabilitySlotEndTime}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                <h4 className="text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3">Payment Summary</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-extrabold text-base">Tk {receipt.paidAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-semibold text-xs">{receipt.paymentMethod || "bKash (Manual)"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono font-medium text-[10px] bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {receipt.transactionId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
                <Button 
                  variant="outline" 
                  className="h-9 px-4 border-zinc-200 dark:border-zinc-800 font-bold flex items-center gap-2 text-xs"
                  onClick={() => window.print()}
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </Button>
                <Button 
                  className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No receipt data found.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
