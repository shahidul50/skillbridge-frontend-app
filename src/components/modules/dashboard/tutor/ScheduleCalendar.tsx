"use client";

import React, { useMemo, useEffect } from "react";
import { Clock } from "lucide-react";
import { parseISO, parse, set } from "date-fns";
import { cn } from "@/lib/utils";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { TScheduleEventsResponse } from "@/types";

interface ScheduleCalendarProps {
  calendarRef: React.RefObject<FullCalendar | null>;
  view: "day" | "week" | "month";
  events: TScheduleEventsResponse;
  isLoadingEvents: boolean;
  currentTime: Date;
  onEventClick: (eventData: any) => void;
  onDatesSet: (arg: any) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  calendarRef,
  view,
  events,
  isLoadingEvents,
  currentTime,
  onEventClick,
  onDatesSet,
}) => {
  // Map FullCalendar view names to our view state
  const fcViewMap: Record<string, string> = {
    day: "timeGridDay",
    week: "timeGridWeek",
    month: "dayGridMonth",
  };

  // Sync FullCalendar view when our view state changes
  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      const targetView = fcViewMap[view];
      if (api.view.type !== targetView) {
        // Use setTimeout to move this call to a macro task, 
        // avoiding the flushSync error during React's lifecycle methods
        const timeoutId = setTimeout(() => {
          api.changeView(targetView);
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [view, calendarRef]);

  // Transform calendarEvents to FullCalendar EventInput format
  const fullCalendarEvents: any[] = useMemo(() => {
    return events.calendarEvents.map((event) => {
      const startDate = parseISO(event.dateISO);
      const startTimeParsed = parse(event.startTime, "h:mm a", startDate);
      const endTimeParsed = parse(event.endTime, "h:mm a", startDate);

      const start = set(startDate, {
        hours: startTimeParsed.getHours(),
        minutes: startTimeParsed.getMinutes(),
        seconds: 0,
      });

      const end = set(startDate, {
        hours: endTimeParsed.getHours(),
        minutes: endTimeParsed.getMinutes(),
        seconds: 0,
      });

      const isPast = end < currentTime;

      return {
        id: event.bookingId,
        title: event.categoryName,
        start: start.toISOString(),
        end: end.toISOString(),
        extendedProps: {
          studentName: event.studentName,
          categoryName: event.categoryName,
          startTimeLabel: event.startTime,
          endTimeLabel: event.endTime,
          meetingLink: event.meetingLink,
          bookingStatus: event.bookingStatus,
          isPast,
        },
      };
    });
  }, [events.calendarEvents, currentTime]);

  return (
    <>
      <style>{`
        .fc-custom-theme .fc-event {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          height: 100% !important;
        }
        .fc-custom-theme .fc-event-main {
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: transparent !important;
        }
        .fc-custom-theme .fc-timegrid-event {
          box-shadow: none !important;
        }
        .fc-custom-theme .fc-daygrid-event-harness {
          margin: 1px 2px !important;
        }
        .fc-custom-theme .fc-timegrid-event-harness {
          margin: 0 !important;
        }
        /* Ensure Shadcn/Radix modals are above FullCalendar popovers */
        [data-radix-portal] {
          z-index: 99999 !important;
        }
        .fc-popover {
          z-index: 1000 !important;
        }
      `}</style>
      <div className="flex-1 relative overflow-auto p-4 fc-custom-theme">
        {isLoadingEvents && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        )}
        
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          firstDay={6}
          headerToolbar={false}
          events={fullCalendarEvents}
          eventClick={onEventClick}
          datesSet={onDatesSet}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
          dayMaxEvents={3}
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          expandRows={true}
          stickyHeaderDates={true}
          eventContent={(arg) => {
            const { studentName, categoryName, startTimeLabel, endTimeLabel, isPast } = arg.event.extendedProps;
            
            if (arg.view.type === "timeGridDay" || arg.view.type === "timeGridWeek") {
              return (
                <div className={cn(
                    "p-2 h-full w-full overflow-hidden flex flex-col justify-between group/event transition-all border-l-4 rounded-r-lg shadow-sm",
                    isPast 
                      ? "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 opacity-60" 
                      : "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500"
                )}>
                  <div>
                    <div className={cn(
                        "text-[11px] font-black leading-tight truncate flex items-center gap-1",
                        isPast ? "text-slate-600 dark:text-slate-200" : "text-emerald-800 dark:text-emerald-300"
                    )}>
                       {!isPast && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                       {categoryName}
                    </div>
                    <div className={cn(
                        "text-[10px] font-bold mt-1 truncate",
                        isPast ? "text-slate-500 dark:text-slate-400" : "text-emerald-700 dark:text-emerald-200"
                    )}>
                      Student: {studentName}
                    </div>
                  </div>
                  <div className={cn(
                      "text-[9px] font-bold mt-auto flex items-center gap-1",
                      isPast ? "text-slate-400 dark:text-slate-500" : "text-emerald-600 dark:text-emerald-400"
                  )}>
                    <Clock className="w-2.5 h-2.5" />
                    {startTimeLabel} - {endTimeLabel}
                  </div>
                </div>
              );
            }
            
            return (
              <div className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg h-full w-full overflow-hidden shadow-sm transition-all border",
                isPast 
                  ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 grayscale" 
                  : "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500/20"
              )}>
                {!isPast && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                <div className="flex flex-col min-w-0 flex-1">
                   <span className={cn(
                    "text-[10px] font-black truncate leading-none mb-0.5",
                    isPast ? "text-slate-700 dark:text-slate-100" : "text-emerald-800 dark:text-emerald-300"
                   )}>
                    {categoryName}
                   </span>
                   <span className={cn(
                    "text-[8px] font-bold truncate leading-none",
                    isPast ? "text-slate-500 dark:text-slate-400" : "text-emerald-700/70 dark:text-emerald-400/80"
                   )}>
                    {studentName}
                   </span>
                </div>
              </div>
            );
          }}
         viewDidMount={(arg) => {
           const titleEl = document.getElementById("fc-title");
           if (titleEl) titleEl.textContent = arg.view.title;
         }}
        />
      </div>
    </>
  );
};

export default ScheduleCalendar;
