"use client";

import React, { useState } from 'react';
import { Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SlotInput {
  start: string;
  end: string;
}

interface AddSlotModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  day: string;
  onAddSlot: (day: string, slot: SlotInput) => void;
}

export default function AddSlotModal({ 
  isOpen, 
  onOpenChange, 
  day, 
  onAddSlot 
}: AddSlotModalProps) {
  // Use 24h format for HTML5 time input
  const [newSlot, setNewSlot] = useState<SlotInput>({ start: '09:00', end: '10:00' });

  // Helper to convert 24h to 12h AM/PM for display consistency
  const formatTo12h = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleAdd = () => {
    const formattedSlot = {
      start: formatTo12h(newSlot.start),
      end: formatTo12h(newSlot.end)
    };
    onAddSlot(day, formattedSlot);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden p-0 border-none shadow-2xl bg-background">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold">Add New Time Slot</DialogTitle>
            <p className="text-muted-foreground text-sm">Set availability for {day}</p>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">Start Time</label>
              <div className="relative">
                <Input 
                  type="time" 
                  value={newSlot.start} 
                  onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                  className="h-12 rounded-xl block w-full px-4 pr-10 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-all [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">End Time</label>
              <div className="relative">
                <Input 
                  type="time" 
                  value={newSlot.end} 
                  onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                  className="h-12 rounded-xl block w-full px-4 pr-10 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-all [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 mb-8">
            <Info className="size-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              This slot will recur every {day}. Make sure it doesn't overlap with your existing {day} sessions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:flex-1 h-11 rounded-full font-semibold order-2 sm:order-1 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-100 bg-transparent transition-colors">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleAdd}
              className="w-full sm:flex-1 h-11 rounded-full font-semibold bg-[#008f5d] hover:bg-[#007f50] text-white shadow-md order-1 sm:order-2 transition-colors"
            >
              Add Slot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
