"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateBookingStatusAction } from "@/actions/tutor.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BookingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  initialMeetingLink: string | null;
  initialStatus: string;
  onSuccess?: () => void;
}

const BookingUpdateModal = ({
  isOpen,
  onClose,
  bookingId,
  initialMeetingLink,
  initialStatus,
  onSuccess,
}: BookingUpdateModalProps) => {
  const [meetingLink, setMeetingLink] = useState(initialMeetingLink || "");
  const [status, setStatus] = useState<"CONFIRMED" | "COMPLETED">(
    initialStatus as "CONFIRMED" | "COMPLETED"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMeetingLink(initialMeetingLink || "");
      setStatus(initialStatus as "CONFIRMED" | "COMPLETED");
    }
  }, [isOpen, initialMeetingLink, initialStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;

    if (!meetingLink.trim()) {
      toast.error("Please provide a meeting link");
      return;
    }

    setLoading(true);
    try {
      const response = await updateBookingStatusAction(bookingId, {
        status,
        meetingLink,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Booking updated successfully");
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-outfit">
            Add Meeting Link or Update Status
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Provide the meeting URL for this session (e.g., Zoom, Google Meet) and
            if session is completed then update the booking status.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meetingLink" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Meeting Link
              </Label>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="h-12 bg-muted/30 border-input focus:bg-background rounded-xl transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as "CONFIRMED" | "COMPLETED")}
              >
                <SelectTrigger className="w-full h-12 bg-muted/30 border-input rounded-xl">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-12 px-6 rounded-xl font-bold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !meetingLink.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingUpdateModal;
