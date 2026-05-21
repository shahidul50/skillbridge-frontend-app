"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const formatTimeTo12h = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hours12 = h % 12 || 12;
  return `${hours12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const TimeSlot = ({ slot, onToggle, onDelete }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all h-12 shadow-sm",
        slot.isActive
          ? "bg-[#EBFBF5] dark:bg-[#002B1E]/30 border-[#D1F7E9] dark:border-[#004D36] text-slate-800 dark:text-slate-200"
          : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500"
      )}
    >
      {/* Toggle Switch */}
      <button
        onClick={onToggle}
        className={cn(
          "w-10 h-5 rounded-full relative transition-all duration-300",
          slot.isActive ? "bg-[#00A76F]" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
            slot.isActive ? "left-6" : "left-1"
          )}
        />
      </button>

      {/* Time Display */}
      <div className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
        <span>{formatTimeTo12h(slot.startTime)}</span>
        <span className="text-[10px] opacity-40 font-black mx-1">TO</span>
        <span>{formatTimeTo12h(slot.endTime)}</span>
      </div>

      {/* Close Button */}
      <button
        onClick={onDelete}
        className="ml-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TimeSlot;
