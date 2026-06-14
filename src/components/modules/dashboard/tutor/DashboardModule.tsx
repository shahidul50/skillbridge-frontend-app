"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Wallet, 
  Star, 
  CheckCircle, 
  Share2, 
  ChevronRight,
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { TDashboardMetaResponse, TDashboardRevenueTrendResponse, TDashboardRevenueTrendParams } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDashboardRevenueTrendsAction } from "@/actions/tutor.action";
import { useRouter } from "next/navigation";
import { differenceInMinutes, format, isToday, isTomorrow, parseISO, parse, set } from "date-fns";

interface DashboardModuleProps {
  meta: TDashboardMetaResponse;
  initialTrends: TDashboardRevenueTrendResponse;
}

const DashboardModule: React.FC<DashboardModuleProps> = ({ meta, initialTrends }) => {
  const router = useRouter();
  const [trends, setTrends] = useState<TDashboardRevenueTrendResponse>(initialTrends);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Check for completed sessions and refresh
  useEffect(() => {
    const hasAnyCompleted = meta.upcomingSessions.some(session => {
      const endTime = getEndTime(session.startTimeISO, session.slotEndTime);
      return currentTime > endTime;
    });

    if (hasAnyCompleted) {
      router.refresh();
    }
  }, [currentTime, meta.upcomingSessions, router]);

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
  const [trendPeriod, setTrendPeriod] = useState<TDashboardRevenueTrendParams["trendPeriod"]>("six-month");
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  const handlePeriodChange = async (value: string) => {
    const period = value as TDashboardRevenueTrendParams["trendPeriod"];
    setTrendPeriod(period);
    setIsLoadingTrends(true);
    const res = await getDashboardRevenueTrendsAction({ trendPeriod: period });
    if (res.data) {
      setTrends(res.data);
    }
    setIsLoadingTrends(false);
  };

  const stats = [
    {
      title: "Total Sessions",
      value: meta.stats.totalSessions.value,
      trend: `${meta.stats.totalSessions.growth >= 0 ? '+' : ''}${meta.stats.totalSessions.growth}%`,
      trendStyles: meta.stats.totalSessions.growth > 0 
        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" 
        : meta.stats.totalSessions.growth < 0 
          ? "text-red-600 bg-red-500/10 border-red-500/20" 
          : "text-muted-foreground bg-muted/50 border-transparent",
      icon: <Calendar className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Total Earnings",
      value: `${meta.stats.totalEarnings.value.toLocaleString()} Tk`,
      trend: `${meta.stats.totalEarnings.growth >= 0 ? '+' : ''}${meta.stats.totalEarnings.growth}%`,
      trendStyles: meta.stats.totalEarnings.growth > 0 
        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" 
        : meta.stats.totalEarnings.growth < 0 
          ? "text-red-600 bg-red-500/10 border-red-500/20" 
          : "text-muted-foreground bg-muted/50 border-transparent",
      icon: <Wallet className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Avg. Rating",
      value: `${meta.stats.avgRating.value.toFixed(1)} / 5.0`,
      trend: meta.stats.avgRating.status,
      trendStyles: meta.stats.avgRating.status === "Steady" 
        ? "text-muted-foreground bg-muted/50 border-transparent" 
        : "text-blue-600 bg-blue-500/10 border-blue-500/20",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      title: "New Bookings",
      value: meta.stats.newBookings.value,
      trend: `${meta.stats.newBookings.badge === "0" ? meta.stats.newBookings.badge : meta.stats.newBookings.badge+" New"}`,
      trendStyles: "text-red-600 bg-red-500/10 border-red-500/20",
      icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {meta.tutorName}</h1>
          <p className="text-muted-foreground mt-1">
            You have <span className="font-semibold text-foreground">{meta.todayUpcomingSessionsCount}</span> upcoming sessions today. {meta.todayUpcomingSessionsCount > 0 ? "Let's make them count!" : ""}
          </p>
        </div>
        <Button variant="outline" className="w-fit flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Profile
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="h-full group"
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`p-2.5 rounded-xl ${stat.bg}`}
                  >
                    {stat.icon}
                  </motion.div>
                  {
                    stat.trend !== "0" &&
                  <Badge variant="outline" className={`font-bold text-[11px] px-2 py-0.5 ${stat.trendStyles}`}>
                    {stat.trend}
                  </Badge>
                  }
                  
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="text-2xl font-bold tracking-tight">
                      {stat.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trends Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
          className="lg:col-span-2 h-full"
        >
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-xl">Revenue Trends</CardTitle>
              <CardDescription>Weekly, Monthly and Yearly performance tracking</CardDescription>
            </div>
            <Select value={trendPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-week">Last week</SelectItem>
                <SelectItem value="one-month">Last month</SelectItem>
                <SelectItem value="three-month">Last 3 months</SelectItem>
                <SelectItem value="six-month">Last 6 months</SelectItem>
                <SelectItem value="this-year">This year</SelectItem>
                <SelectItem value="all-time">All time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[350px] w-full">
              {isLoadingTrends ? (
                <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-lg">
                    Loading trends...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trends.revenueTrends}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--popover))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        padding: "12px"
                      }}
                      itemStyle={{ color: "#10b981", fontWeight: "600" }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold", marginBottom: "4px" }}
                      cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 600 }}
                      className="text-foreground"
                      dy={10}
                    />
                    <YAxis hide />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#22c55e" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Upcoming Sessions List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
          className="h-full"
        >
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {meta.upcomingSessions.length > 0 ? (
              meta.upcomingSessions.map((session, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.01, x: 5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  key={session.bookingId} 
                  className={`p-4 rounded-xl border-l-4 transition-colors duration-300 hover:shadow-md ${getSessionStatus(session.startTimeISO, session.slotEndTime).isNear ? 'bg-primary/5 border-primary shadow-sm' : 'bg-muted/30 hover:bg-muted/50 border-muted-foreground/30 shadow-none'} space-y-4 cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <Badge variant={getSessionStatus(session.startTimeISO, session.slotEndTime).isNear ? "default" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                      {getSessionStatus(session.startTimeISO, session.slotEndTime).label}
                    </Badge>
                    <div className="text-right">
                        <p className="text-xs font-bold text-foreground">{getDateLabel(session.startTimeISO)}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">{session.slotStartTime} - {session.slotEndTime}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-base">{session.categories[0] || "Subject"}</h4>
                    <p className="text-xs text-muted-foreground">with {session.studentName}</p>
                  </div>
                  
                  {getSessionStatus(session.startTimeISO, session.slotEndTime).showJoin && session.meetingLink && (
                    <Link 
                      href={`https://${session.meetingLink.replace(/^https?:\/\//, "")}`} 
                      target="_blank" 
                      className="block w-full"
                    >
                        <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold h-11 flex items-center gap-2">
                        Join Class
                        </Button>
                    </Link>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 opacity-50">
                <Calendar className="w-10 h-10" />
                <p className="text-sm">No upcoming sessions today</p>
              </div>
            )}
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Link href="/tutor-dashboard/schedule" className="group flex items-center justify-center gap-2 text-[#10b981] font-bold text-sm hover:underline py-2">
              View All Schedule
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardModule;
