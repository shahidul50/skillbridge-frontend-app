"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SlotItem {
  id: string;
  start: string;
  end: string;
}

interface AvailabilityCardProps {
  day: string;
  slots?: SlotItem[];
  onDeleteSlot: (day: string, id: string) => void;
  onOpenAddModal: (day: string) => void;
}

export default function AvailabilityCard({ 
  day, 
  slots = [], 
  onDeleteSlot, 
  onOpenAddModal 
}: AvailabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="w-24 shrink-0">
          <span className="font-semibold text-lg">{day}</span>
        </div>

        <div className="flex-1 flex flex-wrap gap-3 items-center">
          <AnimatePresence mode="popLayout">
            {slots && slots.length > 0 ? (
              <>
                {slots.map((slot) => (
                  <motion.div
                    key={slot.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 px-3 md:px-4 py-2 rounded-lg border transition-colors bg-primary/5 border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-xs md:text-sm font-medium">
                      <span>{slot.start}</span>
                      <span className="text-muted-foreground text-[10px] md:text-xs uppercase font-normal">to</span>
                      <span>{slot.end}</span>
                    </div>
                    <button
                      onClick={() => onDeleteSlot(day, slot.id)}
                      className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={() => onOpenAddModal(day)}
                  className="size-10 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:text-primary transition-all text-muted-foreground cursor-pointer"
                >
                  <Plus className="size-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground italic text-sm font-medium">Unavailable</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onOpenAddModal(day)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
                >
                  + Add Slot
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
