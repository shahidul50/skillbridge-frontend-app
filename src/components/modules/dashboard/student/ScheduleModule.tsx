"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  VideoOff
} from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO, isToday, isTomorrow, parse, set } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TSScheduleMetaDataResponse, TStudentScheduleCalendarEventResponse } from "@/types/student.type";
import { getStudentScheduleEventsDataAction } from "@/actions/student.action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import FullCalendar from "@fullcalendar/react";

const ScheduleCalendar = dynamic(() => import("./ScheduleCalendar"), { ssr: false });
const DayEventsModal = dynamic(() => import("./DayEventsModal"), { ssr: false });

interface ScheduleModuleProps {
  meta: TSScheduleMetaDataResponse;
  initialEvents: TStudentScheduleCalendarEventResponse;
}

const ScheduleModule: React.FC<ScheduleModuleProps> = ({ meta, initialEvents }) => {
  const router = useRouter();
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [events, setEvents] = useState<TStudentScheduleCalendarEventResponse>(initialEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarTitle, setCalendarTitle] = useState("");
  const calendarRef = useRef<FullCalendar>(null);

  // Modal States
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const getEndTime = (isoString: string, slotEndTime: string) => {
    try {
      const date = parseISO(isoString);
      const time = parse(slotEndTime, "h:mm a", new Date());
      return set(date, {
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: 0,
        milliseconds: 0,
      });
    } catch {
      const fallback = parseISO(isoString);
      fallback.setHours(fallback.getHours() + 1);
      return fallback;
    }
  };

  const getSessionStatus = (isoString: string, slotEndTime: string) => {
    const startTime = parseISO(isoString);
    const endTime = getEndTime(isoString, slotEndTime);
    const diff = Math.ceil((startTime.getTime() - currentTime.getTime()) / 60000);
    
    if (currentTime > endTime) {
      return { label: "Completed", isNear: false, showJoin: false };
    }

    if (diff > 0 && diff <= 15) {
      return { label: `Starts In ${diff}M`, isNear: true, showJoin: true };
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return { label: "Live Now", isNear: true, showJoin: true };
    }
    
    return { label: "Upcoming", isNear: false, showJoin: false };
  };

  const getDateLabel = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      if (isToday(date)) return "Today";
      if (isTomorrow(date)) return "Tomorrow";
      return format(date, "MMM d, yyyy");
    } catch {
      return "Upcoming";
    }
  };

  const handleDatesSet = async (arg: any) => {
    setIsLoadingEvents(true);
    const startDate = format(arg.start, "yyyy-MM-dd");
    const endDate = format(arg.end, "yyyy-MM-dd");

    const res = await getStudentScheduleEventsDataAction({ startDate, endDate });
    if (res.data) {
      setEvents(res.data);
    }
    setIsLoadingEvents(false);

    if (arg.view.title) {
      setCalendarTitle(arg.view.title);
    }
  };

  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();

  const handleMoreLinkClick = (arg: { date: Date; allSegs: any[] }) => {
    setSelectedDate(arg.date);
    setSelectedDateEvents(arg.allSegs);
    setIsDayEventsModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
     const bookingId = arg.event ? arg.event.id : arg;
     // For now just console log or logic to join
     console.log("Event clicked:", bookingId);
  };

  const handleModalEventClick = (bookingId: string, meetingLink: string | null) => {
    if (meetingLink) {
        window.open(`https://${meetingLink.replace(/^https?:\/\//, "")}`, "_blank");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Learning Schedule</h1>
          <p className="text-muted-foreground text-sm font-medium">Stay on track with upcoming sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calendar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-6"
        >
          <Card className="border-none shadow-xl shadow-black/5 dark:shadow-none overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-md">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {calendarTitle}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  {(["day", "week", "month"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        "px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all capitalize",
                        view === v 
                          ? "bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" onClick={handleToday} className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-700 text-[11px] font-bold bg-white dark:bg-slate-800 shadow-sm">
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={handlePrev} className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNext} className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <ScheduleCalendar
              calendarRef={calendarRef}
              view={view}
              events={events}
              isLoadingEvents={isLoadingEvents}
              currentTime={currentTime}
              onEventClick={handleEventClick}
              onDatesSet={handleDatesSet}
              onMoreLinkClick={handleMoreLinkClick}
            />
          </Card>
        </motion.div>

        {/* Sidebar Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Current Day Stats Card */}
          <Card className="border-none shadow-lg bg-emerald-700 text-white p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CalendarIcon className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            <div className="relative z-10 space-y-6">
                <div>
                    <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest mb-1">{format(currentTime, "EEEE")}</p>
                    <h3 className="text-3xl font-black">{format(currentTime, "MMM dd, yyyy")}</h3>
                </div>
                <div className="flex items-center gap-2 bg-emerald-600/50 backdrop-blur-sm self-start px-3 py-1.5 rounded-full w-fit border border-emerald-500/30">
                    <Clock className="w-3.5 h-3.5 text-emerald-100" />
                    <span className="text-xs font-bold text-white">Total: {meta.todaySessionCount} Session Today</span>
                </div>
            </div>
          </Card>

          {/* Upcoming Sessions Section - Matching Tutor Design Exactly */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meta.upcomingSessions.length > 0 ? (
                meta.upcomingSessions.map((session, idx) => {
                  const status = getSessionStatus(session.startTimeISO, session.slotEndTime);
                  const dateLabel = getDateLabel(session.startTimeISO);
                  
                  return (
                    <motion.div 
                      key={session.bookingId} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.01, x: 5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                      className={cn(
                        "p-4 rounded-xl border-l-4 transition-colors duration-300 space-y-4 hover:shadow-md group",
                        status.isNear ? "bg-primary/5 border-primary shadow-sm" : "bg-muted/30 hover:bg-muted/50 border-muted-foreground/30 shadow-none"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <Badge variant={status.isNear ? "default" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          {status.label}
                        </Badge>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold px-2 py-0",
                              dateLabel === "Today" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : 
                              dateLabel === "Tomorrow" ? "text-blue-600 border-blue-200 bg-blue-50" : ""
                            )}>
                              {dateLabel}
                            </Badge>
                            <p className="text-[11px] font-semibold text-muted-foreground">{session.slotStartTime} - {session.slotEndTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border border-white">
                            <AvatarImage src={session.tutorImage || ""} />
                            <AvatarFallback>{session.tutorName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{session.tutorName}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{session.categories[0]}</span>
                          </div>
                        </div>
                        
                        {session.meetingLink && (
                          <Link 
                            href={!status.showJoin ? "#" : `https://${session.meetingLink.replace(/^https?:\/\//, "")}`} 
                            target={!status.showJoin ? "_self" : "_blank"}
                            className={cn(!status.showJoin && "cursor-not-allowed")}
                          >
                              <Button 
                               size="sm" 
                               disabled={!status.showJoin}
                               className="bg-[#10b981] hover:bg-[#059669] text-white font-bold h-8 text-[11px] px-4"
                              >
                              Join Class
                              </Button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-8 text-center opacity-30 flex flex-col items-center">
                  <VideoOff className="w-8 h-8 mb-2" />
                  <p className="text-xs font-medium">No sessions starting soon</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <DayEventsModal
        isOpen={isDayEventsModalOpen}
        onClose={() => setIsDayEventsModalOpen(false)}
        date={selectedDate}
        events={selectedDateEvents}
        onEventClick={handleModalEventClick}
        currentTime={currentTime}
      />
    </div>
  );
};

export default ScheduleModule;
