"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddSlotModal = ({ 
  isOpen, 
  onClose, 
  selectedDay, 
  newSlotData, 
  setNewSlotData, 
  onAddSlot 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Add New Time Slot</DialogTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">Set availability for {selectedDay}</p>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
              <div className="relative flex items-center">
                <input
                  type="time"
                  value={newSlotData.startTime}
                  onChange={(e) => setNewSlotData({ ...newSlotData, startTime: e.target.value })}
                  className="w-full h-11 px-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] transition-all outline-none"
                />
                {/* <Clock className="w-4 h-4 absolute right-4 text-slate-400 pointer-events-none" /> */}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Time</label>
              <div className="relative flex items-center">
                <input
                  type="time"
                  value={newSlotData.endTime}
                  onChange={(e) => setNewSlotData({ ...newSlotData, endTime: e.target.value })}
                  className="w-full h-11 px-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] transition-all outline-none"
                />
                {/* <Clock className="w-4 h-4 absolute right-4 text-slate-400 pointer-events-none" /> */}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex gap-3 items-start border border-slate-100 dark:border-slate-800">
            <Info className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              This slot will recur every {selectedDay}. Make sure it doesn't overlap with your existing {selectedDay} sessions.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-[#00A76F] hover:bg-[#009362] text-white shadow-lg shadow-[#00A76F]/20"
              onClick={onAddSlot}
            >
              Add Slot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlotModal;
