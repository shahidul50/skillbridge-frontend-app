"use client";

import { useEffect, useState, useRef } from "react";
import { X, Check, Download, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { getBookingReciptByBookingIdAction } from "@/actions/booking.action";
import { TGetBookingReciptByBookingIdResponse } from "@/types";

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
  const [receiptData, setReceiptData] = useState<TGetBookingReciptByBookingIdResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchReceipt() {
      if (isOpen && bookingId) {
        setIsLoading(true);
        const result = await getBookingReciptByBookingIdAction(bookingId);
        if (result?.data) {
          setReceiptData(result.data);
        }
        setIsLoading(false);
      } else {
        setReceiptData(null);
      }
    }
    fetchReceipt();
  }, [isOpen, bookingId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 max-h-[90vh] flex flex-col overflow-hidden bg-white rounded-3xl border-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Booking Receipt Details</DialogTitle>
        {/* Header Strip */}
        <div className="flex shrink-0 justify-between items-center px-6 py-4 bg-[#E7F4EE] border-b border-gray-100 z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#037235] text-white rounded flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="text-sm font-semibold text-black">Booking Receipt</span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#037235]"></div>
          </div>
        ) : receiptData ? (
          <div className="pb-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {/* Branding & Invoice ID */}
            <div className="flex justify-between items-start pt-4 px-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#037235]">SkillBridge</h1>
                <p className="text-sm font-bold text-black mt-1">Booking Receipt</p>
              </div>
              <div className="px-3 py-1 bg-[#E7F4EE] rounded-full">
                <span className="text-xs font-bold tracking-wider text-[#0F7643]">
                  INVOICE #{receiptData.invoiceId}
                </span>
              </div>
            </div>

            {/* Session Title */}
            <div className="px-6 mt-2">
              <h2 className="text-xl font-bold text-gray-900">
                {receiptData.categories ? receiptData.categories.join(", ") : "Session"} Session
              </h2>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 px-6 mt-4">
              <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow-sm">
                <p className="text-[10px] tracking-wider text-gray-400 font-bold uppercase">Tutor</p>
                <p className="text-sm font-bold text-gray-800 mt-1">{receiptData.tutorName}</p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow-sm">
                <p className="text-[10px] tracking-wider text-gray-400 font-bold uppercase">Status</p>
                <div className="inline-block mt-1 text-[10px] font-bold text-[#037235] bg-[#E7F4EE] px-2 py-0.5 rounded-md">
                  {receiptData.status}
                </div>
              </div>
              <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow-sm">
                <p className="text-[10px] tracking-wider text-gray-400 font-bold uppercase">Date</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {receiptData.availabilitySlotDate && format(new Date(receiptData.availabilitySlotDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-3 bg-white shadow-sm">
                <p className="text-[10px] tracking-wider text-gray-400 font-bold uppercase">Time</p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {receiptData.availabilitySlotStartTime} - {receiptData.availabilityEndTime}
                </p>
              </div>
            </div>

            {/* Summary Section */}
            <div className="px-6 mt-4 space-y-2">
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink mx-4 text-[10px] font-bold tracking-wider text-gray-400 uppercase">Summary</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Session Fee <span className="text-xs">({receiptData.duration} mins)</span></span>
                <span className="font-bold text-gray-900">Tk {receiptData.price?.toLocaleString() || "0.00"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Platform Service Fee</span>
                <span className="font-bold text-gray-900">Tk {receiptData.platformServiceFee?.toLocaleString() || "0.00"}</span>
              </div>

              <div className="border-t border-dashed border-gray-300 my-2"></div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 italic font-medium">{receiptData.paymentMethod} <span className="not-italic">Transaction ID</span></span>
                <span className="font-semibold text-gray-800">{receiptData.trancationId || "N/A"}</span>
              </div>
            </div>

            {/* Total Amount Banner */}
            <div className="mx-6 mt-4 p-4 bg-[#037235] text-white rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] tracking-wider font-semibold text-emerald-100 uppercase">Total Amount</p>
                <p className="text-2xl font-black mt-0.5">Tk {receiptData.total?.toLocaleString() || "0.00"}</p>
              </div>
              <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <div className="bg-white text-[#037235] rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-3" />
                </div>
                <span className="text-[9px] font-extrabold tracking-wider text-white uppercase">
                  PAID VIA {receiptData.paymentMethod}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 px-6 mt-6">
              <button className="flex-1 bg-[#037235] text-white hover:bg-emerald-800 transition-colors py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase shadow-sm hover:shadow">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="border border-[#037235] text-[#037235] hover:bg-[#E7F4EE] transition-colors py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase shadow-sm hover:shadow"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No receipt data found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
