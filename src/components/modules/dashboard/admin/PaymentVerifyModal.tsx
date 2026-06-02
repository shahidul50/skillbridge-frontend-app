"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TPayment, TPaymentVerifyStatus } from "@/types/admin.type";
import { verifyPaymentTransactionForAdminDashboardAction } from "@/actions/payment.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PaymentVerifyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payment: TPayment | null;
}

const PaymentVerifyModal = ({
  isOpen,
  onOpenChange,
  payment,
}: PaymentVerifyModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<TPaymentVerifyStatus | undefined>(
    undefined
  );
  const router = useRouter();

  // Reset selected status when modal opens/changes
  useEffect(() => {
    if (payment) {
      const currentStatus = payment.status as string;
      if (currentStatus === "SUCCESS" || currentStatus === "FAILED") {
        setSelectedStatus(currentStatus as TPaymentVerifyStatus);
      } else {
        setSelectedStatus(undefined);
      }
    }
  }, [payment, isOpen]);

  const handleUpdateStatus = async () => {
    if (!payment || !selectedStatus) return;

    startTransition(async () => {
      const result = await verifyPaymentTransactionForAdminDashboardAction(
        payment.paymentId,
        { status: selectedStatus as TPaymentVerifyStatus }
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Payment status updated to ${selectedStatus.toLowerCase()}`);
        onOpenChange(false);
        router.refresh();
      }
    });
  };

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl dark:bg-zinc-900">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Update Payment Status
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Info Card */}
          <div className="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl p-5 border border-emerald-100/50 dark:border-emerald-500/10">
            <div className="grid grid-cols-2 gap-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Transaction ID
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                  #{payment.transactionId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Amount
                </p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Tk {payment.amount.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Student Name
                </p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {payment.studentName}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Payment Status
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => setSelectedStatus(val as TPaymentVerifyStatus)}
            >
              <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-emerald-500 font-medium">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
                <SelectItem value="SUCCESS" className="py-3 font-semibold text-emerald-600 dark:text-emerald-400">Success</SelectItem>
                <SelectItem value="FAILED" className="py-3 font-semibold text-red-600 dark:text-red-400">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending || !selectedStatus || selectedStatus === payment.status}
            onClick={handleUpdateStatus}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 rounded-xl h-11 shadow-lg shadow-emerald-700/20"
          >
            {isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentVerifyModal;
