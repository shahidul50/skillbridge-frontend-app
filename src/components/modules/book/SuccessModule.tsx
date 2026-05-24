"use client";

import {
  CheckCircle,
  User,
  Calendar,
  Clock,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { format, parse } from "date-fns";

interface SuccessModuleProps {
  bookingDetails?: {
    tutorName: string;
    subject: string;
    date: string;
    timeRange: string;
    transactionId: string;
    tutorImage: string;
  };
}

export default function SuccessModule({ bookingDetails }: SuccessModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isBookingSuccess = sessionStorage.getItem("bookingSuccess");
    const transactionId = searchParams.get("TransactionId");

    // If session flag is missing OR TransactionId is missing in URL, redirect to home
    if (!isBookingSuccess || !transactionId) {
      router.replace("/");
    }

    // Optional: Clear the flag after verification so it's a one-time access
    // return () => sessionStorage.removeItem("bookingSuccess");
  }, [router, searchParams]);

  const formatTo12Hour = (timeStr: string | null): string => {
    if (!timeStr) return "";
    try {
      // Try parsing HH:mm:ss then HH:mm
      let parsedDate = parse(timeStr.trim(), "HH:mm:ss", new Date());
      if (isNaN(parsedDate.getTime())) {
        parsedDate = parse(timeStr.trim(), "HH:mm", new Date());
      }
      if (isNaN(parsedDate.getTime())) return timeStr;
      return format(parsedDate, "hh:mm a");
    } catch {
      return timeStr;
    }
  };

  // Get data from query parameters
  const tutorName = searchParams.get("tutorName");
  const tutorImage = searchParams.get("TutorImageUrl");
  const subject = searchParams.get("tutorTitle");
  const dateStr = searchParams.get("availableSlotDate");
  const startTime = searchParams.get("availableStartTime");
  const endTime = searchParams.get("availableEndTime");
  const transactionId = searchParams.get("TransactionId");

  const data = bookingDetails || {
    tutorName: tutorName || "N/A",
    subject: subject || "N/A",
    date: (() => {
      if (!dateStr) return "N/A";
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return format(d, "EEEE, MMMM, yyyy");
      } catch {
        return dateStr;
      }
    })(),
    timeRange:
      startTime && endTime
        ? `${formatTo12Hour(startTime)} — ${formatTo12Hour(endTime)}`
        : "N/A",
    transactionId: transactionId || "N/A",
    tutorImage: tutorImage || "/images/No-image.jpg",
  };

  return (
    <Container className="py-12 md:py-20 flex flex-col items-center">
      {/* Success Icon */}
      <div className="size-20 md:size-24 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mb-8">
        <CheckCircle className="size-12 md:size-16 text-emerald-500" />
      </div>

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl px-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Thank You for Your Booking!
        </h1>
        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
          Your bKash transaction is currently being verified. We have received
          your request, and you will receive a confirmation email with session
          details shortly.
        </p>

        {/* Verification Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full">
          <Info className="size-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
            Verification typically takes 2-5 minutes.
          </span>
        </div>
      </div>

      {/* Booking Summary Card */}
      <Card className="w-full max-w-2xl overflow-hidden border-none shadow-2xl shadow-zinc-200 dark:shadow-none ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-3xl mb-10">
        <CardContent className="p-0 flex flex-col md:flex-row">
          {/* Tutor Image */}
          <div className="relative w-full md:w-2/5 aspect-4/3 md:aspect-square overflow-hidden">
            <Image
              src={data.tutorImage}
              alt={data.tutorName}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex-1 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white">
                Booking Summary
              </h2>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1">
                Transaction: #{data.transactionId}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="size-5 text-zinc-400 shrink-0" />
                <p className="text-sm md:text-base font-semibold text-zinc-700 dark:text-zinc-300">
                  Tutor:{" "}
                  <span className="text-zinc-900 dark:text-white">
                    {data.tutorName} ({data.subject})
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-zinc-400 shrink-0" />
                <p className="text-sm md:text-base font-semibold text-zinc-700 dark:text-zinc-300">
                  {data.date}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="size-5 text-zinc-400 shrink-0" />
                <p className="text-sm md:text-base font-semibold text-zinc-700 dark:text-zinc-300">
                  {data.timeRange}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl px-4">
        <Button
          asChild
          className="w-full sm:flex-1 h-12 md:h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full sm:flex-1 h-12 md:h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-extrabold text-base transition-all active:scale-95"
        >
          <Link href="/dashboard/bookings">View All Bookings</Link>
        </Button>
      </div>
    </Container>
  );
}
