"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
  parse,
  startOfDay,
  isBefore,
  isAfter,
  differenceInCalendarDays
} from "date-fns";
import { getAvailableSlots } from "@/actions/tutor.action";
import { getUserSession } from "@/actions/auth.action";
import { Roles } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckboxCircleFill,
  RiVideoChatLine,
  RiFlashlightFill
} from "@remixicon/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

interface BookingCardProps {
  tutorProfileId: string;
  hourlyRate: number;
  tutorName: string;
}

function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return "";
  if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
    return timeStr;
  }
  try {
    const timeParts = timeStr.trim().split(":");
    let parseFormat = "HH:mm";
    if (timeParts.length === 3) {
      parseFormat = "HH:mm:ss";
    }
    const parsedDate = parse(timeStr.trim(), parseFormat, new Date());
    return format(parsedDate, "hh:mm a");
  } catch (err) {
    console.error("Error parsing time string:", timeStr, err);
    return timeStr;
  }
}

const isDateValid = (date: Date) => {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  
  if (isBefore(target, today)) {
    return false;
  }
  
  const daysDifference = differenceInCalendarDays(target, today);
  return daysDifference <= 4;
};

const hasValidDateInWeek = (weekStart: Date) => {
  const today = startOfDay(new Date());
  const weekEnd = addDays(weekStart, 6);
  const maxValidDate = addDays(today, 4);
  
  return !isBefore(weekEnd, today) && !isAfter(startOfDay(weekStart), startOfDay(maxValidDate));
};

