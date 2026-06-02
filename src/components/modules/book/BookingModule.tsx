"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/Container";
import { getPaymentAccountDetails } from "@/actions/payment.action";
import { createBookingAction } from "@/actions/booking.action";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field"
import { useForm } from "@tanstack/react-form"
import * as zod from "zod";
import { Roles } from "@/constants/roles";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Copy,
  ShieldCheck,
  CheckCircle,
  Tag,
} from "lucide-react";
import { TPaymentAccountDetails } from "@/types";

interface BookingModuleProps {
  user?: {
    role: string;
    [key: string]: any;
  };
  tutor: {
    id: string;
    user: { name: string; image: string };
    title: string;
    rating: number;
    hourlyRate: number;
  };
}

function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return "";
  if (
    timeStr.toLowerCase().includes("am") ||
    timeStr.toLowerCase().includes("pm")
  ) {
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
  } catch {
    return timeStr;
  }
}

export default function BookingModule({ tutor, user }: BookingModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";

  useEffect(() => {
    if (user && user.role !== Roles.student) {
      toast.error("Access denied. Only students can book a session.");
      router.push(`/tutors/${tutor.id}`);
    }
  }, [user, tutor.id, router]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentAccount, setPaymentAccount] = useState<TPaymentAccountDetails>({
    accountNumber: "",
    method: ""
  });

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await getPaymentAccountDetails();
        if (res?.data) {
          setPaymentAccount({
            accountNumber: res.data.data?.accountNumber || "01XXX-XXXXXX",
            method: res.data.data?.method || "BKASH"
          });
        }
      } catch (err) {
        console.error("Failed to fetch payment details:", err);
      }
    };
    fetchPaymentDetails();
  }, []);

  const bkashNumber = paymentAccount.accountNumber;

  // Format display values
  const displayDate = date
    ? format(new Date(date + "T00:00:00"), "MMMM dd, yyyy")
    : "Not selected";
  const displayStartTime = formatTo12Hour(startTime);
  const displayEndTime = formatTo12Hour(endTime);

  // Calculate session duration in minutes from startTime and endTime
  const calcDurationMinutes = (): number => {
    if (!startTime || !endTime) return 60; // default to 60 mins if times are missing
    try {
      const parseTimeStr = (t: string) => {
        const timeStr = t.trim().toLowerCase();
        // Handle 12-hour format with AM/PM
        if (timeStr.includes("am") || timeStr.includes("pm")) {
          return parse(timeStr, "hh:mm a", new Date());
        }
        // Handle 24-hour format (HH:mm or HH:mm:ss)
        const parts = timeStr.split(":");
        const fmt = parts.length === 3 ? "HH:mm:ss" : "HH:mm";
        return parse(timeStr, fmt, new Date());
      };

      const start = parseTimeStr(startTime);
      const end = parseTimeStr(endTime);

      let diffMs = end.getTime() - start.getTime();

      // If endTime is before startTime (e.g., overnight session), add 24 hours
      if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
      }

      return Math.max(Math.round(diffMs / 60000), 1);
    } catch (err) {
      console.error("Error calculating duration:", err);
      return 60; // fallback
    }
  };

  const sessionMinutes = calcDurationMinutes();
  const displayTimeRange =
    displayStartTime && displayEndTime
      ? `${displayStartTime} — ${displayEndTime} (${sessionMinutes} min)`
      : "Not selected";

  // Price calculations: (hourlyRate * total_minutes) / 60, then ceiling for round figure
  const sessionRate = Math.ceil((tutor.hourlyRate * sessionMinutes) / 60);
  const serviceFee = Math.round(sessionRate * 0.00 * 100) / 100;
  const total = Math.round((sessionRate + serviceFee) * 100) / 100;


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bkashNumber.replace(/-/g, ""));
      setCopied(true);
      toast.success("Number copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy number.");
    }
  };

  const bookingSchema = zod.object({
    transactionId: zod.string().min(6, "Transaction ID must be at least 6 characters"),
  });

  const form = useForm({
    defaultValues: {
      transactionId: "",
    },
    validators: {
      onChange: bookingSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const bookingData = {
          tutorProfileId: tutor.id,
          date: date,
          startTime: startTime,
          endTime: endTime,
          paymentMethod: paymentAccount.method || "BKASH",
          transactionId: value.transactionId,
        };

        const res = await createBookingAction(bookingData);

        if (res?.success) {
          // Handle potential nested data structure
          const booking = res.data?.booking;
          const payment = res.data?.payment;

          if (!booking) {
            toast.error("Booking succeeded but response data is missing.");
            return;
          }

          console.log("Booking: ", booking);

          const params = new URLSearchParams({
            tutorName: booking.tutorProfile?.user?.name || "Tutor",
            TutorImageUrl: booking.tutorProfile?.user?.image || "null",
            tutorTitle: booking.tutorProfile?.title || "Tutor Profile",
            availableSlotDate: booking.availabilitySlot?.date,
            availableStartTime: booking.availabilitySlot?.startTime,
            availableEndTime: booking.availabilitySlot?.endTime,
            TransactionId: payment?.transactionId,
          });

          toast.success(
            "Booking submitted! We will verify your transaction shortly."
          );
          sessionStorage.setItem("bookingSuccess", "true");
          router.push(`/tutors/${tutor.id}/book/success?${params.toString()}`);
        } else {
          toast.error(res?.message || "Something went wrong. Please try again.");
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Container className="py-8 md:py-12 max-w-6xl">
      {/* Back to Profile */}
      <Link
        href={`/tutors/${tutor.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors mb-6 md:mb-8 group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Profile
      </Link>

      {/* Main Grid: Summary (left) + Payment (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        {/* ===== LEFT: Booking Summary ===== */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl shadow-zinc-100 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white">
                Booking Summary
              </h2>

              {/* Tutor Info */}
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shrink-0 shadow-inner">
                  <Image
                    src={tutor.user.image}
                    alt={tutor.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {tutor.user.name}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {tutor.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {tutor.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                    <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Date
                    </p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      {displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                    <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Time
                    </p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      {displayTimeRange}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                    <Tag className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Hourly Rate
                    </p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      Tk {tutor.hourlyRate} / 60 min
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Session Rate
                  </span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Tk {sessionRate.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Service Fee
                  </span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Tk {serviceFee.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-zinc-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    Tk {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secure Transaction Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <CheckCircle className="size-4 text-emerald-500" />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              100% Secure Transaction
            </span>
          </div>
        </div>

        {/* ===== RIGHT: bKash Payment ===== */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-xl shadow-zinc-100 dark:shadow-none ring-1 ring-zinc-200/80 dark:ring-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* bKash Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white">
                    bKash Payment
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Pay manually to confirm your session
                  </p>
                </div>
                <div className="size-10 rounded-lg bg-[#E2136E] flex items-center justify-center shrink-0 shadow-md shadow-[#E2136E]/20">
                  <span className="text-white text-[10px] font-extrabold leading-tight text-center">
                    bKash
                  </span>
                </div>
              </div>

              {/* Manual Payment Details Card */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/60 dark:border-emerald-900/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="size-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Manual Payment Details
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Please Send Money to the following number:
                </p>
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-extrabold text-[#E2136E] tracking-wide">
                      {paymentAccount.accountNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                      PERSONAL
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Copy className="size-4" />
                    <span className="text-xs font-bold">
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Instructions
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      text: (
                        <>
                          Open your bKash app or dial{" "}
                          <span className="font-bold text-zinc-900 dark:text-white">
                            *247#
                          </span>
                        </>
                      ),
                    },
                    {
                      step: 2,
                      text: (
                        <>
                          Select{" "}
                          <span className="font-bold text-zinc-900 dark:text-white">
                            Send Money
                          </span>{" "}
                          and enter the number above
                        </>
                      ),
                    },
                    {
                      step: 3,
                      text: (
                        <>
                          Enter amount{" "}
                          <span className="font-bold text-zinc-900 dark:text-white">
                            Tk {total.toFixed(2)} (Equivalent BDT)
                          </span>{" "}
                          and your PIN
                        </>
                      ),
                    },
                    {
                      step: 4,
                      text: (
                        <>
                          Copy the{" "}
                          <span className="font-bold text-zinc-900 dark:text-white">
                            Transaction ID
                          </span>{" "}
                          from the SMS or app receipt
                        </>
                      ),
                    },
                  ].map((instruction) => (
                    <div
                      key={instruction.step}
                      className="flex items-start gap-3"
                    >
                      <div className="size-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">
                          {instruction.step}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {instruction.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction ID Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-6"
              >
                <FieldGroup>
                    <form.Field name="transactionId" children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <Field>
                                <FieldLabel htmlFor={field.name} className="font-bold text-zinc-900 dark:text-white">
                                    Transaction ID
                                </FieldLabel>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5">
                                        <Copy className="size-4 text-zinc-400" />
                                    </div>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        placeholder="Enter your bKash Transaction ID"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={`pl-10 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            isInvalid ? "border-red-500 focus:ring-red-500" : ""
                                        }`}
                                    />
                                </div>
                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                                    Example: 8N7A6D5C4B
                                </p>
                            </Field>
                        )
                    }} />

                    {/* Pay & Book Button */}
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit]) => (
                            <Button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold h-14 rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer text-base flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="size-5" />
                                {isSubmitting
                                    ? "Processing..."
                                    : `Pay & Book • Tk ${total.toFixed(2)}`}
                            </Button>
                        )}
                    />
                </FieldGroup>
              </form>

              {/* Disclaimer */}
              <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500 leading-relaxed">
                By clicking Pay & Book, you confirm that you have sent
                the payment. SkillBridge will verify the transaction within 30
                minutes.
              </p>

              {/* Manual Verification Badge */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Manual Verification
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
