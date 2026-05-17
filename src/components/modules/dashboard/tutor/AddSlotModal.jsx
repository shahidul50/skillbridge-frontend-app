"use client";

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function AddSlotModal({ 
  isOpen, 
  onOpenChange, 
  day, 
  onAddSlot 
}) {
  // Use 24h format for HTML5 time input
  const [newSlot, setNewSlot] = useState({ start: '09:00', end: '10:00' });

  // Helper to convert 24h to 12h AM/PM for display consistency
  const formatTo12h = (time24) => {
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
      <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold">Add New Time Slot</DialogTitle>
            <p className="text-muted-foreground">Set availability for {day}</p>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Start Time</label>
              <div className="relative">
                <Input 
                  type="time" 
                  value={newSlot.start} 
                  onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                  className="h-11 rounded-xl block w-full px-4"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">End Time</label>
              <div className="relative">
                <Input 
                  type="time" 
                  value={newSlot.end} 
                  onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                  className="h-11 rounded-xl block w-full px-4"
                />
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 mb-8">
            <Info className="size-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This slot will recur every {day}. Make sure it doesn't overlap with your existing {day} sessions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 h-11 rounded-xl font-semibold order-2 sm:order-1">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleAdd}
              className="flex-1 h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md order-1 sm:order-2"
            >
              Add Slot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
