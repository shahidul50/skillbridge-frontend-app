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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TPaymentAccount, TCreatePaymentAccount, TUpdatePaymentAccount } from "@/types/admin.type";
import { 
  createPaymentAccountForAdminDashboardAction, 
  updatePaymentAccountForAdminDashboardAction 
} from "@/actions/payment.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddPaymentAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: TPaymentAccount | null;
}

const AddPaymentAccountModal = ({
  isOpen,
  onOpenChange,
  account,
}: AddPaymentAccountModalProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState<TCreatePaymentAccount & { isActive?: boolean }>({
    method: "BKASH",
    accountType: "PERSONAL",
    accountNumber: "",
    isActive: true,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        method: account.method as any,
        accountType: account.accountType as any,
        accountNumber: account.accountNumber,
        isActive: account.isActive,
      });
    } else {
      setFormData({
        method: "BKASH",
        accountType: "PERSONAL",
        accountNumber: "",
        isActive: true,
      });
    }
  }, [account, isOpen]);

  const handleSubmit = async () => {
    if (!formData.accountNumber) {
      toast.error("Account number is required");
      return;
    }

    startTransition(async () => {
      let result;
      if (account) {
        result = await updatePaymentAccountForAdminDashboardAction(account.id, formData as TUpdatePaymentAccount);
      } else {
        result = await createPaymentAccountForAdminDashboardAction(formData as TCreatePaymentAccount);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Account ${account ? "updated" : "created"} successfully`);
        onOpenChange(false);
        startTransition(() => {
          router.refresh();
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl dark:bg-zinc-900">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {account ? "Update Payment Account" : "Add Payment Account"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Account Method */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Account Method
              </Label>
              <Select
                value={formData.method}
                onValueChange={(val) => setFormData({ ...formData, method: val as any })}
              >
                <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-emerald-500 font-medium">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold">
                  <SelectItem value="BKASH">BKASH</SelectItem>
                  <SelectItem value="NAGAD">NAGAD</SelectItem>
                  <SelectItem value="ROCKET">ROCKET</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Account Type
              </Label>
              <Select
                value={formData.accountType}
                onValueChange={(val) => setFormData({ ...formData, accountType: val as any })}
              >
                <SelectTrigger className="w-full h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-emerald-500 font-medium">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold">
                  <SelectItem value="PERSONAL">PERSONAL</SelectItem>
                  <SelectItem value="MERCHANT">MERCHANT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Account Number
              </Label>
              <Input
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Status (Only for Update) */}
            {account && (
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Account Status
                  </Label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Toggle to enable or disable this account
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 h-11"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSubmit}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 rounded-xl h-11 shadow-lg shadow-emerald-700/20"
          >
            {isPending ? (account ? "Updating..." : "Creating...") : (account ? "Update Account" : "Add Account")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentAccountModal;
