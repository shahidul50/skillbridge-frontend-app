"use client";

import React from "react";
import { format, parse, set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: any[];
  onEventClick: (eventId: string, meetingLink: string | null, status: string) => void;
  currentTime?: Date;
}

const DayEventsModal: React.FC<DayEventsModalProps> = ({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
  currentTime = new Date(),
}) => {
  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Events for {format(date, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 space-y-3 custom-scrollbar">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events scheduled for this day.
            </div>
          ) : (
            events.map((argEvent) => {
              // Extract data depending on whether we passed raw events or FullCalendar segmented events
              const eventProps = argEvent.event ? argEvent.event.extendedProps : argEvent;
              const eventId = argEvent.event ? argEvent.event.id : argEvent.bookingId;
              
              const startDateTime = eventProps.dateISO ? new Date(eventProps.dateISO) : new Date();
              
              let isPast = eventProps.isPast;
              if (isPast === undefined) {
                if (eventProps.endTime) {
                  try {
                    const endTimeParsed = parse(eventProps.endTime, "h:mm a", startDateTime);
                    const endDateTime = set(startDateTime, {
                      hours: endTimeParsed.getHours(),
                      minutes: endTimeParsed.getMinutes(),
                      seconds: 0,
                      milliseconds: 0
                    });
                    isPast = endDateTime < currentTime;
                  } catch (e) {
                    isPast = startDateTime < currentTime;
                  }
                } else {
                  isPast = startDateTime < currentTime;
                }
              }

              return (
                <div
                  key={eventId}
                  onClick={() => {
                    onEventClick(eventId, eventProps.meetingLink, eventProps.bookingStatus);
                    onClose();
                  }}
                  className={cn(
                    "flex flex-col gap-1 p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all",
                    isPast
                      ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70"
                      : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-bold",
                        isPast ? "text-slate-700 dark:text-slate-300" : "text-emerald-800 dark:text-emerald-300"
                      )}>
                        {eventProps.categoryName}
                      </span>
                      <span className={cn(
                        "text-xs font-semibold",
                        isPast ? "text-slate-500" : "text-emerald-700 dark:text-emerald-400"
                      )}>
                        Tutor: {eventProps.tutorName}
                      </span>
                    </div>
                    
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      isPast 
                        ? "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        : "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                    )}>
                      {eventProps.bookingStatus}
                    </span>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-1.5 mt-2 text-xs font-bold",
                    isPast ? "text-slate-400 dark:text-slate-500" : "text-emerald-600 dark:text-emerald-500"
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{eventProps.startTimeLabel || eventProps.startTime} - {eventProps.endTimeLabel || eventProps.endTime}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayEventsModal;
