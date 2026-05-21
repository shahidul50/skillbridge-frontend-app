"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TimeSlot from "./TimeSlot";

const DayRow = ({ day, slots, onToggleSlot, onDeleteSlot, onAddSlot }) => {
  const isUnavailable = slots.length === 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 min-h-[100px] shadow-sm">
      {/* Day Name */}
      <div className="w-32 shrink-0">
        <h3 className={cn(
          "font-semibold text-lg",
          isUnavailable ? "text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"
        )}>
          {day}
        </h3>
      </div>

      {/* Slots Container */}
      <div className="flex flex-wrap items-center gap-4 grow">
        {slots.map((slot) => (
          <TimeSlot
            key={slot.id}
            slot={slot}
            onToggle={() => onToggleSlot(slot.id, slot.isActive)}
            onDelete={() => onDeleteSlot(slot.id)}
          />
        ))}

        {/* Add Slot Button or Unavailable Message */}
        {isUnavailable ? (
          <div className="flex items-center gap-4">
            <span className="text-slate-400 dark:text-slate-600 italic text-sm font-medium">Unavailable</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddSlot}
              className="bg-[#00A76F] hover:bg-[#2fa77f] text-white hover:text-white border-none h-9 px-4 gap-2 rounded-lg dark:bg-[#009362] dark:hover:bg-[#00A76F]"
            >
              <Plus className="w-4 h-4" />
              Add Slot
            </Button>
          </div>
        ) : (
          <button
            onClick={onAddSlot}
            className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:border-[#00A76F] hover:text-[#00A76F] transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DayRow;