export default function BookingCard({ tutorProfileId, hourlyRate, tutorName }: BookingCardProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 6 }));
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate 7 days of the week based on currentWeekStart
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  const canGoPrev = hasValidDateInWeek(subWeeks(currentWeekStart, 1));
  const canGoNext = hasValidDateInWeek(addWeeks(currentWeekStart, 1));

  useEffect(() => {
    async function fetchSlots() {
      if (!isDateValid(selectedDate)) {
        setSlots([]);
        return;
      }
      setIsLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await getAvailableSlots(tutorProfileId, formattedDate);
        console.log("Available slots:", response);
        if (response.error) {
          console.error("Error fetching available slots:", response.error);
          setSlots([]);
        } else {
          // Format slot items nicely
          const fetchedSlots = response.data || [];
          
          // Sort slots by start time
          const sortedSlots = [...fetchedSlots].sort((a: any, b: any) => {
            const timeA = (a.start || a.startTime || "").trim();
            const timeB = (b.start || b.startTime || "").trim();

            const parseTime = (timeStr: string) => {
              if (!timeStr) return 0;
              try {
                if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
                  return parse(timeStr.toLowerCase(), "hh:mm a", new Date()).getTime();
                }
                const parts = timeStr.split(":");
                const parseFormat = parts.length === 3 ? "HH:mm:ss" : "HH:mm";
                return parse(timeStr, parseFormat, new Date()).getTime();
              } catch (e) {
                return 0;
              }
            };
            
            return parseTime(timeA) - parseTime(timeB);
          });

          setSlots(sortedSlots);
        }
      } catch (err) {
        console.error("Failed to fetch slots", err);
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlots();
    setSelectedSlot(null);
  }, [selectedDate, tutorProfileId]);

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => {
      const nextWeekStart = subWeeks(prev, 1);
      const days = Array.from({ length: 7 }).map((_, i) => addDays(nextWeekStart, i));
      const firstValid = days.find(isDateValid);
      if (firstValid) {
        setSelectedDate(firstValid);
      }
      return nextWeekStart;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const nextWeekStart = addWeeks(prev, 1);
      const days = Array.from({ length: 7 }).map((_, i) => addDays(nextWeekStart, i));
      const firstValid = days.find(isDateValid);
      if (firstValid) {
        setSelectedDate(firstValid);
      }
      return nextWeekStart;
    });
  };

  const handleBookNow = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available slot first.");
      return;
    }

    // Role check before proceeding
    const sessionResponse = await getUserSession();
    const user = sessionResponse?.data?.user;

    if (!user) {
      toast.info("Please login to book a session.");
      router.push(`/login?callbackUrl=${window.location.pathname}${window.location.search}`);
      return;
    }

    if (user.role !== Roles.student) {
      toast.error("Access denied. Only students can book a session.");
      return;
    }

    const startTime = selectedSlot.start || selectedSlot.startTime;
    const endTime = selectedSlot.end || selectedSlot.endTime;
    const dateFormatted = format(selectedDate, "yyyy-MM-dd");

    const queryParams = new URLSearchParams({
      date: dateFormatted,
      startTime,
      endTime,
    });

    router.push(`/tutors/${tutorProfileId}/book?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-6 w-full lg:max-w-md shrink-0">
      {/* Main Pricing & Booking Card */}
      <Card className="border-none shadow-xl shadow-zinc-100 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden rounded-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Price Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">Tk {hourlyRate}</span>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">/ 60 min session</span>
            </div>
            <div className="flex">
              <Badge className="bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-none font-semibold text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1">
                <RiFlashlightFill className="size-3 text-emerald-500" />
                Instant Booking Available
              </Badge>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">Availability</h4>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!canGoPrev}
                  className={`size-7 rounded-lg border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    !canGoPrev ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={handlePrevWeek}
                >
                  <RiArrowLeftSLine className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!canGoNext}
                  className={`size-7 rounded-lg border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    !canGoNext ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={handleNextWeek}
                >
                  <RiArrowRightSLine className="size-4" />
                </Button>
              </div>
            </div>

            {/* Days Slider */}
            <div className="grid grid-cols-7 gap-1 bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
              {daysOfWeek.map((day, idx) => {
                const isSelected = isSameDay(day, selectedDate);
                const isValid = isDateValid(day);
                const dayName = format(day, "ccccc"); // Single letter M, T, W
                const dayNumber = format(day, "d");

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isValid}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all duration-200 ${
                      !isValid
                        ? "opacity-30 cursor-not-allowed"
                        : isSelected
                        ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20 scale-105 cursor-pointer"
                        : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm text-zinc-600 dark:text-zinc-400 cursor-pointer"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-medium ${isSelected ? "text-emerald-100" : "text-zinc-400 dark:text-zinc-500"}`}>
                      {dayName}
                    </span>
                    <span className="text-xs mt-0.5 font-bold">
                      {dayNumber}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Date Indicator */}
            <div className="text-[11px] font-bold text-center text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Available Slots for {format(selectedDate, "MMM d")}
            </div>

            {/* Slots List */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200/50 dark:border-zinc-800/50" />
                ))}
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot, index) => {
                  const start = formatTo12Hour(slot.start || slot.startTime);
                  const end = formatTo12Hour(slot.end || slot.endTime);
                  const displayTime = `${start} - ${end}`;
                  const isSlotSelected = selectedSlot === slot;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 text-center rounded-xl border ${roboto.className} text-[11px] font-bold transition-all cursor-pointer ${
                        isSlotSelected
                          ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "border-zinc-250 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-transparent text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500 text-xs italic">
                No slots available on this day.
              </div>
            )}
          </div>

          {/* Book Now Action */}
          <Button
            onClick={handleBookNow}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-600/15 cursor-pointer text-sm"
          >
            Book Now
          </Button>

          {/* Footer Info */}
          <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            Pay after verification • Secure booking
          </div>
        </CardContent>
      </Card>

      {/* Why Book Card */}
      <Card className="border-none shadow-md shadow-zinc-50 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
            Why book with {tutorName.split(" ")[0]}?
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <RiCheckboxCircleFill className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>100% Satisfaction Guarantee</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <RiVideoChatLine className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Secure HD Video Sessions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
