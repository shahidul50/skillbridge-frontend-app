"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2
} from 'lucide-react';
import AvailabilityCard from '@/components/modules/dashboard/tutor/AvailabilityCard';
import AddSlotModal from '@/components/modules/dashboard/tutor/AddSlotModal';
import { 
  getWeeklyAvailableSlots, 
  createWeeklyAvailableSlot, 
  deleteWeeklyAvailableSlot 
} from '@/actions/tutor.action';
import { toast } from 'sonner';
import { parse, format, compareAsc } from 'date-fns';

const DAYS_OF_WEEK = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const formatTo12h = (time24) => {
  if (!time24) return "";
  try {
    const date = parse(time24, 'HH:mm', new Date());
    return format(date, 'hh:mm a');
  } catch (error) {
    return time24;
  }
};

const formatTo24h = (time12) => {
  if (!time12) return "";
  try {
    const date = parse(time12, 'h:mm a', new Date());
    return format(date, 'HH:mm');
  } catch (error) {
    return time12;
  }
};

const EMPTY_AVAILABILITY = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

export default function AvailabilityModule() {
  const [availability, setAvailability] = useState(EMPTY_AVAILABILITY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getWeeklyAvailableSlots();
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.data) {
        const grouped = { ...EMPTY_AVAILABILITY };
        // Ensure every day is initialized
        DAYS_OF_WEEK.forEach(day => grouped[day] = []);
        
        // Sort slots by start time using date-fns
        const sortedData = [...res.data].sort((a, b) => {
          const timeA = a.startTime || "00:00";
          const timeB = b.startTime || "00:00";
          
          try {
            const dateA = parse(timeA, 'HH:mm', new Date());
            const dateB = parse(timeB, 'HH:mm', new Date());
            return compareAsc(dateA, dateB);
          } catch (error) {
            return 0;
          }
        });

        sortedData.forEach(slot => {
          if (grouped[slot.dayOfWeek]) {
            grouped[slot.dayOfWeek].push({
              id: slot.id || slot._id,
              start: formatTo12h(slot.startTime),
              end: formatTo12h(slot.endTime)
            });
          }
        });
        setAvailability(grouped);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load availability");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const deleteSlot = async (day, id) => {
    try {
      const res = await deleteWeeklyAvailableSlot(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Slot deleted successfully");
        fetchAvailability();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const openAddModal = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleAddSlot = async (day, slot) => {
    try {
      const payload = {
        dayOfWeek: day,
        startTime: formatTo24h(slot.start),
        endTime: formatTo24h(slot.end)
      };
      
      const res = await createWeeklyAvailableSlot(payload);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Slot added successfully");
        fetchAvailability();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };



  if (isLoading && Object.values(availability).flat().length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Manage Availability</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set your recurring weekly teaching hours.
          </p>
        </div>

      </div>

      {/* Weekly List */}
      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => (
          <AvailabilityCard
            key={day}
            day={day}
            slots={availability[day]}
            onDeleteSlot={deleteSlot}
            onOpenAddModal={openAddModal}
          />
        ))}
      </div>

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        day={selectedDay}
        onAddSlot={handleAddSlot}
      />
    </>
  );
}
