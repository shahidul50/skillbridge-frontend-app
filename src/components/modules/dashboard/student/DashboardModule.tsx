"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  BookOpen,
  Star,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TGetDashboardMetaDataResponse,
  TGetRecentBookingsResponse,
  TGetUpcomingSessionsResponse,
} from "@/types/student.type";
import { format, isToday, isTomorrow, parseISO, parse, set } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DashboardModuleProps {
  metaData: TGetDashboardMetaDataResponse | null;
  upcomingSessions: TGetUpcomingSessionsResponse | null;
  recentBookings: TGetRecentBookingsResponse | null;
}

const DashboardModule: React.FC<DashboardModuleProps> = ({
  metaData,
  upcomingSessions,
  recentBookings,
}) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const stats = metaData?.stats;

  // Update current time every second and sync immediately on mount
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    
    updateTime(); // Sync immediately to avoid lag from server-rendered time
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
      return format(date, "MMM d");
    } catch {
      return "Upcoming";
    }
  };

  // Check for completed sessions and refresh
  useEffect(() => {
    if (!upcomingSessions) return;
    const hasAnyCompleted = upcomingSessions.some(session => {
      const endTime = getEndTime(session.startTimeISO, session.slotEndTime);
      return currentTime > endTime;
    });

    if (hasAnyCompleted) {
      router.refresh();
    }
  }, [currentTime, upcomingSessions, router]);

  const statCards = [
    {
      title: "TOTAL HOURS LEARNED",
      value: stats?.totalHoursLearned || "0h 0m",
      description: "Progress tracked from active sessions",
      icon: Clock,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "UPCOMING SESSIONS",
      value: `${stats?.upcomingSessionsCount?.thisWeekCount || 0} THIS WEEK`,
      description: `You have ${stats?.upcomingSessionsCount?.todayCount || 0} upcoming session today`,
      icon: Calendar,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "ACTIVE SESSIONS",
      value: stats?.activeSessions?.count?.toString() || "0",
      description: `${stats?.activeSessions?.pendingModules || 0} modules pending completion`,
      icon: BookOpen,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "UNREVIEWED BOOKINGS",
      value: stats?.unreviewedBookings?.count?.toString() || "0",
      description: `${stats?.unreviewedBookings?.pendingFeedbackSessions || 0} sessions need your feedback`,
      icon: Star,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="space-y-8 p-1">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Welcome back, {stats?.studentName}
        </h1>
        <p className="text-muted-foreground text-lg">
          It looks like you're learning very well from our platform, keep it up.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <Card className="border-none shadow-sm bg-card transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-t-2 border-transparent hover:border-muted-foreground/10 overflow-hidden relative group h-full">
              <div className={`absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 ${stat.iconColor.replace('text-', 'bg-')}`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground flex items-baseline gap-1.5">
                      {stat.title === "UPCOMING SESSIONS" ? (
                        <>
                          {stat.value.split(" ")[0]}
                          <span className="text-sm font-medium text-muted-foreground uppercase">
                            {stat.value.split(" ").slice(1).join(" ")}
                          </span>
                        </>
                      ) : (
                        stat.value
                      )}
                    </h3>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${stat.iconBg} ${stat.iconColor} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-sm group-hover:shadow-md`}
                  >
                    <stat.icon size={20} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Upcoming Sessions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Upcoming Sessions</h2>
          <Button variant="ghost" className="text-primary hover:text-primary/80 group">
            <Link href={"/dashboard/schedule"}>View Calendar </Link>
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {upcomingSessions && upcomingSessions.length > 0 ? (
            upcomingSessions.map((session, index) => {
              const status = getSessionStatus(session.startTimeISO, session.slotEndTime);
              return (
                <motion.div
                  key={session.bookingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                >
                  <Card className={`border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card overflow-hidden group ${status.isNear ? 'ring-1 ring-primary/20' : ''}`}>
                    <CardContent className="p-5 flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 rounded-xl border-2 border-background shadow-sm">
                          <AvatarImage src={session.tutorImage || ""} alt={session.tutorName} className="object-cover" />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                            {session.tutorName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap justify-between gap-2 mb-1">
                          {session.categories.slice(0, 1).map((cat) => (
                            <Badge key={cat} variant="secondary" className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 bg-secondary/50">
                              {cat}
                            </Badge>
                          ))}
                          <Badge 
                          variant={status.isNear ? "default" : "outline"} 
                          className={`sm:hidden text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none shadow-none ${
                              status.isNear ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {status.label}
                        </Badge>
                        </div>
                        <h4 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {session.tutorName}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-primary/60" />
                            <span className="font-medium">{getDateLabel(session.startTimeISO)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-primary/60" />
                            <span className="font-medium whitespace-nowrap">{session.slotStartTime}</span>
                          </div>
                        </div>
                      </div>
 
                      <div className={`hidden sm:flex ${session.meetingLink !== null ? "flex-col items-end" : "mb-15"} gap-7`}>
                        <Badge 
                          variant={status.isNear ? "default" : "outline"} 
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none shadow-none ${
                              status.isNear ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {status.label}
                        </Badge>
                        
                        {session.meetingLink && (
                          status.showJoin ? (
                            <Link 
                              href={`https://${session.meetingLink.replace(/^https?:\/\//, "")}`} 
                              target="_blank"
                            >
                              <Button 
                                size="sm" 
                                className="font-bold rounded-lg transition-all transform group-hover:scale-105 bg-[#10b981] hover:bg-[#059669] text-white"
                              >
                                Join Class
                              </Button>
                            </Link>
                          ) : (
                            <Button 
                              size="sm" 
                              className="font-bold rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                              disabled
                            >
                              Join Class
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>

                    <div className="sm:hidden p-4 pt-0 space-y-3">
                      <div className="flex items-center justify-between ">
                         <Badge 
                           variant={status.isNear ? "default" : "outline"} 
                           className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none shadow-none ${
                               status.isNear ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-muted/50 text-muted-foreground"
                           }`}
                         >
                           {status.label}
                         </Badge>
                      </div>
                      {session.meetingLink && (
                        status.showJoin ? (
                          <Button 
                            size="sm" 
                            className="w-full font-bold rounded-lg bg-[#10b981] hover:bg-[#059669] text-white"
                            asChild
                          >
                            <Link 
                              href={`https://${session.meetingLink.replace(/^https?:\/\//, "")}`} 
                              target="_blank"
                            >
                              Join Class
                            </Link>
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="w-full font-bold rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                            disabled
                          >
                            Join Class
                          </Button>
                        )
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <p className="text-muted-foreground">No upcoming sessions found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Bookings Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Recent Bookings</h2>
          <Button variant="ghost" className="text-primary hover:text-primary/80 group">
            <Link href={"/dashboard/booking-history"}>View All</Link>
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <Card className="border-none shadow-sm overflow-hidden bg-card">
          <div className="overflow-x-auto px-5">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-muted/20">
                  <TableHead className="font-bold py-4">TUTOR</TableHead>
                  <TableHead className="font-bold py-4">SUBJECT</TableHead>
                  <TableHead className="font-bold py-4">DATE & TIME</TableHead>
                  <TableHead className="font-bold py-4">STATUS</TableHead>
                  <TableHead className="font-bold py-4 text-right">AMOUNT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings && recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <TableRow key={booking.bookingId} className="border-muted/10 hover:bg-muted/5 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-muted/20">
                            <AvatarImage src={booking.tutorImage || ""} />
                            <AvatarFallback>{booking.tutorName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground">{booking.tutorName}</p>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">{booking.tutorTitle}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="font-medium text-foreground">{booking.categories.join(", ")}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">
                            {new Date(booking.availabilitySlotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {booking.slotStartTime} - {booking.slotEndTime}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          className={`rounded-full px-3 py-0.5 text-[10px] font-bold shadow-none ${
                            booking.status === "CONFIRMED" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-none" :
                            booking.status === "COMPLETED" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-none" :
                            booking.status === "PENDING" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-none" :
                            "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-none"
                          }`}
                        >
                          ● {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right font-bold text-foreground">
                        Tk {booking.amount}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No recent bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DashboardModule;
