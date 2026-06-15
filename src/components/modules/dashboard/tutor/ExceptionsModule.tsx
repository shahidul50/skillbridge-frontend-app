"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  CalendarX, 
  Trash2, 
  Info,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AddExceptionModal from '@/components/modules/dashboard/tutor/AddExceptionModal';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  getAllTutorException, 
  createTutorException, 
  deleteTutorException 
} from '@/actions/tutor.action';

interface ExceptionItem {
  id: string;
  _id?: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

export default function ExceptionsModule() {
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const fetchExceptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllTutorException();
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.data) {
        const sorted = [...res.data].sort((a, b) => a.date.localeCompare(b.date));
        setExceptions(sorted);
      }
    } catch (error) {
      console.error("Fetch Exceptions Error:", error);
      toast.error("Failed to load exceptions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExceptions();
  }, [fetchExceptions]);

  const handleAddException = async (date: string, reason: string) => {
    try {
      const res = await createTutorException({ date, reason });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Exception added successfully");
        fetchExceptions();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const initiateDelete = (id: string) => {
    const exception = exceptions.find(ex => ex.id === id || ex._id === id);
    if (!exception) return;

    // Business Rule Check: Cannot delete on or after the exception date
    const today = startOfDay(new Date());
    const exceptionDate = startOfDay(parseISO(exception.date));

    if (!isBefore(today, exceptionDate)) {
      toast.error("Cannot delete exception on or after the exception date");
      return;
    }

    setDeleteConfirmId(id);
  };

  const handleDeleteException = async (id: string) => {
    try {
      const res = await deleteTutorException(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Exception deleted successfully");
        fetchExceptions();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  };

  if (isLoading && exceptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <Loader2 className="size-8 animate-spin text-[#008f5d]" />
        <p className="text-muted-foreground animate-pulse font-medium text-sm">Loading your date exceptions...</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Date Exceptions
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
            Manage specific dates where you are unavailable. These dates override your regular weekly schedule for holidays or leave.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#008f5d] hover:bg-[#007f50] text-white font-semibold flex items-center gap-2 rounded-xl h-11 px-5 shadow-sm hover:shadow transition-all self-end sm:self-center"
        >
          <CalendarX className="size-4.5" />
          Add Exception
        </Button>
      </motion.div>

      {/* Exceptions Table Card */}
      <motion.div variants={itemVariants} className="bg-card border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Reason
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right w-30">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              <AnimatePresence mode="popLayout">
                {exceptions.length > 0 ? (
                  exceptions.map((ex) => {
                    const exceptionId = ex.id || ex._id || '';
                    return (
                      <motion.tr
                        key={exceptionId}
                        layout
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.95, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors group"
                      >
                        {/* Date */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3.5">
                            <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#008f5d] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50 dark:border-emerald-900/20">
                              <Calendar className="size-5" />
                            </div>
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                              {formatDate(ex.date)}
                            </span>
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="px-6 py-4.5">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                            {ex.reason}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => initiateDelete(exceptionId)}
                            className="p-2 rounded-xl text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            title="Delete Exception"
                          >
                            <Trash2 className="size-4.5" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr className="hover:none">
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="size-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800">
                          <CalendarX className="size-6" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          No date exceptions added yet.
                        </p>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="text-xs font-semibold text-[#008f5d] hover:underline"
                        >
                          Add one now
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Overriding Logic alert box */}
      <motion.div variants={itemVariants} className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex gap-4 items-start">
        <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#008f5d] dark:text-emerald-400 shrink-0">
          <Info className="size-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#008f5d] dark:text-emerald-300 text-sm leading-none">
            Overriding Logic
          </h4>
          <p className="text-emerald-800/90 dark:text-emerald-300/70 text-xs leading-relaxed font-medium">
            Dates added to this list will prevent students from booking any slots on that specific day, regardless of your weekly recurring availability settings. Past exceptions are automatically archived.
          </p>
        </div>
      </motion.div>

      {/* Add Exception Modal */}
      <AddExceptionModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddException={handleAddException}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-110 rounded-2xl p-6 border-none shadow-2xl bg-background">
          <DialogHeader className="mb-4 relative">
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Delete Exception?
            </DialogTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to remove this exception? This will restore your regular availability for this date.
            </p>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2">
            <Button 
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="h-11 px-5 rounded-xl font-semibold bg-[#008f5d] hover:bg-[#007f50] text-white shadow-md transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => {
                if (deleteConfirmId) {
                  handleDeleteException(deleteConfirmId);
                }
              }}
              variant="outline"
              className="h-11 px-5 rounded-xl font-semibold border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900/20 dark:text-red-400 dark:hover:bg-red-950/10 bg-transparent transition-colors"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
