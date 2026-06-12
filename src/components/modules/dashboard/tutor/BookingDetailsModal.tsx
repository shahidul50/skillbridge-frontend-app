"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  Star, 
  Loader2,
  Quote
} from "lucide-react";
import { getSessionDetailsByBookingIdAction } from "@/actions/tutor.action";
import { TBookingDetailsResponse } from "@/types";
import { toast } from "sonner";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
}

const BookingDetailsModal = ({
  isOpen,
  onClose,
  bookingId,
}: BookingDetailsModalProps) => {
  const [data, setData] = useState<TBookingDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId || !isOpen) return;
      
      setLoading(true);
      try {
        const response = await getSessionDetailsByBookingIdAction(bookingId);
        if (response.error) {
          toast.error(response.error);
          onClose();
        } else {
          setData(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch session details");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, isOpen, onClose]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`h-4 w-4 ${
          idx < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-foreground font-outfit">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading details...</p>
          </div>
        ) : data ? (
          <div className="p-6 pt-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-background ring-1 ring-border shadow-md">
                  <AvatarImage src={data.studentImage} alt={data.studentName} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                    {data.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-foreground font-outfit leading-tight">
                    {data.studentName}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {data.categories.join(", ")}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 border-none px-3 py-1 font-bold text-[10px] tracking-wider uppercase">
                {data.status}
              </Badge>
            </div>

            <div className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-6 grid grid-cols-2 gap-6 relative overflow-hidden group">
               <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                       <Calendar className="h-3 w-3" /> DATE & TIME
                    </p>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">
                            {new Date(data.availabilitySlotDate).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <span className="font-semibold text-muted-foreground text-xs">
                             {data.availabilityStartTime} to {data.availabilityEndTime}
                        </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                       <LinkIcon className="h-3 w-3" /> MEETING LINK
                    </p>
                    <a 
                      href={data.meetingLink || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold text-sm truncate block"
                    >
                      {data.meetingLink?.replace(/^https?:\/\//, '') || "No link provided"}
                    </a>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                       <Clock className="h-3 w-3" /> DURATION
                    </p>
                    <span className="font-bold text-foreground text-sm">
                        {data.duration} Minutes
                    </span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground font-outfit">Student Review</h4>
                  <div className="flex items-center gap-1">
                    {renderStars(data.review?.rating || 0)}
                  </div>
               </div>

               <div className="relative bg-background border border-border/50 rounded-2xl p-5 italic text-muted-foreground text-sm leading-relaxed shadow-sm">
                  <Quote className="absolute -top-3 -left-1 h-6 w-6 text-primary/10 fill-primary/10 -rotate-12" />
                  {data.review?.comment || "No review provided for this session."}
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary/40 rounded-l-2xl" />
               </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground">
            No data found for this booking.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
