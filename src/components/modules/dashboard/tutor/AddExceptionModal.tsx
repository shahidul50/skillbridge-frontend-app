"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import * as zod from 'zod';
import { cn } from '@/lib/utils';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isBefore, 
  startOfDay 
} from 'date-fns';

interface AddExceptionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddException: (date: string, reason: string) => void;
}

// Zod validation schema
const exceptionSchema = zod.object({
  date: zod.string().min(1, "Select Date is required").refine((dateStr) => {
    if (!dateStr) return true; // Let the min(1) check handle empty cases, refine should only check if it is NOT empty
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: "Cannot create exception for past dates",
  }),
  reason: zod.string()
    .refine((val) => val.trim().length > 0, {
      message: "Reason is required",
    })
    .refine((val) => val.trim().length >= 5, {
      message: "Reason must be at least 5 characters long",
    }),
});

interface ExceptionFormValues {
  date: string;
  reason: string;
}

export default function AddExceptionModal({ 
  isOpen, 
  onOpenChange, 
  onAddException 
}: AddExceptionModalProps) {
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // TanStack Form configuration
  const form = useForm({
    defaultValues: {
      date: '',
      reason: '',
    } as ExceptionFormValues,
    validators: {
      onChange: exceptionSchema,
    },
    onSubmit: async ({ value }) => {
      onAddException(value.date, value.reason.trim());
      form.reset();
      setIsCalendarOpen(false);
      onOpenChange(false);
    },
  });

  // Reset the form and calendar state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setIsCalendarOpen(false);
      setCurrentMonth(new Date());
    }
  }, [isOpen]);

  // Generate calendar days for currentMonth
  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);
  const calendarDays = eachDayOfInterval({ start: startWeek, end: endWeek });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-2xl p-6 border-none shadow-2xl bg-background">
        <DialogHeader className="mb-5 relative">
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Add Date Exception
          </DialogTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Set a specific date where you will be unavailable for sessions.
          </p>
        </DialogHeader>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }} 
          className="space-y-5"
        >
          <FieldGroup className="gap-5">
            {/* Select Date Input */}
            <form.Field name="date" children={(field) => {
              const isInvalid = (field.state.meta.isTouched || field.state.value !== '') && field.state.meta.errors.length > 0;
              return (
                <Field className="relative">
                  <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Select Date
                  </FieldLabel>
                  <div className="relative w-full">
                    <button 
                      id={field.name}
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="h-12 pl-11 pr-4 rounded-xl w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-left flex items-center justify-between relative cursor-pointer"
                    >
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                      <span>
                        {field.state.value 
                          ? format(new Date(field.state.value), 'MMM dd, yyyy') 
                          : 'Select Date...'}
                      </span>
                    </button>
                    
                    {isCalendarOpen && (
                      <>
                        {/* Clicking outside the calendar popover will close it */}
                        <div 
                          className="fixed inset-0 z-40 bg-transparent" 
                          onClick={() => setIsCalendarOpen(false)}
                        />
                        <div className="absolute top-[52px] left-0 z-50 w-full max-w-[320px] bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Calendar Month Selector Header */}
                          <div className="flex items-center justify-between mb-3">
                            <button 
                              type="button"
                              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                              {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Weekdays Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <span key={day} className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                                {day}
                              </span>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, idx) => {
                              const isSelected = field.state.value && isSameDay(day, new Date(field.state.value));
                              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                              const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
                              
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => {
                                    field.handleChange(format(day, 'yyyy-MM-dd'));
                                    setIsCalendarOpen(false);
                                  }}
                                  className={cn(
                                    "h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all",
                                    isSelected 
                                      ? "bg-[#008f5d] text-white shadow-md scale-105"
                                      : isPast
                                        ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40"
                                        : isCurrentMonth
                                          ? "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                          : "text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  )}
                                >
                                  {day.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />

            {/* Reason Textarea */}
            <form.Field name="reason" children={(field) => {
              const isInvalid = (field.state.meta.isTouched || field.state.value !== '') && field.state.meta.errors.length > 0;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Reason
                  </FieldLabel>
                  <Textarea 
                    id={field.name}
                    name={field.name}
                    value={field.state.value} 
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Public Holiday, Medical Leave, Personal Appointment..."
                    className="min-h-[100px] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-emerald-500 focus:border-emerald-500 focus-visible:ring-emerald-500 resize-none leading-relaxed"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }} />
          </FieldGroup>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2">
            <DialogClose asChild>
              <Button 
                type="button"
                variant="outline" 
                className="h-11 px-5 rounded-xl font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 bg-transparent transition-colors"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              className="h-11 px-5 rounded-xl font-semibold bg-[#008f5d] hover:bg-[#007f50] text-white shadow-md transition-all active:scale-[0.98]"
            >
              Add Exception
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
