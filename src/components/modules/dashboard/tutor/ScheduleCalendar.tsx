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
  onMoreLinkClick?: (arg: any) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  calendarRef,
  view,
  events,
  isLoadingEvents,
  currentTime,
  onEventClick,
  onDatesSet,
  onMoreLinkClick,
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

  // Transform calendarEvents to FullCalendar EventInput format, with a custom "more" link simulator for Month view
  const fullCalendarEvents: any[] = useMemo(() => {
    let processedRawEvents = [...events.calendarEvents];

    if (view === "month") {
      const groupedByDate: Record<string, typeof events.calendarEvents> = {};
      
      processedRawEvents.forEach(event => {
        const dateKey = event.dateISO.split('T')[0];
        if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
        groupedByDate[dateKey].push(event);
      });

      processedRawEvents = [];
      Object.keys(groupedByDate).forEach(dateKey => {
        const dayEvents = groupedByDate[dateKey];
        if (dayEvents.length > 3) {
          // Keep first 2, make 3rd a "more" link
          processedRawEvents.push(...dayEvents.slice(0, 2));
          processedRawEvents.push({
            bookingId: `fake-more-${dateKey}`,
            categoryName: `+${dayEvents.length - 2} more classes`,
            studentName: "",
            dateISO: `${dateKey}T23:59:00`,
            startTime: "11:59 PM",
            endTime: "11:59 PM",
            meetingLink: null,
            bookingStatus: "MORE",
            // We pass the full hidden events so we can show them in the modal
            _hiddenEventsForModal: dayEvents
          } as any);
        } else {
          processedRawEvents.push(...dayEvents);
        }
      });
    }

    return processedRawEvents.map((event) => {
      const isFakeMore = event.bookingStatus === "MORE";
      const startDate = isFakeMore ? new Date(event.dateISO) : parseISO(event.dateISO);
      
      let start, end, isPast = false;

      if (isFakeMore) {
        start = startDate;
        end = startDate;
      } else {
        const startTimeParsed = parse(event.startTime, "h:mm a", startDate);
        const endTimeParsed = parse(event.endTime, "h:mm a", startDate);

        start = set(startDate, {
          hours: startTimeParsed.getHours(),
          minutes: startTimeParsed.getMinutes(),
          seconds: 0,
        });

        end = set(startDate, {
          hours: endTimeParsed.getHours(),
          minutes: endTimeParsed.getMinutes(),
          seconds: 0,
        });
        isPast = end < currentTime;
      }

      return {
        id: event.bookingId,
        title: event.categoryName,
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: isFakeMore,
        extendedProps: {
          studentName: event.studentName,
          categoryName: event.categoryName,
          startTimeLabel: event.startTime,
          endTimeLabel: event.endTime,
          meetingLink: event.meetingLink,
          bookingStatus: event.bookingStatus,
          isPast,
          isFakeMore,
          hiddenEventsForModal: (event as any)._hiddenEventsForModal
        },
      };
    });
  }, [events.calendarEvents, currentTime, view]);

  return (
    <>
      <style>{`
        .fc-custom-theme .fc-event {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          height: 100% !important;
          cursor: pointer !important;
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
          eventClick={(arg) => {
             const props = arg.event.extendedProps;
             if (props.isFakeMore && onMoreLinkClick) {
                 // Trigger our custom modal
                 onMoreLinkClick({ 
                    date: arg.event.start, 
                    allSegs: props.hiddenEventsForModal || [] 
                 });
                 return;
             }
             onEventClick(arg);
          }}
          datesSet={onDatesSet}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
          dayMaxEvents={false}
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          expandRows={true}
          stickyHeaderDates={true}
          eventContent={(arg) => {
            const { studentName, categoryName, startTimeLabel, endTimeLabel, isPast, isFakeMore } = arg.event.extendedProps;
            
            if (isFakeMore) {
               return (
                  <div className="w-full text-center py-0.5 px-1 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-sm transition-colors">
                     <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {categoryName}
                     </span>
                  </div>
               );
            }

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
