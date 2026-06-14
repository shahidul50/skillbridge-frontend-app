"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Calendar as CalendarIcon,
  CheckCircle2,
  CalendarCheck,
  History,
  LayoutGrid,
  VideoOff,
  PenSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO, isToday, isTomorrow, parse, set} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TScheduleMetaResponse, TScheduleEventsResponse } from "@/types";
import { getTutorScheduleEventsAction } from "@/actions/tutor.action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingUpdateModal from "./BookingUpdateModal";
import BookingDetailsModal from "./BookingDetailsModal";
import DayEventsModal from "./DayEventsModal";

// FullCalendar imports
import FullCalendar from "@fullcalendar/react";
import dynamic from "next/dynamic";
const ScheduleCalendar = dynamic(() => import("./ScheduleCalendar"), { ssr: false });


interface ScheduleModuleProps {
  meta: TScheduleMetaResponse;
  initialEvents: TScheduleEventsResponse;
}

const ScheduleModule: React.FC<ScheduleModuleProps> = ({ meta, initialEvents }) => {
  const router = useRouter();
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [events, setEvents] = useState<TScheduleEventsResponse>(initialEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarTitle, setCalendarTitle] = useState("");
  const calendarRef = React.useRef<FullCalendar>(null);

  // Update current time every second and sync immediately on mount
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const timer = setInterval(updateTime, 1000);
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
      return { 
        label: "Completed", 
        isNear: false, 
        showJoin: false 
      };
    }

    if (diff > 0 && diff <= 15) {
      return { 
        label: `Starts In ${diff}M`, 
        isNear: true, 
        showJoin: true 
      };
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return { 
        label: "Live Now", 
        isNear: true, 
        showJoin: true 
      };
    }
    
    return { 
        label: "Upcoming", 
        isNear: false, 
        showJoin: false 
    };
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

  // Check for completed sessions and refresh
  const refreshedSessionsRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    const completedSessionIds = meta.startingSoon
      .filter(session => {
        const endTime = getEndTime(session.startTimeISO, session.endTime);
        return currentTime > endTime;
      })
      .map(s => s.bookingId);

    const newCompletedSessions = completedSessionIds.filter(id => !refreshedSessionsRef.current.has(id));

    if (newCompletedSessions.length > 0) {
      newCompletedSessions.forEach(id => refreshedSessionsRef.current.add(id));
      router.refresh();
    }
  }, [currentTime, meta.startingSoon, router]);

  // Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    link: string | null;
    status: string;
  } | null>(null);

  const closeUpdateModal = useCallback(() => setIsUpdateModalOpen(false), []);
  const closeDetailsModal = useCallback(() => setIsDetailsModalOpen(false), []);

  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [selectedDayEventsData, setSelectedDayEventsData] = useState<{date: Date | null, events: any[]}>({ date: null, events: [] });

  const closeDayEventsModal = useCallback(() => setIsDayEventsModalOpen(false), []);

  const handleMoreLinkClick = (arg: any) => {
    if (arg.jsEvent) {
      arg.jsEvent.preventDefault();
    }
    setSelectedDayEventsData({
      date: arg.date,
      events: arg.allSegs
    });
    setIsDayEventsModalOpen(true);
  };




  const handleEventClick = (arg: any) => {
    const { id, extendedProps } = arg.event;
    
    if (extendedProps.bookingStatus === "COMPLETED") {
        setSelectedBooking({ id, link: extendedProps.meetingLink, status: extendedProps.bookingStatus });
        setIsDetailsModalOpen(true);
    } else {
        openUpdateModal(id, extendedProps.meetingLink, extendedProps.bookingStatus);
    }
  };

  // Handle FullCalendar date range changes
  const handleDatesSet = async (arg: any) => {
    setIsLoadingEvents(true);
    const startDate = format(arg.start, "yyyy-MM-dd");
    const endDate = format(arg.end, "yyyy-MM-dd");

    const res = await getTutorScheduleEventsAction({ startDate, endDate });
    if (res.data) {
      setEvents(res.data);
    }
    setIsLoadingEvents(false);

    // Sync titles via state
    if (arg.view.title) {
      setCalendarTitle(arg.view.title);
    }
  };

  const openUpdateModal = (id: string, link: string | null, status: string) => {
    setSelectedBooking({ id, link, status });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    router.refresh();
    
    const api = calendarRef.current?.getApi();
    if (api) {
      const startDate = format(api.view.activeStart, "yyyy-MM-dd");
      const endDate = format(api.view.activeEnd, "yyyy-MM-dd");
      const res = await getTutorScheduleEventsAction({ startDate, endDate });
      if (res.data) setEvents(res.data);
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
  };
  const handleNext = () => {
    calendarRef.current?.getApi().next();
  };
  const handleToday = () => {
    calendarRef.current?.getApi().today();
  };

  const statCards = [
    { 
      label: "Today's Session", 
      value: meta.stats.todaySessions.toString().padStart(2, "0"), 
      status: "TODAY", 
      statusColor: "bg-emerald-500",
      icon: <CalendarIcon className="w-5 h-5 text-emerald-500" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    { 
      label: "Upcoming Session", 
      value: meta.stats.upcomingSessions.toString().padStart(2, "0"), 
      status: "TOMORROW", 
      statusColor: "bg-blue-500",
      icon: <LayoutGrid className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50 dark:bg-blue-950/20"
    },
    { 
      label: "Uncompleted Booking", 
      value: meta.stats.uncompletedBookings.toString().padStart(2, "0"), 
      icon: <History className="w-5 h-5 text-rose-500" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/20"
    },
    { 
      label: "Total Booking", 
      value: meta.stats.totalBookings.toString().padStart(2, "0"), 
      icon: <CalendarCheck className="w-5 h-5 text-indigo-500" />,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/20"
    },
    { 
      label: "Completed Booking", 
      value: meta.stats.completedBookings.count.toString().padStart(2, "0"), 
      satisfaction: `${meta.stats.completedBookings.satisfactionRate}% satisfaction rate`,
      icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />,
      iconBg: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="h-full group"
          >
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/20 flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={cn("p-2 rounded-xl", stat.iconBg)}
                  >
                    {stat.icon}
                  </motion.div>
                  {stat.status && (
                    <Badge className={cn("text-[10px] font-bold px-2 py-0.5 text-white border-none shadow-sm", stat.statusColor)}>
                      {stat.status}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 mt-auto">
                  <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                  <div className="text-3xl font-black tracking-tighter text-foreground">
                    {stat.value}
                  </div>
                  {stat.satisfaction ? (
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="text-xs">☆</span> {stat.satisfaction}
                    </p>
                  ) : (
                    <div className="h-[15px]" /> // Placeholder to keep height consistent
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calendar Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn("lg:col-span-8 space-y-6 order-2 lg:order-1", (isUpdateModalOpen || isDetailsModalOpen) && "z-0 relative")}
        >
          <Card className="border-none shadow-sm overflow-hidden min-h-[600px] flex flex-col transition-shadow hover:shadow-md">
            <div className="p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">
                  {calendarTitle}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-muted/30 p-1 rounded-xl backdrop-blur-sm border border-muted/20">
                  {(["day", "week", "month"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        "px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize relative z-10",
                        view === v 
                          ? "bg-white dark:bg-slate-800 shadow-sm text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" onClick={handleToday} className="h-9 px-4 rounded-xl border-muted/50 text-[11px] font-bold hover:bg-muted/50 transition-colors bg-white/50 dark:bg-slate-900/50">
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={handlePrev} className="h-9 w-9 rounded-xl border-muted/50 hover:bg-muted/50 transition-colors bg-white/50 dark:bg-slate-900/50">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNext} className="h-9 w-9 rounded-xl border-muted/50 hover:bg-muted/50 transition-colors bg-white/50 dark:bg-slate-900/50">
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
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-4 space-y-6 order-1 lg:order-2"
        >
          {/* Starting Soon */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meta.startingSoon.length > 0 ? (
                meta.startingSoon.map((session, idx) => {
                  const status = getSessionStatus(session.startTimeISO, session.endTime);
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
                            <p className="text-[11px] font-semibold text-muted-foreground">{session.startTime} - {session.endTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border border-white">
                            <AvatarImage src={session.studentImage} />
                            <AvatarFallback>{session.studentName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{session.studentName}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{session.categoryName}</span>
                          </div>
                        </div>
                        
                        {session.meetingLink ? (
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
                        ) : (
                          <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openUpdateModal(session.bookingId, null, session.bookingStatus)}
                              className="h-8 text-[11px] font-bold px-4 border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/5"
                          >
                            Add Link
                          </Button>
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

          {/* Class Link Hub */}
          <Card className="border-none shadow-sm bg-[#1B2120] text-slate-100 p-6 rounded-2xl">
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-white">Class Link Hub</h3>
              <p className="text-[11px] text-slate-400 font-medium">Quickly update meeting links for your upcoming sessions.</p>
            </div>
            
            <div className="space-y-3">
              {meta.classLinkHub.length > 0 ? (
                meta.classLinkHub.map((item, idx) => (
                  <motion.div 
                    key={item.bookingId} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                    className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 transition-colors"
                  >
                    <span className="text-[11px] font-bold truncate max-w-[180px]">
                      {item.categoryName} with {item.studentName}
                    </span>
                    {item.meetingLink ? (
                      <div className="flex items-center gap-2">
                        <PenSquare 
                          onClick={() => openUpdateModal(item.bookingId, item.meetingLink, item.bookingStatus)}
                          className="w-4 h-4 text-emerald-500 cursor-pointer hover:scale-110 transition-transform" 
                        />
                      </div>
                    ) : (
                      <span 
                        onClick={() => openUpdateModal(item.bookingId, null, item.bookingStatus)}
                        className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-400/20 transition-colors"
                      >
                        SET
                      </span>
                    )}
                  </motion.div>
                ))
              ) : (
                 <p className="text-[11px] text-slate-500 text-center py-4">No active links needed</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Booking Update Modal */}
      <BookingUpdateModal 
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        bookingId={selectedBooking?.id || null}
        initialMeetingLink={selectedBooking?.link || null}
        initialStatus={selectedBooking?.status || "CONFIRMED"}
        onSuccess={handleUpdateSuccess}
      />

      <BookingDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        bookingId={selectedBooking?.id || null}
      />

      <DayEventsModal
        isOpen={isDayEventsModalOpen}
        onClose={closeDayEventsModal}
        date={selectedDayEventsData.date}
        events={selectedDayEventsData.events}
        onEventClick={(id, link, status) => {
          if (status === "COMPLETED") {
             setSelectedBooking({ id, link, status });
             setIsDetailsModalOpen(true);
          } else {
             openUpdateModal(id, link, status);
          }
        }}
      />
    </div>
  );
};

export default ScheduleModule;
